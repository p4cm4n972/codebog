/**
 * ALGOBOG Submissions API
 *
 * POST /api/algobog/submissions - Submit solution for a problem
 * GET /api/algobog/submissions - Get user's submissions for a problem
 *
 * Security:
 * - JWT verification required
 * - Access check before execution
 * - Server-side test validation (never trust client)
 * - Anti-farming: XP only on first completion
 */

import { NextRequest, NextResponse } from 'next/server';
import { Query, ID } from 'node-appwrite';
import { getAdminDatabases, toDocument, toDocuments } from '@/lib/appwrite-admin';
import { verifyUserFromJWT } from '@/lib/access-control';
import { isProblemUnlocked, ALGO_COLLECTIONS, AlgoProblem } from '@/lib/algobog/access-control';
import { executeInSandbox } from '@/lib/sandbox';
import { isValidSlug } from '@/lib/algobog/gem-config';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// ============================================================================
// TYPES
// ============================================================================

interface AlgoSubmission {
  $id: string;
  userId: string;
  problemSlug: string;
  buildingSlug: string;
  districtSlug: string;
  code: string;
  submittedAt: string;
  passed: boolean;
  testResults: string;
  executionTime: number;
}

interface SubmissionRequestBody {
  code: string;
  problemSlug: string;
  testCode?: string;
}

