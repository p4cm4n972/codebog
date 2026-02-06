/**
 * ALGOBOG Access Control
 *
 * Security layer for controlling access to districts, buildings, and problems.
 * All checks are performed SERVER-SIDE - never trust client state.
 *
 * Access hierarchy:
 * 1. Admin/Moderator → Full access (unlockAll flag)
 * 2. Gem Unlock → Purchased access bypass
 * 3. Progression → Earned access via completion
 */

import { getAdminDatabases, toDocument, toDocuments } from '../appwrite-admin';
import { Query, ID } from 'node-appwrite';
import { getDistrictUnlockCost, getBuildingUnlockCost, getProblemUnlockCost, isValidSlug } from './gem-config';

// ============================================================================
// TYPES
// ============================================================================

export interface AccessResult {
  hasAccess: boolean;
  reason: 'unlocked' | 'gem_unlock' | 'progression' | 'admin' | 'locked' | 'invalid';
  message?: string;
}

export interface AlgoDistrict {
  $id: string;
  slug: string;
  name: string;
  order: number;
  unlockRequirement?: string; // JSON: { districtSlug: string, minPercent: number }
}

export interface AlgoBuilding {
  $id: string;
  slug: string;
  districtSlug: string;
  name: string;
  order: number;
  totalProblems: number;
  unlockRequirement?: string; // JSON: { buildingSlug: string, minPercent: number }
}

export interface AlgoProblem {
  $id: string;
  slug: string;
  buildingSlug: string;
  districtSlug: string;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AlgoProgress {
  $id: string;
  userId: string;
  buildingSlug: string;
  completedProblems: number;
  totalProblems: number;
}

export interface AlgoUnlock {
  $id: string;
  userId: string;
  targetType: 'district' | 'building' | 'problem';
  targetSlug: string;
  gemsCost: number;
  unlockedAt: string;
}

// ============================================================================
// COLLECTION IDS (to be added to appwrite-admin.ts)
// ============================================================================

export const ALGO_COLLECTIONS = {
  DISTRICTS: 'algo-districts',
  BUILDINGS: 'algo-buildings',
  PROBLEMS: 'algo-problems',
  SUBMISSIONS: 'algo-submissions',
  PROGRESS: 'algo-progress',
  UNLOCKS: 'algo-unlocks',
} as const;

// ============================================================================
// GEM UNLOCK CHECKS
// ============================================================================

/**
 * Check if user has gem-unlocked a specific target
 * @returns The unlock document if exists, null otherwise
 */
export async function checkAlgoGemUnlock(
  userId: string,
  targetType: 'district' | 'building' | 'problem',
  targetSlug: string
): Promise<AlgoUnlock | null> {
  // Validate inputs to prevent injection
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }
  if (!isValidSlug(targetSlug)) {
    throw new Error('Invalid target slug format');
  }

  const databases = getAdminDatabases();

  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.UNLOCKS,
      [
        Query.equal('userId', userId),
        Query.equal('targetType', targetType),
        Query.equal('targetSlug', targetSlug),
        Query.limit(1),
      ]
    );

    if (response.documents.length > 0) {
      return toDocument<AlgoUnlock>(response.documents[0]);
    }
    return null;
  } catch {
    // Collection might not exist yet during setup
    return null;
  }
}

/**
 * Create a gem unlock record
 * @throws Error if already unlocked (prevents double-spending)
 */
export async function createAlgoGemUnlock(
  userId: string,
  targetType: 'district' | 'building' | 'problem',
  targetSlug: string,
  gemsCost: number
): Promise<AlgoUnlock> {
  // Validate inputs
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }
  if (!isValidSlug(targetSlug)) {
    throw new Error('Invalid target slug format');
  }
  if (gemsCost < 0 || !Number.isInteger(gemsCost)) {
    throw new Error('Invalid gems cost');
  }

  // Check for existing unlock (prevent double-spending)
  const existing = await checkAlgoGemUnlock(userId, targetType, targetSlug);
  if (existing) {
    throw new Error('Target already unlocked');
  }

  const databases = getAdminDatabases();

  const unlock = await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    ALGO_COLLECTIONS.UNLOCKS,
    ID.unique(),
    {
      userId,
      targetType,
      targetSlug,
      gemsCost,
      unlockedAt: new Date().toISOString(),
    }
  );

  return toDocument<AlgoUnlock>(unlock);
}

