import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';
const C_EXERCISES_COLLECTION_ID = 'c-exercises';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

async function setupCExercisesCollection() {
    try {
        const collection = await databases.getCollection(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID);
        console.log(`La collection '${C_EXERCISES_COLLECTION_ID}' existe déjà.`);

        // Update permissions if needed
        console.log('Mise à jour des permissions...');
        await databases.updateCollection(
            APPWRITE_DATABASE_ID,
            C_EXERCISES_COLLECTION_ID,
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
            console.log(`La collection '${C_EXERCISES_COLLECTION_ID}' n'existe pas. Création...`);
            try {
                await databases.createCollection(
                    APPWRITE_DATABASE_ID,
                    C_EXERCISES_COLLECTION_ID,
                    'C Exercises',
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );

                // Create attributes
                console.log('Création des attributs...');
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'slug', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'title', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'week', 50, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'day', 50, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'statement', 1000000, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'starterCode', 1000000, false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'testCode', 1000000, false);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'solution', 1000000, false);
                await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'order', false);

                // Wait for attributes to be ready
                console.log('Attente de la création des attributs...');
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Create indexes
                console.log('Création des index...');
                await databases.createIndex(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'by_slug', IndexType.Key, ['slug']);
                await databases.createIndex(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'by_week', IndexType.Key, ['week']);
                await databases.createIndex(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, 'by_order', IndexType.Key, ['order']);

                console.log(`Collection '${C_EXERCISES_COLLECTION_ID}' créée avec succès.`);
            } catch (dbError) {
                console.error('Erreur lors de la création de la collection c-exercises :', dbError);
                process.exit(1);
            }
        } else {
            console.error("Erreur inattendue en vérifiant la collection:", error);
            process.exit(1);
        }
    }
}

async function main() {
    console.log('--- SETUP C-EXERCISES COLLECTION ---');
    await setupCExercisesCollection();
    console.log('--- DONE ---');
}

main().catch(error => {
    console.error('Une erreur inattendue est survenue :', error);
    process.exit(1);
});
