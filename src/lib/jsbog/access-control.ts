/**
 * JSBOG Access Control
 *
 * Security layer for controlling access to seasons, modules, and exercises.
 * All checks are performed SERVER-SIDE - never trust client state.
 *
 * Access hierarchy:
 * 1. Admin/Moderator → Full access (unlockAll flag)
 * 2. Season lock → Time-based (JSBOG_LAUNCH_DATE + unlockAfterMonths)
 * 3. Gem Unlock → Purchased access bypass (uses existing exercise-unlocks collection)
 * 4. Progression → Earned access via previous exercise completion
 *
 * NOTE: Réutilise le système de gems existant (src/lib/gems/unlocks.ts)
 * avec des slugs composés format: "jsbog:season:module:exercise"
 */

import { getAdminDatabases, DATABASE_ID, toDocuments } from '../appwrite-admin';
import { Query } from 'node-appwrite';
import { getSeasonBySlug, getModuleBySlug, isSeasonUnlocked } from '../js-seasons-config';
import { checkGemUnlock } from '../gems/unlocks';

// ============================================================================
// TYPES
// ============================================================================

export interface AccessResult {
  hasAccess: boolean;
  reason: 'unlocked' | 'gem_unlock' | 'progression' | 'admin' | 'locked' | 'season_locked' | 'invalid';
  message?: string;
  gemCost?: number;
}

export interface JsbogSubmission {
  $id: string;
  userId: string;
  seasonSlug: string;
  moduleSlug: string;
  exerciseSlug: string;
  passed: boolean;
  submittedAt: string;
}

// ============================================================================
// COLLECTION IDS
// ============================================================================

const PISCINE_SUBMISSIONS_COLLECTION = 'piscine-submissions';

// ============================================================================
// GEM COSTS CONFIGURATION
// ============================================================================

/**
 * Gem costs for JSBOG exercises based on season difficulty
 */
export const JSBOG_GEM_COSTS: Record<string, number> = {
  // Saison 1: JS Chrono - Avancé - 15 gems
  'chrono': 15,
  // Saison 2: JS Abyss - Intermédiaire - 10 gems
  'abyss': 10,
  // Saison 3: JS Forge - Intermédiaire - 10 gems
  'forge': 10,
  // Saison 4: JS Realm - Intermédiaire - 10 gems
  'realm': 10,
};

export const DEFAULT_EXERCISE_GEM_COST = 10;

/**
 * Get the gem cost to unlock an exercise
 */
export function getExerciseUnlockCost(seasonSlug: string): number {
  return JSBOG_GEM_COSTS[seasonSlug] ?? DEFAULT_EXERCISE_GEM_COST;
}

/**
 * Build the composite slug for JSBOG exercises
 * Format: "jsbog:season:module:exercise"
 * Used with the existing exercise-unlocks collection
 */
export function buildJsbogSlug(seasonSlug: string, moduleSlug: string, exerciseSlug: string): string {
  return `jsbog:${seasonSlug}:${moduleSlug}:${exerciseSlug}`;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate slug format to prevent injection attacks
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  // Allow alphanumeric, hyphens, underscores - max 100 chars
  return /^[a-zA-Z0-9_-]{1,100}$/.test(slug);
}

// ============================================================================
// PROGRESSION HELPERS
// ============================================================================

/**
 * Check if user has completed a specific exercise
 */
export async function hasCompletedExercise(
  userId: string,
  seasonSlug: string,
  moduleSlug: string,
  exerciseSlug: string
): Promise<boolean> {
  const databases = getAdminDatabases();

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PISCINE_SUBMISSIONS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('seasonSlug', seasonSlug),
        Query.equal('moduleSlug', moduleSlug),
        Query.equal('exerciseSlug', exerciseSlug),
        Query.equal('passed', true),
        Query.limit(1),
      ]
    );

    return response.documents.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get all completed exercises for a module
 */