// ============================================================================
// DISTRICT ACCESS
// ============================================================================

/**
 * Check if user has access to a district
 */
export async function isDistrictUnlocked(
  userId: string,
  districtSlug: string,
  unlockAll: boolean = false
): Promise<AccessResult> {
  // Admin/moderator bypass
  if (unlockAll) {
    return { hasAccess: true, reason: 'admin' };
  }

  // Validate slug
  if (!isValidSlug(districtSlug)) {
    return { hasAccess: false, reason: 'invalid', message: 'Invalid district slug' };
  }

  const databases = getAdminDatabases();

  // Get district info
  let district: AlgoDistrict;
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.DISTRICTS,
      [Query.equal('slug', districtSlug), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return { hasAccess: false, reason: 'invalid', message: 'District not found' };
    }

    district = toDocument<AlgoDistrict>(response.documents[0]);
  } catch {
    return { hasAccess: false, reason: 'invalid', message: 'Error fetching district' };
  }

  // First district is always unlocked
  if (district.order === 1) {
    return { hasAccess: true, reason: 'unlocked' };
  }

  // Check gem unlock
  const gemUnlock = await checkAlgoGemUnlock(userId, 'district', districtSlug);
  if (gemUnlock) {
    return { hasAccess: true, reason: 'gem_unlock' };
  }

  // Check progression requirement
  if (district.unlockRequirement) {
    try {
      const requirement = JSON.parse(district.unlockRequirement) as {
        districtSlug: string;
        minPercent: number;
      };

      // Validate requirement structure
      if (!requirement.districtSlug || typeof requirement.minPercent !== 'number') {
        return { hasAccess: false, reason: 'locked', message: 'Invalid unlock requirement' };
      }

      // Get user progress for required district
      const progressPercent = await getDistrictProgressPercent(userId, requirement.districtSlug);

      if (progressPercent >= requirement.minPercent) {
        return { hasAccess: true, reason: 'progression' };
      }

      return {
        hasAccess: false,
        reason: 'locked',
        message: `Complete ${requirement.minPercent}% of ${requirement.districtSlug} to unlock`,
      };
    } catch {
      return { hasAccess: false, reason: 'locked', message: 'Error checking progression' };
    }
  }

  return { hasAccess: false, reason: 'locked' };
}

// ============================================================================
// BUILDING ACCESS
// ============================================================================

/**
 * Check if user has access to a building
 */
