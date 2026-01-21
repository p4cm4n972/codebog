/**
 * Server-side access control for levels and exercises
 * Validates that users can only access content they have unlocked
 */

import { Client, Databases, Query, Account } from 'node-appwrite';
import { UserRole } from './appwrite/types';
import { checkGemUnlock } from './gems';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Collections
const JS_WORLDS_COLLECTION = 'js-worlds';
const JS_LEVELS_COLLECTION = 'js-levels';
const JS_SUBMISSIONS_COLLECTION = 'js-submissions';
const C_EXERCISES_COLLECTION = 'c-exercises';
const C_SUBMISSIONS_COLLECTION = 'c-submissions';

// Fallback admin email
const FALLBACK_ADMIN_EMAIL = 'manuel.adele@gmail.com';

interface WorldUnlockRequirement {
    worldSlug: string;
    minPercent: number;
}

interface UserAccess {
    hasAccess: boolean;
    reason?: string;
}

/**
 * Get user role from preferences
 */
function getUserRole(prefs: Record<string, unknown> | undefined, email: string): UserRole {
    if (prefs?.role && ['admin', 'moderator', 'user'].includes(prefs.role as string)) {
        return prefs.role as UserRole;
    }
    if (email === FALLBACK_ADMIN_EMAIL) return 'admin';
    return 'user';
}

/**
 * Create an admin Appwrite client (uses API key)
 */
function createAdminClient(): { databases: Databases } {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return { databases: new Databases(client) };
}

/**
 * Verify JWT and get user info
 */
export async function verifyUserFromJWT(jwt: string): Promise<{
    userId: string;
    email: string;
    role: UserRole;
    unlockAll: boolean;
} | null> {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setJWT(jwt);

        const account = new Account(client);
        const user = await account.get();
        const role = getUserRole(user.prefs, user.email);

        return {
            userId: user.$id,
            email: user.email,
            role,
            unlockAll: role === 'admin' || role === 'moderator',
        };
    } catch {
        return null;
    }
}

/**
 * Check if a JS world is unlocked for a user
 */
export async function isJsWorldUnlocked(
    userId: string,
    worldSlug: string,
    unlockAll: boolean
): Promise<UserAccess> {
    // Admins and moderators have all access
    if (unlockAll) {
        return { hasAccess: true };
    }

    const { databases } = createAdminClient();

    try {
        // Get world info
        const worldResponse = await databases.listDocuments(DATABASE_ID, JS_WORLDS_COLLECTION, [
            Query.equal('slug', worldSlug),
            Query.limit(1),
        ]);

        if (worldResponse.documents.length === 0) {
            return { hasAccess: false, reason: 'World not found' };
        }

        const world = worldResponse.documents[0];
        const unlockRequirement = world.unlockRequirement as string | null;

        // No unlock requirement = always accessible
        if (!unlockRequirement) {
            return { hasAccess: true };
        }

        // Parse requirement
        let requirement: WorldUnlockRequirement;
        try {
            requirement = JSON.parse(unlockRequirement);
        } catch {
            // Invalid JSON = no requirement
            return { hasAccess: true };
        }

        // Get user's progress in the prerequisite world
        const [levelsResponse, submissionsResponse] = await Promise.all([
            databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
                Query.equal('worldSlug', requirement.worldSlug),
                Query.limit(100),
            ]),
            databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
                Query.equal('userId', userId),
                Query.equal('worldSlug', requirement.worldSlug),
                Query.equal('passed', true),
                Query.limit(500),
            ]),
        ]);

        const totalLevels = levelsResponse.documents.length;
        const completedSlugs = new Set(
            submissionsResponse.documents.map((s) => s.exerciseSlug)
        );
        const completedLevels = completedSlugs.size;

        const progressPercent = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

        if (progressPercent >= requirement.minPercent) {
            return { hasAccess: true };
        }

        return {
            hasAccess: false,
            reason: `Requires ${requirement.minPercent}% completion of ${requirement.worldSlug} (current: ${Math.round(progressPercent)}%)`,
        };
    } catch (error) {
        console.error('Error checking world access:', error);
        return { hasAccess: false, reason: 'Error checking access' };
    }
}

/**
 * Check if a JS level is unlocked for a user
 */