export async function getCompletedExercises(
  userId: string,
  seasonSlug: string,
  moduleSlug: string
): Promise<string[]> {
  const databases = getAdminDatabases();

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PISCINE_SUBMISSIONS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('seasonSlug', seasonSlug),
        Query.equal('moduleSlug', moduleSlug),
        Query.equal('passed', true),
        Query.limit(100),
      ]
    );

    return toDocuments<JsbogSubmission>(response.documents).map(doc => doc.exerciseSlug);
  } catch {
    return [];
  }
}

/**
 * Get the previous exercise slug based on current index
 * Returns null if this is the first exercise (index 0)
 */
function getPreviousExerciseSlug(exerciseIndex: number): string | null {
  if (exerciseIndex <= 0) return null;
  // Format: ex00, ex01, ex02...
  return `ex${(exerciseIndex - 1).toString().padStart(2, '0')}`;
}

/**
 * Get exercise index from slug (ex00 -> 0, ex01 -> 1, etc.)
 */
function getExerciseIndex(exerciseSlug: string): number {
  const match = exerciseSlug.match(/ex(\d+)/);
  if (!match) return -1;
  return parseInt(match[1], 10);
}

// ============================================================================
// ACCESS CHECK FUNCTIONS
// ============================================================================

/**
 * Check if user has access to a season (time-based unlock)
 */
export function isSeasonAccessible(
  seasonSlug: string,
  unlockAll: boolean = false
): AccessResult {
  // Admin bypass
  if (unlockAll) {
    return { hasAccess: true, reason: 'admin' };
  }

  const season = getSeasonBySlug(seasonSlug);
  if (!season) {
    return { hasAccess: false, reason: 'invalid', message: 'Season not found' };
  }

  if (isSeasonUnlocked(season)) {
    return { hasAccess: true, reason: 'unlocked' };
  }

  return {
    hasAccess: false,
    reason: 'season_locked',
    message: `Season ${season.name} is not yet available`,
  };
}

/**
 * Check if user has access to a module within a season
 * For now, all modules in an unlocked season are accessible
 */
export function isModuleAccessible(
  seasonSlug: string,
  moduleSlug: string,
  unlockAll: boolean = false
): AccessResult {
  // First check season access
  const seasonAccess = isSeasonAccessible(seasonSlug, unlockAll);
  if (!seasonAccess.hasAccess) {
    return seasonAccess;
  }

  const jsModule = getModuleBySlug(seasonSlug, moduleSlug);
  if (!jsModule) {
    return { hasAccess: false, reason: 'invalid', message: 'Module not found' };
  }

  // All modules in an unlocked season are accessible
  return { hasAccess: true, reason: 'unlocked' };
}

/**
 * Check if user has access to a specific exercise
 * This is the main function to call for exercise access control
 *
 * Uses the existing gems system via checkGemUnlock with composite slug
 */