export async function isBuildingUnlocked(
  userId: string,
  buildingSlug: string,
  unlockAll: boolean = false
): Promise<AccessResult> {
  // Admin/moderator bypass
  if (unlockAll) {
    return { hasAccess: true, reason: 'admin' };
  }

  // Validate slug
  if (!isValidSlug(buildingSlug)) {
    return { hasAccess: false, reason: 'invalid', message: 'Invalid building slug' };
  }

  const databases = getAdminDatabases();

  // Get building info
  let building: AlgoBuilding;
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.BUILDINGS,
      [Query.equal('slug', buildingSlug), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return { hasAccess: false, reason: 'invalid', message: 'Building not found' };
    }

    building = toDocument<AlgoBuilding>(response.documents[0]);
  } catch {
    return { hasAccess: false, reason: 'invalid', message: 'Error fetching building' };
  }

  // First check: Does user have access to the parent district?
  const districtAccess = await isDistrictUnlocked(userId, building.districtSlug, false);
  if (!districtAccess.hasAccess) {
    return {
      hasAccess: false,
      reason: 'locked',
      message: `District ${building.districtSlug} is locked`,
    };
  }

  // First building in district is always unlocked (if district is unlocked)
  if (building.order === 1) {
    return { hasAccess: true, reason: 'unlocked' };
  }

  // Check gem unlock for this building
  const gemUnlock = await checkAlgoGemUnlock(userId, 'building', buildingSlug);
  if (gemUnlock) {
    return { hasAccess: true, reason: 'gem_unlock' };
  }

  // Check progression: previous building completion
  if (building.unlockRequirement) {
    try {
      const requirement = JSON.parse(building.unlockRequirement) as {
        buildingSlug: string;
        minPercent: number;
      };

      const progressPercent = await getBuildingProgressPercent(userId, requirement.buildingSlug);

      if (progressPercent >= requirement.minPercent) {
        return { hasAccess: true, reason: 'progression' };
      }

      return {
        hasAccess: false,
        reason: 'locked',
        message: `Complete ${requirement.minPercent}% of ${requirement.buildingSlug} to unlock`,
      };
    } catch {
      return { hasAccess: false, reason: 'locked', message: 'Error checking progression' };
    }
  }

  return { hasAccess: false, reason: 'locked' };
}

// ============================================================================
// PROBLEM ACCESS
// ============================================================================

/**
 * Check if user has access to a specific problem
 */
export async function isProblemUnlocked(
  userId: string,
  problemSlug: string,
  unlockAll: boolean = false
): Promise<AccessResult> {
  // Admin/moderator bypass
  if (unlockAll) {
    return { hasAccess: true, reason: 'admin' };
  }

  // Validate slug
  if (!isValidSlug(problemSlug)) {
    return { hasAccess: false, reason: 'invalid', message: 'Invalid problem slug' };
  }

  const databases = getAdminDatabases();

  // Get problem info
  let problem: AlgoProblem;
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.PROBLEMS,
      [Query.equal('slug', problemSlug), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return { hasAccess: false, reason: 'invalid', message: 'Problem not found' };
    }

    problem = toDocument<AlgoProblem>(response.documents[0]);
  } catch {
    return { hasAccess: false, reason: 'invalid', message: 'Error fetching problem' };
  }

  // First check: Does user have access to the parent building?
  const buildingAccess = await isBuildingUnlocked(userId, problem.buildingSlug, false);
  if (!buildingAccess.hasAccess) {
    return {
      hasAccess: false,
      reason: 'locked',
      message: `Building ${problem.buildingSlug} is locked`,
    };
  }

  // First problem in building is always unlocked (if building is unlocked)
  if (problem.order === 1) {
    return { hasAccess: true, reason: 'unlocked' };
  }

  // Check gem unlock for this problem
  const gemUnlock = await checkAlgoGemUnlock(userId, 'problem', problemSlug);
  if (gemUnlock) {
    return { hasAccess: true, reason: 'gem_unlock' };
  }

  // Check if user completed the previous problem
  const previousProblem = await getPreviousProblem(problem.buildingSlug, problem.order);
  if (!previousProblem) {
    // No previous problem means this should be accessible
    return { hasAccess: true, reason: 'unlocked' };
  }

  const hasCompletedPrevious = await hasCompletedProblem(userId, previousProblem.slug);
  if (hasCompletedPrevious) {
    return { hasAccess: true, reason: 'progression' };
  }

  return {
    hasAccess: false,
    reason: 'locked',
    message: `Complete problem ${previousProblem.order} first`,
  };
}

// ============================================================================
// PROGRESS HELPERS
// ============================================================================

/**
 * Get user's progress percentage for a district
 */
