/**
 * API pour les soumissions d'exercices piscine-js
 * GET : récupérer la progression d'un utilisateur pour un module
 * POST : sauvegarder une soumission réussie
 *
 * Supports both cookie-based and JWT authentication for cross-domain setups
 *
 * SECURITY: Access control is enforced server-side before accepting submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID, Account } from 'node-appwrite';
import { cookies } from 'next/headers';
import { isExerciseUnlocked, isValidSlug } from '@/lib/jsbog/access-control';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PISCINE_SUBMISSIONS_COLLECTION = 'piscine-submissions';

/**
 * Crée un client Appwrite admin
 */
function createAdminClient(): { databases: Databases } {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return { databases: new Databases(client) };
}

/**
 * Vérifie l'authentification via le cookie de session Appwrite
 */
async function verifySession(): Promise<{ userId: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    if (!sessionCookie) {
      return null;
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(sessionCookie.value);

    const account = new Account(client);
    const user = await account.get();

    return { userId: user.$id };
  } catch {
    return null;
  }
}

/**
 * Vérifie l'authentification via JWT (pour cross-domain)
 */
async function verifyJWT(jwt: string): Promise<{ userId: string } | null> {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(jwt);

    const account = new Account(client);
    const user = await account.get();

    return { userId: user.$id };
  } catch {
    return null;
  }
}

/**
 * Authentifie l'utilisateur via cookie ou JWT
 */
async function authenticate(request: NextRequest): Promise<{ userId: string } | null> {
  // 1. Essayer le cookie de session
  let userInfo = await verifySession();
  if (userInfo) return userInfo;

  // 2. Fallback: essayer le JWT dans le header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const jwt = authHeader.substring(7);
    userInfo = await verifyJWT(jwt);
    if (userInfo) return userInfo;
  }

  return null;
}

/**
 * GET /api/jsbog/submissions?season=X&module=Y
 * Récupère les exercices complétés d'un utilisateur pour un module
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonSlug = searchParams.get('season');
    const moduleSlug = searchParams.get('module');

    if (!seasonSlug || !moduleSlug) {
      return NextResponse.json(
        { error: 'Missing required parameters: season and module' },
        { status: 400 }
      );
    }

    const userInfo = await authenticate(request);
    if (!userInfo) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { databases } = createAdminClient();

    // Récupérer toutes les soumissions réussies pour ce module
    const submissions = await databases.listDocuments(DATABASE_ID, PISCINE_SUBMISSIONS_COLLECTION, [
      Query.equal('userId', userInfo.userId),
      Query.equal('seasonSlug', seasonSlug),
      Query.equal('moduleSlug', moduleSlug),
      Query.equal('passed', true),
      Query.limit(100),
    ]);

    // Extraire les slugs des exercices complétés
    const completedExercises = submissions.documents.map(
      (doc) => doc.exerciseSlug as string
    );

    return NextResponse.json({
      season: seasonSlug,
      module: moduleSlug,
      completedExercises,
      total: completedExercises.length,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jsbog/submissions
 * Sauvegarde une soumission réussie
 *
 * SECURITY: Vérifie l'accès à l'exercice avant d'accepter la soumission
 */
export async function POST(request: NextRequest) {
  try {
    const { seasonSlug, moduleSlug, exerciseSlug, code, testResults } = await request.json();

    if (!seasonSlug || !moduleSlug || !exerciseSlug || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validation des slugs pour prévenir les injections
    if (!isValidSlug(seasonSlug) || !isValidSlug(moduleSlug) || !isValidSlug(exerciseSlug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    const userInfo = await authenticate(request);
    if (!userInfo) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // SECURITY: Vérifier l'accès à l'exercice AVANT d'accepter la soumission
    const accessResult = await isExerciseUnlocked(
      userInfo.userId,
      seasonSlug,
      moduleSlug,
      exerciseSlug,
      false // unlockAll - pas de bypass admin pour les soumissions
    );

    if (!accessResult.hasAccess) {
      return NextResponse.json(
        {
          error: 'Access denied',
          reason: accessResult.reason,
          message: accessResult.message || 'You do not have access to this exercise',
          gemCost: accessResult.gemCost,
        },
        { status: 403 }
      );
    }

    const { databases } = createAdminClient();

    // Vérifier si l'exercice a déjà été complété
    const existingSubmission = await databases.listDocuments(DATABASE_ID, PISCINE_SUBMISSIONS_COLLECTION, [
      Query.equal('userId', userInfo.userId),
      Query.equal('exerciseSlug', exerciseSlug),
      Query.equal('passed', true),
      Query.limit(1),
    ]);

    const isFirstCompletion = existingSubmission.documents.length === 0;

    // Créer la soumission
    const submission = await databases.createDocument(
      DATABASE_ID,
      PISCINE_SUBMISSIONS_COLLECTION,
      ID.unique(),
      {
        userId: userInfo.userId,
        seasonSlug,
        moduleSlug,
        exerciseSlug,
        code,
        passed: true,
        testResults: JSON.stringify(testResults || {}),
        submittedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.$id,
        isFirstCompletion,
      },
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