// ============================================================================
// GET - Get user's submissions for a problem
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const problemSlug = searchParams.get('problemSlug');

    // Validate problemSlug
    if (!problemSlug || !isValidSlug(problemSlug)) {
      return NextResponse.json(
        { error: 'Valid problemSlug is required' },
        { status: 400 }
      );
    }

    // Verify authentication
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

    const databases = getAdminDatabases();

    // Get user's submissions for this problem
    const response = await databases.listDocuments(
      DATABASE_ID,
      ALGO_COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('userId', userInfo.userId),
        Query.equal('problemSlug', problemSlug),
        Query.orderDesc('submittedAt'),
        Query.limit(10),
      ]
    );

    const submissions = toDocuments<AlgoSubmission>(response.documents);

    // Check if user has a passing submission
    const hasPassed = submissions.some((s) => s.passed);

    return NextResponse.json({
      submissions: submissions.map((s) => ({
        id: s.$id,
        submittedAt: s.submittedAt,
        passed: s.passed,
        executionTime: s.executionTime,
      })),
      hasPassed,
      totalSubmissions: response.total,
    });
  } catch (error) {
    console.error('ALGOBOG submissions GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Submit solution for a problem
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ========================================================================
    // 1. Authentication
    // ========================================================================
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

    // ========================================================================
    // 2. Parse and validate request body
    // ========================================================================
    let body: SubmissionRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { code, problemSlug, testCode } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (!problemSlug || !isValidSlug(problemSlug)) {
      return NextResponse.json(
        { error: 'Valid problemSlug is required' },
        { status: 400 }
      );
    }

    // ========================================================================
    // 3. Check access permissions
    // ========================================================================
    const access = await isProblemUnlocked(userId, problemSlug, unlockAll);

    if (!access.hasAccess) {
      return NextResponse.json(
        { error: 'Access denied', reason: access.reason, message: access.message },
        { status: 403 }
      );
    }

    // ========================================================================
    // 4. Get problem info (for test code and metadata)
    // ========================================================================
    const databases = getAdminDatabases();

    const problemResponse = await databases.listDocuments(
      DATABASE_ID,
      ALGO_COLLECTIONS.PROBLEMS,
      [Query.equal('slug', problemSlug), Query.limit(1)]
    );

    if (problemResponse.documents.length === 0) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    const problem = toDocument<AlgoProblem & { testCode?: string }>(problemResponse.documents[0]);

    // Use server-side test code if available (never trust client)
    const serverTestCode = problem.testCode || testCode;

    if (!serverTestCode) {
      return NextResponse.json(
        { error: 'Test code not configured for this problem' },
        { status: 500 }
      );
    }

    // ========================================================================
    // 5. Execute code in sandbox - SERVER-SIDE VALIDATION
    // ========================================================================
    const startTime = Date.now();
    const result = await executeInSandbox(code, serverTestCode);
    const executionTime = Date.now() - startTime;

    // ========================================================================
    // 6. Create submission record (only if tests passed)
    // ========================================================================
    if (result.results.passed) {
      // Check for existing passing submission (anti-farming)
      const existingSubmission = await databases.listDocuments(
        DATABASE_ID,
        ALGO_COLLECTIONS.SUBMISSIONS,
        [
          Query.equal('userId', userId),
          Query.equal('problemSlug', problemSlug),
          Query.equal('passed', true),
          Query.limit(1),
        ]
      );

      const isFirstCompletion = existingSubmission.documents.length === 0;

      // Create submission document - SERVER SIDE
      await databases.createDocument(
        DATABASE_ID,
        ALGO_COLLECTIONS.SUBMISSIONS,
        ID.unique(),
        {
          userId,
          problemSlug,
          buildingSlug: problem.buildingSlug,
          districtSlug: problem.districtSlug,
          code,
          submittedAt: new Date().toISOString(),
          passed: true,
          testResults: JSON.stringify(result.results),
          executionTime,
          xpEarned: isFirstCompletion ? 10 : 0, // Base XP, could be problem-specific
          isFirstCompletion,
        }
      );

      // Update progress if first completion
      if (isFirstCompletion) {
        await updateBuildingProgress(userId, problem.buildingSlug, problem.difficulty);
      }

      return NextResponse.json({
        ...result,
        submission: {
          created: true,
          isFirstCompletion,
          executionTime,
        },
      });
    }

    // ========================================================================
    // 7. Tests failed - return results without creating submission
    // ========================================================================
    return NextResponse.json({
      ...result,
      submission: {
        created: false,
        reason: 'Tests did not pass',
        executionTime,
      },
    });
  } catch (error) {
    console.error('ALGOBOG submission API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Update building progress after a problem completion
 */
async function updateBuildingProgress(
  userId: string,
  buildingSlug: string,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<void> {
  const databases = getAdminDatabases();

  try {
    // Get total problems in building
    const problemsResponse = await databases.listDocuments(
      DATABASE_ID,
      ALGO_COLLECTIONS.PROBLEMS,
      [Query.equal('buildingSlug', buildingSlug)]
    );

    const totalProblems = problemsResponse.total;

    // Count completed problems by difficulty
    const completedResponse = await databases.listDocuments(
      DATABASE_ID,
      ALGO_COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('userId', userId),
        Query.equal('buildingSlug', buildingSlug),
        Query.equal('passed', true),
        Query.equal('isFirstCompletion', true),
      ]
    );

    // Get unique completed problem slugs
    const completedSlugs = new Set(
      completedResponse.documents.map((d) => d.problemSlug as string)
    );
    const completedProblems = completedSlugs.size;
    const percentComplete = totalProblems > 0
      ? Math.round((completedProblems / totalProblems) * 100)
      : 0;

    const now = new Date().toISOString();

    // Check if progress record exists
    const progressResponse = await databases.listDocuments(
      DATABASE_ID,
      ALGO_COLLECTIONS.PROGRESS,
      [
        Query.equal('userId', userId),
        Query.equal('buildingSlug', buildingSlug),
        Query.limit(1),
      ]
    );

    if (progressResponse.documents.length > 0) {
      const existing = progressResponse.documents[0];

      // Increment difficulty counter
      const difficultyKey = `${difficulty}Completed` as 'easyCompleted' | 'mediumCompleted' | 'hardCompleted';
      const currentCount = (existing[difficultyKey] as number) || 0;
      const currentXp = (existing.totalXp as number) || 0;
      const xpGain = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;

      // Update existing progress
      await databases.updateDocument(
        DATABASE_ID,
        ALGO_COLLECTIONS.PROGRESS,
        existing.$id,
        {
          completedProblems,
          totalProblems,
          percentComplete,
          [difficultyKey]: currentCount + 1,
          totalXp: currentXp + xpGain,
          lastActivityAt: now,
          ...(percentComplete === 100 ? { allCompletedAt: now } : {}),
        }
      );
    } else {
      // Create new progress record
      const difficultyKey = `${difficulty}Completed` as 'easyCompleted' | 'mediumCompleted' | 'hardCompleted';
      const xpGain = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;

      await databases.createDocument(
        DATABASE_ID,
        ALGO_COLLECTIONS.PROGRESS,
        ID.unique(),
        {
          userId,
          buildingSlug,
          completedProblems,
          totalProblems,
          percentComplete,
          easyCompleted: difficultyKey === 'easyCompleted' ? 1 : 0,
          mediumCompleted: difficultyKey === 'mediumCompleted' ? 1 : 0,
          hardCompleted: difficultyKey === 'hardCompleted' ? 1 : 0,
          totalXp: xpGain,
          lastActivityAt: now,
          firstCompletedAt: now,
          ...(percentComplete === 100 ? { allCompletedAt: now } : {}),
        }
      );
    }
  } catch (error) {
    // Log but don't fail the submission
    console.error('Failed to update building progress:', error);
  }
}