async function getDistrictProgressPercent(userId: string, districtSlug: string): Promise<number> {
  const databases = getAdminDatabases();

  try {
    // Get all buildings in district
    const buildingsResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.BUILDINGS,
      [Query.equal('districtSlug', districtSlug)]
    );

    if (buildingsResponse.documents.length === 0) {
      return 0;
    }

    const buildings = toDocuments<AlgoBuilding>(buildingsResponse.documents);
    const buildingSlugs = buildings.map((b) => b.slug);

    // Get user progress for all buildings
    const progressResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.PROGRESS,
      [
        Query.equal('userId', userId),
        Query.contains('buildingSlug', buildingSlugs),
      ]
    );

    const progressDocs = toDocuments<AlgoProgress>(progressResponse.documents);

    let totalCompleted = 0;
    let totalProblems = 0;

    for (const building of buildings) {
      totalProblems += building.totalProblems;
      const progress = progressDocs.find((p) => p.buildingSlug === building.slug);
      if (progress) {
        totalCompleted += progress.completedProblems;
      }
    }

    if (totalProblems === 0) return 0;
    return Math.round((totalCompleted / totalProblems) * 100);
  } catch {
    return 0;
  }
}

/**
 * Get user's progress percentage for a building
 */
async function getBuildingProgressPercent(userId: string, buildingSlug: string): Promise<number> {
  const databases = getAdminDatabases();

  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.PROGRESS,
      [
        Query.equal('userId', userId),
        Query.equal('buildingSlug', buildingSlug),
        Query.limit(1),
      ]
    );

    if (response.documents.length === 0) {
      return 0;
    }

    const progress = toDocument<AlgoProgress>(response.documents[0]);
    if (progress.totalProblems === 0) return 0;

    return Math.round((progress.completedProblems / progress.totalProblems) * 100);
  } catch {
    return 0;
  }
}

/**
 * Get the previous problem in order within a building
 */
async function getPreviousProblem(buildingSlug: string, currentOrder: number): Promise<AlgoProblem | null> {
  if (currentOrder <= 1) return null;

  const databases = getAdminDatabases();

  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.PROBLEMS,
      [
        Query.equal('buildingSlug', buildingSlug),
        Query.equal('order', currentOrder - 1),
        Query.limit(1),
      ]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return toDocument<AlgoProblem>(response.documents[0]);
  } catch {
    return null;
  }
}

/**
 * Check if user has completed a specific problem
 */
async function hasCompletedProblem(userId: string, problemSlug: string): Promise<boolean> {
  const databases = getAdminDatabases();

  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      ALGO_COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('userId', userId),
        Query.equal('problemSlug', problemSlug),
        Query.equal('passed', true),
        Query.limit(1),
      ]
    );

    return response.documents.length > 0;
  } catch {
    return false;
  }
}

// ============================================================================
// UNLOCK COST GETTERS (with validation)
// ============================================================================

/**
 * Get the cost to unlock a target with gems
 * @throws Error if target is invalid (prevents bypass)
 */
export async function getUnlockCost(
  targetType: 'district' | 'building' | 'problem',
  targetSlug: string,
  difficulty?: 'easy' | 'medium' | 'hard'
): Promise<number> {
  if (!isValidSlug(targetSlug)) {
    throw new Error('Invalid target slug');
  }

  switch (targetType) {
    case 'district':
      return getDistrictUnlockCost(targetSlug);

    case 'building':
      return getBuildingUnlockCost(targetSlug);

    case 'problem':
      if (!difficulty) {
        // Fetch problem to get difficulty
        const databases = getAdminDatabases();
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          ALGO_COLLECTIONS.PROBLEMS,
          [Query.equal('slug', targetSlug), Query.limit(1)]
        );

        if (response.documents.length === 0) {
          throw new Error('Problem not found');
        }

        const problem = toDocument<AlgoProblem>(response.documents[0]);
        return getProblemUnlockCost(problem.difficulty);
      }
      return getProblemUnlockCost(difficulty);

    default:
      throw new Error('Invalid target type');
  }
}
