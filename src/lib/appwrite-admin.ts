/**
 * Shared Appwrite admin client for server-side operations
 * Uses API key for privileged access
 */

import { Client, Databases } from 'node-appwrite';

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Collection IDs
export const COLLECTIONS = {
    USER_GEMS: 'user-gems',
    GEM_TRANSACTIONS: 'gem-transactions',
    EXERCISE_UNLOCKS: 'exercise-unlocks',
} as const;

let adminClient: Client | null = null;
let adminDatabases: Databases | null = null;

/**
 * Get or create admin Appwrite client (singleton pattern)
 */
export function getAdminClient(): Client {
    if (!adminClient) {
        adminClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.NEXT_APPWRITE_KEY!);
    }
    return adminClient;
}

/**
 * Get admin databases instance
 */
export function getAdminDatabases(): Databases {
    if (!adminDatabases) {
        adminDatabases = new Databases(getAdminClient());
    }
    return adminDatabases;
}

/**
 * Helper to safely cast Appwrite document response
 */
export function toDocument<T>(doc: unknown): T {
    return doc as T;
}

/**
 * Helper to safely cast Appwrite document array response
 */
export function toDocuments<T>(docs: unknown[]): T[] {
    return docs as T[];
}
