/**
 * ALGOBOG Problems API
 *
 * GET /api/algobog/problems?building=xxx - Get all problems for a building
 * GET /api/algobog/problems?slug=xxx - Get a specific problem by slug
 *
 * Security:
 * - JWT verification required for problem content (starter code, tests)
 * - Public metadata available without auth (for listings)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { getAdminDatabases, toDocument, toDocuments } from '@/lib/appwrite-admin';
import { verifyUserFromJWT } from '@/lib/access-control';
import { isProblemUnlocked, isBuildingUnlocked, ALGO_COLLECTIONS } from '@/lib/algobog/access-control';
import { isValidSlug } from '@/lib/algobog/gem-config';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// ============================================================================
// TYPES
// ============================================================================

interface AlgoProblemFull {
  $id: string;
  slug: string;
  buildingSlug: string;
  districtSlug: string;
  problemNumber: number;
  localNumber: number;
  leetcodeNumber?: number;
  leetcodeTitle?: string;
  title: string;
  statement: string;
  context: string;
  difficulty: 'easy' | 'medium' | 'hard';
  floor: number;
  starterCode: string;
  testCode: string;
  solution?: string;
  order: number;
  xpReward: number;
  timeLimit?: number;
  tags?: string;
  hints?: string;
  approaches?: string;
}

interface ProblemListItem {
  slug: string;
  title: string;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

interface UserProblemStatus {
  isLocked: boolean;
  isCompleted: boolean;
  reason?: string;
}

// ============================================================================
// GET - Get problems for a building or a specific problem
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const buildingSlug = searchParams.get('building');
    const problemSlug = searchParams.get('slug');
    const districtSlug = searchParams.get('district');

    // ========================================================================
    // Case 1: Get a specific problem by slug
    // ========================================================================
    if (problemSlug) {
      return await getSpecificProblem(request, problemSlug);
    }

    // ========================================================================
    // Case 2: Get all problems for a building
    // ========================================================================
    if (buildingSlug) {
      return await getBuildingProblems(request, buildingSlug);
    }

    // ========================================================================
    // Case 3: Get all problems for a district (summary only)
    // ========================================================================
    if (districtSlug) {
      return await getDistrictProblems(districtSlug);
    }

    return NextResponse.json(
      { error: 'Either building, slug, or district parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('ALGOBOG problems API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// Get a specific problem with full content
// ============================================================================

async function getSpecificProblem(
  request: NextRequest,
  problemSlug: string
): Promise<NextResponse> {
  if (!isValidSlug(problemSlug)) {
    return NextResponse.json(
      { error: 'Invalid problem slug' },
      { status: 400 }
    );
  }

  // Authentication required for full problem content
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const jwt = authHeader.substring(7);
  const userInfo = await verifyUserFromJWT(jwt);

  if (!userInfo) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const { userId, unlockAll } = userInfo;
  const databases = getAdminDatabases();

  // Fetch the problem
  const response = await databases.listDocuments(
    DATABASE_ID,
    ALGO_COLLECTIONS.PROBLEMS,
    [Query.equal('slug', problemSlug), Query.limit(1)]
  );

  if (response.documents.length === 0) {
    return NextResponse.json(
      { error: 'Problem not found' },
      { status: 404 }
    );
  }

  const problem = toDocument<AlgoProblemFull>(response.documents[0]);

  // Check access
  const access = await isProblemUnlocked(userId, problemSlug, unlockAll);

  if (!access.hasAccess) {
    return NextResponse.json(
      {
        error: 'Problem is locked',
        reason: access.reason,
        message: access.message,
        // Return limited info for locked problems
        problem: {
          slug: problem.slug,
          title: problem.title,
          difficulty: problem.difficulty,
          order: problem.order,
          isLocked: true,
        },
      },
      { status: 403 }
    );
  }

  // Get building info for navigation
  const buildingResponse = await databases.listDocuments(
    DATABASE_ID,
    ALGO_COLLECTIONS.BUILDINGS,
    [Query.equal('slug', problem.buildingSlug), Query.limit(1)]
  );

  const building = buildingResponse.documents[0];

  // Get district info
  const districtResponse = await databases.listDocuments(
    DATABASE_ID,
    ALGO_COLLECTIONS.DISTRICTS,
    [Query.equal('slug', problem.districtSlug), Query.limit(1)]
  );

  const district = districtResponse.documents[0];

  // Check if user has completed this problem
  const submissionResponse = await databases.listDocuments(
    DATABASE_ID,
    ALGO_COLLECTIONS.SUBMISSIONS,
    [
      Query.equal('userId', userId),
      Query.equal('problemSlug', problemSlug),
      Query.equal('passed', true),
      Query.limit(1),
    ]
  );

  const isCompleted = submissionResponse.documents.length > 0;

  // Parse hints if available
  let hints: string[] = [];
  if (problem.hints) {
    try {
      hints = JSON.parse(problem.hints);
    } catch {
      hints = [];
    }
  }

  return NextResponse.json({
    problem: {
      slug: problem.slug,
      title: problem.title,
      statement: problem.statement,
      starterCode: problem.starterCode,
      testCode: problem.testCode,
      difficulty: problem.difficulty,
      order: problem.order,
      xpReward: problem.xpReward,
      hints,
      buildingSlug: problem.buildingSlug,
      buildingName: building?.name || problem.buildingSlug,
      districtSlug: problem.districtSlug,
      districtName: district?.name || problem.districtSlug,
      isCompleted,
    },
  });
}

// ============================================================================
// Get all problems for a building
// ============================================================================

async function getBuildingProblems(
  request: NextRequest,
  buildingSlug: string
): Promise<NextResponse> {
  if (!isValidSlug(buildingSlug)) {
    return NextResponse.json(
      { error: 'Invalid building slug' },
      { status: 400 }
    );
  }

  const databases = getAdminDatabases();

  // Check if user is authenticated (optional for listing)
  let userId: string | null = null;
  let unlockAll = false;

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const jwt = authHeader.substring(7);
    const userInfo = await verifyUserFromJWT(jwt);
    if (userInfo) {
      userId = userInfo.userId;
      unlockAll = userInfo.unlockAll;
    }
  }

  // Check building access if user is authenticated
  if (userId) {
    const buildingAccess = await isBuildingUnlocked(userId, buildingSlug, unlockAll);
    if (!buildingAccess.hasAccess) {
      return NextResponse.json(
        {
          error: 'Building is locked',
          reason: buildingAccess.reason,
          message: buildingAccess.message,
        },
        { status: 403 }
      );
    }
  }

  // Fetch all problems for this building
  const response = await databases.listDocuments(
    DATABASE_ID,
    ALGO_COLLECTIONS.PROBLEMS,
    [
      Query.equal('buildingSlug', buildingSlug),
      Query.orderAsc('order'),
      Query.limit(200), // Max problems per building
    ]
  );

  const problems = toDocuments<AlgoProblemFull>(response.documents);

  // Get user's completed problems if authenticated
  let completedSlugs = new Set<string>();
  let gemUnlockedSlugs = new Set<string>();
  if (userId) {
    const [submissionsResponse, unlocksResponse] = await Promise.all([
      databases.listDocuments(
        DATABASE_ID,
        ALGO_COLLECTIONS.SUBMISSIONS,
        [
          Query.equal('userId', userId),
          Query.equal('buildingSlug', buildingSlug),
          Query.equal('passed', true),
        ]
      ),
      databases.listDocuments(
        DATABASE_ID,
        ALGO_COLLECTIONS.UNLOCKS,
        [
          Query.equal('userId', userId),
          Query.equal('targetType', 'problem'),
          Query.limit(200),
        ]
      ),
    ]);

    completedSlugs = new Set(
      submissionsResponse.documents.map((d) => d.problemSlug as string)
    );

    // Filter gem unlocks to only problems in this building (O(1) lookup via Set)
    const buildingProblemSlugs = new Set(problems.map((p) => p.slug));
    gemUnlockedSlugs = new Set(
      unlocksResponse.documents
        .filter((d) => buildingProblemSlugs.has(d.targetSlug as string))
        .map((d) => d.targetSlug as string)
    );
  }

  // Determine lock status for each problem
  const problemsWithStatus: (ProblemListItem & UserProblemStatus)[] = await Promise.all(
    problems.map(async (problem, index) => {
      let isLocked = false;
      let reason: string | undefined;

      if (userId && !unlockAll) {
        // First problem is always unlocked if building is unlocked
        if (index === 0) {
          isLocked = false;
        } else if (gemUnlockedSlugs.has(problem.slug)) {
          // Gem unlock bypass — user purchased access
          isLocked = false;
        } else {
          // Check if previous problem is completed
          const prevProblem = problems[index - 1];
          if (prevProblem && !completedSlugs.has(prevProblem.slug)) {
            isLocked = true;
            reason = `Complete problem ${index} first`;
          }
        }
      }

      return {
        slug: problem.slug,
        title: problem.title,
        order: problem.order,
        difficulty: problem.difficulty,
        xpReward: problem.xpReward,
        isLocked,
        isCompleted: completedSlugs.has(problem.slug),
        reason,
      };
    })
  );

  // Count by difficulty
  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === 'easy').length,
    medium: problems.filter((p) => p.difficulty === 'medium').length,
    hard: problems.filter((p) => p.difficulty === 'hard').length,
    completed: completedSlugs.size,
  };

  return NextResponse.json({
    problems: problemsWithStatus,
    stats,
  });
}

// ============================================================================
// Get district problems summary
// ============================================================================

async function getDistrictProblems(districtSlug: string): Promise<NextResponse> {
  if (!isValidSlug(districtSlug)) {
    return NextResponse.json(
      { error: 'Invalid district slug' },
      { status: 400 }
    );
  }

  const databases = getAdminDatabases();

  // Get all buildings in district
  const buildingsResponse = await databases.listDocuments(
    DATABASE_ID,
    ALGO_COLLECTIONS.BUILDINGS,
    [Query.equal('districtSlug', districtSlug), Query.orderAsc('order')]
  );

  // Get problem counts for each building
  const buildingSummaries = await Promise.all(
    buildingsResponse.documents.map(async (building) => {
      const problemsResponse = await databases.listDocuments(
        DATABASE_ID,
        ALGO_COLLECTIONS.PROBLEMS,
        [Query.equal('buildingSlug', building.slug as string), Query.limit(1)]
      );

      return {
        slug: building.slug,
        name: building.name,
        order: building.order,
        totalProblems: problemsResponse.total,
      };
    })
  );

  return NextResponse.json({
    district: districtSlug,
    buildings: buildingSummaries,
    totalProblems: buildingSummaries.reduce((sum, b) => sum + (b.totalProblems as number), 0),
  });
}
