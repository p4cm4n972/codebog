/**
 * Script to create Appwrite collections for the gem system
 * Run with: npm run setup:gems
 *
 * Collections created:
 * - user-gems: User gem balances
 * - gem-transactions: Transaction history
 * - exercise-unlocks: Exercises unlocked via gems
 */

import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';

// Collection IDs
const USER_GEMS_COLLECTION = 'user-gems';
const GEM_TRANSACTIONS_COLLECTION = 'gem-transactions';
const EXERCISE_UNLOCKS_COLLECTION = 'exercise-unlocks';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    console.error('Assurez-vous que NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID et NEXT_APPWRITE_KEY sont définis.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

// Helper to check if error is Appwrite 404
const isNotFoundError = (e: unknown): e is { code: number } =>
    typeof e === 'object' && e !== null && 'code' in e && (e as { code: number }).code === 404;

// Helper to wait for attribute creation
const waitForAttributes = async (ms: number = 3000) => {
    console.log(`Attente de la création des attributs (${ms / 1000}s)...`);
    await new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Setup user-gems collection
 * Stores the gem balance for each user
 */
async function setupUserGemsCollection() {
    console.log('\n--- Setup: user-gems ---');

    try {
        await databases.getCollection(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION);
        console.log(`La collection '${USER_GEMS_COLLECTION}' existe déjà.`);
    } catch (error: unknown) {
        if (!isNotFoundError(error)) {
            console.error("Erreur inattendue:", error);
            return;
        }

        console.log(`Création de la collection '${USER_GEMS_COLLECTION}'...`);

        await databases.createCollection(
            APPWRITE_DATABASE_ID,
            USER_GEMS_COLLECTION,
            'User Gems',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
            ]
        );

        // Create attributes
        console.log('Création des attributs...');
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION, 'userId', 255, true);
        // createIntegerAttribute params: databaseId, collectionId, key, required, min, max, default
        await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION, 'balance', true, 0, 999999, 0);
        await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION, 'totalPurchased', true, 0, 999999, 0);
        await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION, 'totalSpent', true, 0, 999999, 0);
        await databases.createDatetimeAttribute(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION, 'updatedAt', true);

        await waitForAttributes();

        // Create indexes
        console.log('Création des index...');
        await databases.createIndex(APPWRITE_DATABASE_ID, USER_GEMS_COLLECTION, 'by_user', IndexType.Unique, ['userId']);

        console.log(`Collection '${USER_GEMS_COLLECTION}' créée avec succès.`);
    }
}

/**
 * Setup gem-transactions collection
 * Records all gem purchases, unlocks, and refunds
 */
async function setupGemTransactionsCollection() {
    console.log('\n--- Setup: gem-transactions ---');

    try {
        await databases.getCollection(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION);
        console.log(`La collection '${GEM_TRANSACTIONS_COLLECTION}' existe déjà.`);
    } catch (error: unknown) {
        if (!isNotFoundError(error)) {
            console.error("Erreur inattendue:", error);
            return;
        }

        console.log(`Création de la collection '${GEM_TRANSACTIONS_COLLECTION}'...`);

        await databases.createCollection(
            APPWRITE_DATABASE_ID,
            GEM_TRANSACTIONS_COLLECTION,
            'Gem Transactions',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
            ]
        );

        // Create attributes
        console.log('Création des attributs...');
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'userId', 255, true);
        await databases.createEnumAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'type', ['purchase', 'unlock', 'refund'], true);
        // amount can be negative (for unlocks) or positive (for purchases)
        await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'amount', true, -999999, 999999);
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'description', 500, true);
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'exerciseSlug', 255, false);
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'stripeSessionId', 255, false);
        await databases.createDatetimeAttribute(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'createdAt', true);

        await waitForAttributes();

        // Create indexes
        console.log('Création des index...');
        await databases.createIndex(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'by_user', IndexType.Key, ['userId']);
        await databases.createIndex(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'by_type', IndexType.Key, ['type']);
        await databases.createIndex(APPWRITE_DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, 'by_stripe_session', IndexType.Key, ['stripeSessionId']);

        console.log(`Collection '${GEM_TRANSACTIONS_COLLECTION}' créée avec succès.`);
    }
}

/**
 * Setup exercise-unlocks collection
 * Tracks which exercises have been unlocked via gems
 */
async function setupExerciseUnlocksCollection() {
    console.log('\n--- Setup: exercise-unlocks ---');

    try {
        await databases.getCollection(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION);
        console.log(`La collection '${EXERCISE_UNLOCKS_COLLECTION}' existe déjà.`);
    } catch (error: unknown) {
        if (!isNotFoundError(error)) {
            console.error("Erreur inattendue:", error);
            return;
        }

        console.log(`Création de la collection '${EXERCISE_UNLOCKS_COLLECTION}'...`);

        await databases.createCollection(
            APPWRITE_DATABASE_ID,
            EXERCISE_UNLOCKS_COLLECTION,
            'Exercise Unlocks',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
            ]
        );

        // Create attributes
        console.log('Création des attributs...');
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'userId', 255, true);
        await databases.createStringAttribute(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'exerciseSlug', 255, true);
        await databases.createEnumAttribute(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'exerciseType', ['js', 'c'], true);
        await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'gemsCost', true, 0, 999999);
        await databases.createDatetimeAttribute(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'unlockedAt', true);

        await waitForAttributes();

        // Create indexes - unique constraint for user + exercise
        console.log('Création des index...');
        await databases.createIndex(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'by_user', IndexType.Key, ['userId']);
        await databases.createIndex(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'by_exercise', IndexType.Key, ['exerciseSlug']);
        await databases.createIndex(APPWRITE_DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, 'unique_user_exercise', IndexType.Unique, ['userId', 'exerciseSlug']);

        console.log(`Collection '${EXERCISE_UNLOCKS_COLLECTION}' créée avec succès.`);
    }
}

async function main() {
    console.log('========================================');
    console.log('   SETUP GEM SYSTEM COLLECTIONS');
    console.log('========================================');
    console.log(`Database: ${APPWRITE_DATABASE_ID}`);
    console.log(`Endpoint: ${APPWRITE_ENDPOINT}`);

    await setupUserGemsCollection();
    await setupGemTransactionsCollection();
    await setupExerciseUnlocksCollection();

    console.log('\n========================================');
    console.log('   SETUP COMPLETE');
    console.log('========================================');
}

main().catch(error => {
    console.error('Une erreur inattendue est survenue:', error);
    process.exit(1);
});
