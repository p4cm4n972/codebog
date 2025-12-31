import { Client, Databases } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';
const APPWRITE_COLLECTION_ID = 'exercises';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

async function addTestCodeAttribute() {
    try {
        console.log('Ajout de l\'attribut testCode à la collection exercises...');

        await databases.createStringAttribute(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            'testCode',
            1000000,
            false
        );

        console.log('✅ Attribut testCode ajouté avec succès!');
        console.log('Attendez quelques secondes que l\'attribut soit prêt...');

    } catch (error: any) {
        if (error.code === 409) {
            console.log('ℹ️  L\'attribut testCode existe déjà.');
        } else {
            console.error('❌ Erreur lors de l\'ajout de l\'attribut:', error);
            process.exit(1);
        }
    }
}

async function main() {
    console.log('--- AJOUT DE L\'ATTRIBUT TESTCODE ---');
    await addTestCodeAttribute();
    console.log('--- TERMINÉ ---');
}

main().catch(error => {
    console.error('Une erreur inattendue est survenue :', error);
    process.exit(1);
});
