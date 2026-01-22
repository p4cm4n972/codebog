/**
 * Exercise unlock operations via gems
 */

import { Query, ID } from 'node-appwrite';
import { getAdminDatabases, DATABASE_ID, COLLECTIONS, toDocument, toDocuments } from '../appwrite-admin';
import type { ExerciseUnlock } from './types';

/**
 * Check if an exercise is unlocked via gems
 */
export async function checkGemUnlock(
    userId: string,
    exerciseSlug: string
): Promise<ExerciseUnlock | null> {
    const databases = getAdminDatabases();

    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EXERCISE_UNLOCKS, [
            Query.equal('userId', userId),
            Query.equal('exerciseSlug', exerciseSlug),
            Query.limit(1),
        ]);

        if (response.documents.length > 0) {
            return toDocument<ExerciseUnlock>(response.documents[0]);
        }

        return null;
    } catch (error) {
        console.error('Error checking gem unlock:', error);
        return null;
    }
}

/**
 * Create an exercise unlock record after spending gems
 */
export async function createGemUnlock(
    userId: string,
    exerciseSlug: string,
    exerciseType: 'js' | 'c',
    gemsCost: number
): Promise<ExerciseUnlock> {
    const databases = getAdminDatabases();

    // Check if already unlocked
    const existing = await checkGemUnlock(userId, exerciseSlug);
    if (existing) {
        throw new Error('Exercise already unlocked');
    }

    const now = new Date().toISOString();
    const unlock = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.EXERCISE_UNLOCKS,
        ID.unique(),
        {
            userId,
            exerciseSlug,
            exerciseType,
            gemsCost,
            unlockedAt: now,
        }
    );

    return toDocument<ExerciseUnlock>(unlock);
}

/**
 * Get user's unlocked exercises
 */
export async function getUnlockedExercises(userId: string): Promise<ExerciseUnlock[]> {
    const databases = getAdminDatabases();

    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EXERCISE_UNLOCKS, [
            Query.equal('userId', userId),
            Query.orderDesc('unlockedAt'),
            Query.limit(100),
        ]);

        return toDocuments<ExerciseUnlock>(response.documents);
    } catch (error) {
        console.error('Error getting unlocked exercises:', error);
        return [];
    }
}
