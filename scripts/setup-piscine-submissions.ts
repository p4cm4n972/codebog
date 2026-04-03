/**
 * Script pour créer la collection piscine-submissions dans Appwrite
 * Cette collection stocke les soumissions des exercices JSBOG (piscine-js)
 *
 * Usage: npx tsx scripts/setup-piscine-submissions.ts
 */

import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'codebog-db';

const PISCINE_SUBMISSIONS_COLLECTION_ID = 'piscine-submissions';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
  console.error('Vérifiez NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_APPWRITE_KEY');
  process.exit(1);
}

const appwriteClient = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

async function setupPiscineSubmissionsCollection() {
  const collectionId = PISCINE_SUBMISSIONS_COLLECTION_ID;

  try {
    // Vérifier si la collection existe déjà
    const collection = await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
    console.log(`La collection '${collectionId}' existe déjà.`);

    // Mettre à jour les permissions
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
    const isAppwriteError = (e: unknown): e is { code: number } =>
      typeof e === 'object' && e !== null && 'code' in e;

    if (isAppwriteError(error) && error.code === 404) {
      console.log(`Création de la collection '${collectionId}'...`);

      try {
        // Créer la collection
        await databases.createCollection(
          APPWRITE_DATABASE_ID,
          collectionId,
          'Piscine JS Submissions',
          [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ]
        );

        console.log('Création des attributs...');

        // User info
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'userId', 100, true
        );

        // Season/Module/Exercise info
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'seasonSlug', 50, true
        );
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'moduleSlug', 100, true
        );
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'exerciseSlug', 150, true
        );

        // Submission content
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'code', 500000, true  // 500KB max pour le code
        );

        // Results
        await databases.createBooleanAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'passed', true
        );
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'testResults', 100000, false  // JSON stringifié des résultats
        );

        // Timestamp
        await databases.createStringAttribute(
          APPWRITE_DATABASE_ID, collectionId,
          'submittedAt', 50, true  // ISO date string
        );

        console.log('Attente de la création des attributs (3s)...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Création des index...');

        // Index par utilisateur
        await databases.createIndex(
          APPWRITE_DATABASE_ID, collectionId,
          'by_user', IndexType.Key, ['userId']
        );

        // Index par exercice
        await databases.createIndex(
          APPWRITE_DATABASE_ID, collectionId,
          'by_exercise', IndexType.Key, ['exerciseSlug']
        );

        // Index composé pour trouver rapidement si un user a complété un exercice
        await databases.createIndex(
          APPWRITE_DATABASE_ID, collectionId,
          'by_user_exercise', IndexType.Key, ['userId', 'exerciseSlug']
        );

        // Index pour la progression d'un module
        await databases.createIndex(
          APPWRITE_DATABASE_ID, collectionId,
          'by_user_season_module', IndexType.Key, ['userId', 'seasonSlug', 'moduleSlug']
        );

        // Index pour filtrer les soumissions réussies
        await databases.createIndex(
          APPWRITE_DATABASE_ID, collectionId,
          'by_user_passed', IndexType.Key, ['userId', 'passed']
        );

        // Index pour requêtes sur exercice + passed
        await databases.createIndex(
          APPWRITE_DATABASE_ID, collectionId,
          'by_user_exercise_passed', IndexType.Key, ['userId', 'exerciseSlug', 'passed']
        );

        console.log(`Collection '${collectionId}' créée avec succès !`);

      } catch (dbError) {
        console.error('Erreur lors de la création de la collection:', dbError);
        process.exit(1);
      }
    } else {
      console.error('Erreur inattendue:', error);
      process.exit(1);
    }
  }
}

async function main() {
  console.log('=== SETUP PISCINE-SUBMISSIONS COLLECTION ===\n');
  console.log(`Database: ${APPWRITE_DATABASE_ID}`);
  console.log(`Collection: ${PISCINE_SUBMISSIONS_COLLECTION_ID}\n`);

  await setupPiscineSubmissionsCollection();

  console.log('\n=== DONE ===');
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
