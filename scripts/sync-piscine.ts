
import { Client, Databases, ID, Permission, Role, Query, IndexType } from 'node-appwrite';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Correction pour __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const GITHUB_REPO_URL = 'https://github.com/p4cm4n972/piscine-js-expert.git';
const LOCAL_REPO_PATH = path.join(__dirname, 'piscine-js-expert');
const EXERCISES_DIR = LOCAL_REPO_PATH;

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';
const APPWRITE_DATABASE_NAME = 'Codebog Exercises';
const APPWRITE_COLLECTION_ID = 'exercises';

// --- Validation des variables d'environnement ---
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

// --- Initialisation des clients ---
const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);
const git = simpleGit();

// --- Fonctions ---

async function setupDatabase() {
    try {
        await databases.get(APPWRITE_DATABASE_ID);
        console.log(`La base de données '${APPWRITE_DATABASE_NAME}' existe déjà.`);
    } catch (error: unknown) {
        const isAppwriteError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
        if (isAppwriteError(error) && error.code === 404) {
            console.log(`Base de données '${APPWRITE_DATABASE_NAME}' non trouvée. Création...`);
            await databases.create(APPWRITE_DATABASE_ID, APPWRITE_DATABASE_NAME);
            console.log(`Base de données '${APPWRITE_DATABASE_NAME}' créée avec succès.`);
        } else {
            console.error("Erreur inattendue lors de la vérification de la base de données:", error);
            process.exit(1);
        }
    }
}

async function setupCollection() {
    try {
        await databases.getCollection(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID);
        console.log(`La collection '${APPWRITE_COLLECTION_ID}' existe déjà.`);
    } catch (error: unknown) {
        const isAppwriteError = (e: unknown): e is { code: number } => typeof e === 'object' && e !== null && 'code' in e;
        if (isAppwriteError(error) && error.code === 404) {
             console.log(`La collection '${APPWRITE_COLLECTION_ID}' n'existe pas. Création...`);
            try {
                await databases.createCollection(
                    APPWRITE_DATABASE_ID,
                    APPWRITE_COLLECTION_ID,
                    APPWRITE_COLLECTION_ID,
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'slug', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'title', 255, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'statement', 1000000, true);
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'starterCode', 1000000, false);

                // Création de l'index sur le slug
                await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre que les attributs soient prêts
                await databases.createIndex(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'by_slug', IndexType.Key, ['slug']);

                console.log(`Collection '${APPWRITE_COLLECTION_ID}' et attributs créés avec succès.`);
            } catch (dbError) {
                console.error('Erreur lors de la création de la collection :', dbError);
                process.exit(1);
            }
        } else {
            console.error("Erreur inattendue en vérifiant la collection:", error);
            process.exit(1);
        }
    }
}

async function syncRepo() {
    console.log(`Synchronisation du dépôt depuis ${GITHUB_REPO_URL}...`);
    const stats = await fs.stat(LOCAL_REPO_PATH).catch(() => null);

    if (stats && stats.isDirectory()) {
        await git.cwd(LOCAL_REPO_PATH);
        await git.pull();
        console.log('Dépôt mis à jour avec succès.');
    } else {
        await git.clone(GITHUB_REPO_URL, LOCAL_REPO_PATH);
        console.log('Dépôt cloné avec succès.');
    }
}

async function syncExercises() {
    console.log('Début de la synchronisation des exercices...');
    const mainDirs = await fs.readdir(EXERCISES_DIR);

    const exerciseDirs = [];
    for (const dir of mainDirs) {
        const fullPath = path.join(EXERCISES_DIR, dir);
        if (dir.startsWith('ex') && (await fs.stat(fullPath)).isDirectory()) {
            exerciseDirs.push(fullPath);
        } else if (dir === 'module-0' && (await fs.stat(fullPath)).isDirectory()) {
            const moduleDirs = await fs.readdir(fullPath);
            for (const subDir of moduleDirs) {
                if (subDir.startsWith('ex')) {
                    exerciseDirs.push(path.join(fullPath, subDir));
                }
            }
        }
    }

    for (const dirPath of exerciseDirs) {
        const slug = path.basename(dirPath);
        const readmePath = path.join(dirPath, 'README.md');
        const indexPath = path.join(dirPath, 'index.js');

        try {
            const statement = await fs.readFile(readmePath, 'utf-8');
            const starterCode = await fs.readFile(indexPath, 'utf-8');
            const title = `Exercice ${slug.replace('ex', '')}`;
            const data = { slug, title, statement, starterCode };

            const existingDocs = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID,
                [Query.equal("slug", slug)]
            );

            if (existingDocs.total > 0) {
                const docId = existingDocs.documents[0].$id;
                await databases.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, docId, data);
                console.log(`[UPDATE] Exercice '${slug}' mis à jour.`);
            } else {
                await databases.createDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, ID.unique(), data);
                console.log(`[CREATE] Exercice '${slug}' créé.`);
            }
        } catch (fileError) {
            console.warn(`Attention: Dossier '${slug}' ignoré. Erreur de lecture de fichier:`, fileError);
        }
    }
    console.log('Synchronisation des exercices terminée.');
}

async function main() {
    console.log('--- DÉBUT DU SCRIPT DE SYNCHRONISATION ---');
    await setupDatabase();
    await setupCollection();
    await syncRepo();
    await syncExercises();
    console.log('--- FIN DU SCRIPT DE SYNCHRONISATION ---');
}

main().catch(error => {
    console.error('Une erreur inattendue est survenue :', error);
    process.exit(1);
});
