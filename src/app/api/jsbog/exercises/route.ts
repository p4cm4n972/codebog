import { NextRequest, NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';
import { loadModuleExercises, loadExerciseBySlug } from '@/lib/piscine-exercises';
import { isExerciseUnlocked, isValidSlug } from '@/lib/jsbog/access-control';

/**
 * Vérifie l'authentification via le cookie de session Appwrite
 */
async function verifySession(): Promise<{ userId: string; unlockAll: boolean } | null> {
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
    const labels = user.labels || [];

    return { userId: user.$id, unlockAll: labels.includes('admin') || labels.includes('moderator') };
  } catch {
    return null;
  }
}

/**
 * Vérifie l'authentification via JWT (pour cross-domain)
 */
async function verifyJWT(jwt: string): Promise<{ userId: string; unlockAll: boolean } | null> {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(jwt);

    const account = new Account(client);
    const user = await account.get();
    const labels = user.labels || [];

    return { userId: user.$id, unlockAll: labels.includes('admin') || labels.includes('moderator') };
  } catch {
    return null;
  }
}

/**
 * Authentifie l'utilisateur via cookie ou JWT
 */
async function authenticate(request: NextRequest): Promise<{ userId: string; unlockAll: boolean } | null> {
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
 * GET /api/jsbog/exercises
 *
 * Query params:
 * - season: slug de la saison (chrono, abyss, forge, realm)
 * - module: slug du module
 * - exercise: (optionnel) slug de l'exercice spécifique
 *
 * SECURITY: Vérifie l'accès pour les exercices spécifiques
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonSlug = searchParams.get('season');
    const moduleSlug = searchParams.get('module');
    const exerciseSlug = searchParams.get('exercise');

    if (!seasonSlug || !moduleSlug) {
      return NextResponse.json(
        { error: 'Missing required parameters: season and module' },
        { status: 400 }
      );
    }

    // Validation des slugs
    if (!isValidSlug(seasonSlug) || !isValidSlug(moduleSlug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // Charger un exercice spécifique - nécessite authentification et vérification d'accès
    if (exerciseSlug) {
      if (!isValidSlug(exerciseSlug)) {
        return NextResponse.json(
          { error: 'Invalid exercise slug format' },
          { status: 400 }
        );
      }

      // Authentification requise pour accéder au contenu d'un exercice
      const userInfo = await authenticate(request);
      if (!userInfo) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Vérifier l'accès à l'exercice
      const accessResult = await isExerciseUnlocked(
        userInfo.userId,
        seasonSlug,
        moduleSlug,
        exerciseSlug,
        userInfo.unlockAll
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

      const exercise = await loadExerciseBySlug(seasonSlug, moduleSlug, exerciseSlug);
      if (!exercise) {
        return NextResponse.json(
          { error: 'Exercise not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ exercise, access: accessResult });
    }

    // Charger tous les exercices du module
    const exercises = await loadModuleExercises(seasonSlug, moduleSlug);

    // Retourner les exercices sans le code de test pour la liste
    const exerciseList = exercises.map(ex => ({
      index: ex.index,
      slug: ex.slug,
      title: ex.title
    }));

    return NextResponse.json({
      season: seasonSlug,
      module: moduleSlug,
      exercises: exerciseList,
      total: exerciseList.length
    });
  } catch (error) {
    console.error('Error loading exercises:', error);
    return NextResponse.json(
      { error: 'Failed to load exercises' },
      { status: 500 }
    );
  }
}
