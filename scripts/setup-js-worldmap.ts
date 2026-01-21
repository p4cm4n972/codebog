import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';

const JS_WORLDS_COLLECTION_ID = 'js-worlds';
const JS_LEVELS_COLLECTION_ID = 'js-levels';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

async function setupJsWorldsCollection() {
    const collectionId = JS_WORLDS_COLLECTION_ID;
    try {
        const collection = await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
        console.log(`La collection '${collectionId}' existe déjà.`);

        await databases.updateCollection(
            APPWRITE_DATABASE_ID,
            collectionId,
            collection.name,
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log('Permissions mises à jour.');
    } catch (error: unknown) {
        const isAppwriteError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
        if (isAppwriteError(error) && error.code === 404) {
            console.log(`Création de la collection '${collectionId}'...`);
            try {
                await databases.createCollection(
                    APPWRITE_DATABASE_ID,
                    collectionId,
                    'JS Worlds',
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );

                console.log('Création des attributs...');
                // World identifiers
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'slug', 100, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'name', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'description', 2000, true);

                // Visual/Theme
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'icon', 50, true); // emoji
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'color', 50, true); // tailwind color class
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'bgGradient', 255, false);

                // Position on map (for visual layout)
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'posX', true);
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'posY', true);

                // Progression
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'order', true);
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'totalLevels', true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'unlockRequirement', 500, false); // JSON: {worldSlug, minPercent}

                // Metadata
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'difficulty', 50, true); // beginner, intermediate, advanced, expert
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'tags', 500, false); // JSON array

                console.log('Attente de la création des attributs...');
                await new Promise(resolve => setTimeout(resolve, 3000));

                console.log('Création des index...');
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_slug', IndexType.Key, ['slug']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_order', IndexType.Key, ['order']);

                console.log(`Collection '${collectionId}' créée avec succès.`);
            } catch (dbError) {
                console.error('Erreur lors de la création:', dbError);
                process.exit(1);
            }
        } else {
            console.error("Erreur inattendue:", error);
            process.exit(1);
        }
    }
}

async function setupJsLevelsCollection() {
    const collectionId = JS_LEVELS_COLLECTION_ID;
    try {
        const collection = await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
        console.log(`La collection '${collectionId}' existe déjà.`);

        await databases.updateCollection(
            APPWRITE_DATABASE_ID,
            collectionId,
            collection.name,
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
    } catch (error: unknown) {
        const isAppwriteError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
        if (isAppwriteError(error) && error.code === 404) {
            console.log(`Création de la collection '${collectionId}'...`);
            try {
                await databases.createCollection(
                    APPWRITE_DATABASE_ID,
                    collectionId,
                    'JS Levels',
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );

                console.log('Création des attributs...');
                // Identifiers
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'slug', 100, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'worldSlug', 100, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'title', 255, true);

                // Content
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'statement', 1000000, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'starterCode', 1000000, false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'testCode', 1000000, false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'solution', 1000000, false);

                // Level info
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'order', true);
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'xpReward', false);
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'maxStars', false); // 1-3 stars

                // Metadata
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'difficulty', 50, false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'tags', 500, false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'hints', 5000, false); // JSON array

                console.log('Attente de la création des attributs...');
                await new Promise(resolve => setTimeout(resolve, 3000));

                console.log('Création des index...');
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_slug', IndexType.Key, ['slug']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_world', IndexType.Key, ['worldSlug']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_world_order', IndexType.Key, ['worldSlug', 'order']);

                console.log(`Collection '${collectionId}' créée avec succès.`);
            } catch (dbError) {
                console.error('Erreur lors de la création:', dbError);
                process.exit(1);
            }
        } else {
            console.error("Erreur inattendue:", error);
            process.exit(1);
        }
    }
}

async function main() {
    console.log('=== SETUP JS WORLDMAP COLLECTIONS ===\n');

    console.log('1. Configuration de js-worlds...');
    await setupJsWorldsCollection();

    console.log('\n2. Configuration de js-levels...');
    await setupJsLevelsCollection();

    console.log('\n=== DONE ===');
}

main().catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
});