export async function isExerciseUnlocked(
  userId: string,
  seasonSlug: string,
  moduleSlug: string,
  exerciseSlug: string,
  unlockAll: boolean = false
): Promise<AccessResult> {
  // 1. Admin/moderator bypass
  if (unlockAll) {
    return { hasAccess: true, reason: 'admin' };
  }

  // 2. Validate slugs
  if (!isValidSlug(seasonSlug) || !isValidSlug(moduleSlug) || !isValidSlug(exerciseSlug)) {
    return { hasAccess: false, reason: 'invalid', message: 'Invalid slug format' };
  }

  // 3. Check season access (time-based)
  const seasonAccess = isSeasonAccessible(seasonSlug, false);
  if (!seasonAccess.hasAccess) {
    return seasonAccess;
  }

  // 4. Check module exists
  const jsModule = getModuleBySlug(seasonSlug, moduleSlug);
  if (!jsModule) {
    return { hasAccess: false, reason: 'invalid', message: 'Module not found' };
  }

  // 5. Get exercise index
  const exerciseIndex = getExerciseIndex(exerciseSlug);
  if (exerciseIndex < 0) {
    return { hasAccess: false, reason: 'invalid', message: 'Invalid exercise slug' };
  }

  // 6. First exercise is always unlocked (if season/module are accessible)
  if (exerciseIndex === 0) {
    return { hasAccess: true, reason: 'unlocked' };
  }

  // 7. Check gem unlock using existing system with composite slug
  const compositeSlug = buildJsbogSlug(seasonSlug, moduleSlug, exerciseSlug);
  const gemUnlock = await checkGemUnlock(userId, compositeSlug);
  if (gemUnlock) {
    return { hasAccess: true, reason: 'gem_unlock' };
  }

  // 8. Check progression - previous exercise must be completed
  const previousSlug = getPreviousExerciseSlug(exerciseIndex);
  if (!previousSlug) {
    // Should not happen after index 0 check, but safety
    return { hasAccess: true, reason: 'unlocked' };
  }

  const hasCompletedPrevious = await hasCompletedExercise(userId, seasonSlug, moduleSlug, previousSlug);
  if (hasCompletedPrevious) {
    return { hasAccess: true, reason: 'progression' };
  }

  // 9. Access denied - return gem cost for unlock option
  const gemCost = getExerciseUnlockCost(seasonSlug);
  return {
    hasAccess: false,
    reason: 'locked',
    message: `Complete exercise ${previousSlug} first or unlock with ${gemCost} gems`,
    gemCost,
  };
}

// ============================================================================
// BATCH ACCESS CHECK (for module overview)
// ============================================================================

/**
 * Get access status for all exercises in a module
 * Used for rendering the module page with proper lock states
 */
export async function getModuleExerciseAccess(
  userId: string,
  seasonSlug: string,
  moduleSlug: string,
  exerciseCount: number,
  unlockAll: boolean = false
): Promise<Map<string, AccessResult>> {
  const accessMap = new Map<string, AccessResult>();

  // Get all completed exercises for efficiency
  const completedExercises = await getCompletedExercises(userId, seasonSlug, moduleSlug);
  const completedSet = new Set(completedExercises);

  // Check gem unlocks for each exercise using the existing system
  const gemUnlockSet = new Set<string>();
  for (let i = 1; i < exerciseCount; i++) {
    const exerciseSlug = `ex${i.toString().padStart(2, '0')}`;
    const compositeSlug = buildJsbogSlug(seasonSlug, moduleSlug, exerciseSlug);
    const gemUnlock = await checkGemUnlock(userId, compositeSlug);
    if (gemUnlock) {
      gemUnlockSet.add(exerciseSlug);
    }
  }

  const gemCost = getExerciseUnlockCost(seasonSlug);

  for (let i = 0; i < exerciseCount; i++) {
    const exerciseSlug = `ex${i.toString().padStart(2, '0')}`;

    // Admin bypass
    if (unlockAll) {
      accessMap.set(exerciseSlug, { hasAccess: true, reason: 'admin' });
      continue;
    }

    // First exercise always unlocked
    if (i === 0) {
      accessMap.set(exerciseSlug, { hasAccess: true, reason: 'unlocked' });
      continue;
    }

    // Check gem unlock
    if (gemUnlockSet.has(exerciseSlug)) {
      accessMap.set(exerciseSlug, { hasAccess: true, reason: 'gem_unlock' });
      continue;
    }

    // Check previous exercise completion
    const previousSlug = `ex${(i - 1).toString().padStart(2, '0')}`;
    if (completedSet.has(previousSlug)) {
      accessMap.set(exerciseSlug, { hasAccess: true, reason: 'progression' });
      continue;
    }

    // Locked
    accessMap.set(exerciseSlug, {
      hasAccess: false,
      reason: 'locked',
      message: `Complete ${previousSlug} first`,
      gemCost,
    });
  }

  return accessMap;
}