export async function isJsLevelUnlocked(
    userId: string,
    levelSlug: string,
    unlockAll: boolean
): Promise<UserAccess> {
    // Admins and moderators have all access
    if (unlockAll) {
        return { hasAccess: true };
    }

    // Check if unlocked via gems
    const gemUnlock = await checkGemUnlock(userId, levelSlug);
    if (gemUnlock) {
        return { hasAccess: true };
    }

    const { databases } = createAdminClient();

    try {
        // Get level info
        const levelResponse = await databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
            Query.equal('slug', levelSlug),
            Query.limit(1),
        ]);

        if (levelResponse.documents.length === 0) {
            return { hasAccess: false, reason: 'Level not found' };
        }

        const level = levelResponse.documents[0];
        const worldSlug = level.worldSlug as string;
        const levelOrder = level.order as number;

        // First check if the world is unlocked
        const worldAccess = await isJsWorldUnlocked(userId, worldSlug, false);
        if (!worldAccess.hasAccess) {
            return { hasAccess: false, reason: `World locked: ${worldAccess.reason}` };
        }

        // First level in a world is always accessible (if world is unlocked)
        if (levelOrder === 1) {
            return { hasAccess: true };
        }

        // Check if previous level is completed
        const allLevelsResponse = await databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
            Query.equal('worldSlug', worldSlug),
            Query.orderAsc('order'),
            Query.limit(100),
        ]);

        // Find the previous level
        const levels = allLevelsResponse.documents;
        const currentIndex = levels.findIndex((l) => l.slug === levelSlug);

        if (currentIndex <= 0) {
            return { hasAccess: true }; // First level or not found
        }

        const previousLevel = levels[currentIndex - 1];
        const previousSlug = previousLevel.slug as string;

        // Check if user completed the previous level
        const submissionResponse = await databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
            Query.equal('userId', userId),
            Query.equal('exerciseSlug', previousSlug),
            Query.equal('passed', true),
            Query.limit(1),
        ]);

        if (submissionResponse.documents.length > 0) {
            return { hasAccess: true };
        }

        // Check if user already completed THIS level (allow re-access)
        const currentSubmission = await databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
            Query.equal('userId', userId),
            Query.equal('exerciseSlug', levelSlug),
            Query.equal('passed', true),
            Query.limit(1),
        ]);

        if (currentSubmission.documents.length > 0) {
            return { hasAccess: true };
        }

        return {
            hasAccess: false,
            reason: `Complete "${previousLevel.title}" first`,
        };
    } catch (error) {
        console.error('Error checking level access:', error);
        return { hasAccess: false, reason: 'Error checking access' };
    }
}

/**
 * Check if a C exercise is unlocked for a user
 */
export async function isCExerciseUnlocked(
    userId: string,
    exerciseSlug: string,
    unlockAll: boolean
): Promise<UserAccess> {
    // Admins and moderators have all access
    if (unlockAll) {
        return { hasAccess: true };
    }

    // Check if unlocked via gems
    const gemUnlock = await checkGemUnlock(userId, exerciseSlug);
    if (gemUnlock) {
        return { hasAccess: true };
    }

    const { databases } = createAdminClient();

    try {
        // Get exercise info
        const exerciseResponse = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION, [
            Query.equal('slug', exerciseSlug),
            Query.limit(1),
        ]);

        if (exerciseResponse.documents.length === 0) {
            return { hasAccess: false, reason: 'Exercise not found' };
        }

        const exercise = exerciseResponse.documents[0];
        const week = exercise.week as string;

        // Get all exercises in this week ordered
        const allExercisesResponse = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION, [
            Query.equal('week', week),
            Query.orderAsc('order'),
            Query.limit(100),
        ]);

        const exercises = allExercisesResponse.documents;
        const currentIndex = exercises.findIndex((e) => e.slug === exerciseSlug);

        // First exercise in a week is always accessible
        if (currentIndex <= 0) {
            return { hasAccess: true };
        }

        const previousExercise = exercises[currentIndex - 1];
        const previousSlug = previousExercise.slug as string;

        // Check if user completed the previous exercise
        const submissionResponse = await databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION, [
            Query.equal('userId', userId),
            Query.equal('exerciseSlug', previousSlug),
            Query.equal('passed', true),
            Query.limit(1),
        ]);

        if (submissionResponse.documents.length > 0) {
            return { hasAccess: true };
        }

        // Check if user already completed THIS exercise
        const currentSubmission = await databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION, [
            Query.equal('userId', userId),
            Query.equal('exerciseSlug', exerciseSlug),
            Query.equal('passed', true),
            Query.limit(1),
        ]);

        if (currentSubmission.documents.length > 0) {
            return { hasAccess: true };
        }

        return {
            hasAccess: false,
            reason: `Complete "${previousExercise.title}" first`,
        };
    } catch (error) {
        console.error('Error checking C exercise access:', error);
        return { hasAccess: false, reason: 'Error checking access' };
    }
}
