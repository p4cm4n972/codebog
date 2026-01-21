import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';

const JS_SUBMISSIONS_COLLECTION_ID = 'js-submissions';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

async function setupJsSubmissionsCollection() {
    const collectionId = JS_SUBMISSIONS_COLLECTION_ID;
    try {
        const collection = await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
        console.log(`La collection '${collectionId}' existe déjà.`);

        await databases.updateCollection(
            APPWRITE_DATABASE_ID,
            collectionId,
            collection.name,
            [
                Permission.read(Role.users()),
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
                    'JS Submissions',
                    [
                        Permission.read(Role.users()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );

                console.log('Création des attributs...');

                // User info
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'userId', 100, true);

                // Exercise info
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'exerciseId', 100, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'exerciseSlug', 100, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'worldSlug', 100, true);

                // Submission content
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'code', 1000000, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'submittedAt', 50, true);

                // Results
                await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, collectionId, 'passed', true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'testResults', 100000, false);

                // XP
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'xpEarned', false);

                console.log('Attente de la création des attributs...');
                await new Promise(resolve => setTimeout(resolve, 3000));

                console.log('Création des index...');
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_user', IndexType.Key, ['userId']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_exercise', IndexType.Key, ['exerciseSlug']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_user_exercise', IndexType.Key, ['userId', 'exerciseSlug']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_user_passed', IndexType.Key, ['userId', 'passed']);
                await databases.createIndex(APPWRITE_DATABASE_ID, collectionId, 'by_world', IndexType.Key, ['worldSlug']);

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
    console.log('=== SETUP JS-SUBMISSIONS COLLECTION ===\n');
    await setupJsSubmissionsCollection();
    console.log('\n=== DONE ===');
}

main().catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
});
