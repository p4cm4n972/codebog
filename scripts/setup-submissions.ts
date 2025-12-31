import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';
const SUBMISSIONS_COLLECTION_ID = 'submissions';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

async function setupSubmissionsCollection() {
    try {
        await databases.getCollection(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID);
        console.log(`La collection '${SUBMISSIONS_COLLECTION_ID}' existe déjà.`);
    } catch (error: unknown) {
        const isAppwriteError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
        if (isAppwriteError(error) && error.code === 404) {
            console.log(`La collection '${SUBMISSIONS_COLLECTION_ID}' n'existe pas. Création...`);
            try {
                await databases.createCollection(
                    APPWRITE_DATABASE_ID,
                    SUBMISSIONS_COLLECTION_ID,
                    SUBMISSIONS_COLLECTION_ID,
                    [
                        Permission.read(Role.user('ID')), // Users can read their own submissions
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );

                // Create attributes
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'userId', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'exerciseId', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'exerciseSlug', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'code', 1000000, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'submittedAt', 255, true);
                await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'passed', false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'testResults', 100000, false);

                // Wait for attributes to be ready
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Create indexes
                await databases.createIndex(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'by_user', IndexType.Key, ['userId']);
                await databases.createIndex(APPWRITE_DATABASE_ID, SUBMISSIONS_COLLECTION_ID, 'by_exercise', IndexType.Key, ['exerciseSlug']);

                console.log(`Collection '${SUBMISSIONS_COLLECTION_ID}' créée avec succès.`);
            } catch (dbError) {
                console.error('Erreur lors de la création de la collection submissions :', dbError);
                process.exit(1);
            }
        } else {
            console.error("Erreur inattendue en vérifiant la collection:", error);
            process.exit(1);
        }
    }
}

async function main() {
    console.log('--- SETUP SUBMISSIONS COLLECTION ---');
    await setupSubmissionsCollection();
    console.log('--- DONE ---');
}

main().catch(error => {
    console.error('Une erreur inattendue est survenue :', error);
    process.exit(1);
});
