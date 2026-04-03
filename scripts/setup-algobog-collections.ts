/**
 * ALGOBOG Collections Setup Script
 *
 * Creates all necessary Appwrite collections with proper indexes and permissions.
 *
 * Security considerations:
 * - All collections use admin-only write access (no client writes)
 * - User data collections use userId-based read restrictions
 * - Public data (districts, buildings, problems) readable by all authenticated users
 *
 * Usage:
 *   npx tsx scripts/setup-algobog-collections.ts
 */

import { Client, Databases, Permission, Role, IndexType } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ============================================================================
// CONFIGURATION
// ============================================================================

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const API_KEY = process.env.NEXT_APPWRITE_KEY!;

if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID || !API_KEY) {
  console.error('❌ Missing environment variables. Check .env.local');
  process.exit(1);
}

// Collection IDs
const COLLECTIONS = {
  DISTRICTS: 'algo-districts',
  BUILDINGS: 'algo-buildings',
  PROBLEMS: 'algo-problems',
  SUBMISSIONS: 'algo-submissions',
  PROGRESS: 'algo-progress',
  UNLOCKS: 'algo-unlocks',
};

// ============================================================================
// CLIENT SETUP
// ============================================================================

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function createCollectionIfNotExists(
  collectionId: string,
  name: string,
  permissions: string[]
): Promise<boolean> {
  try {
    await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`  ℹ️  Collection "${name}" already exists`);
    return false;
  } catch {
    await databases.createCollection(DATABASE_ID, collectionId, name, permissions);
    console.log(`  ✅ Created collection "${name}"`);
    return true;
  }
}

async function createAttributeIfNotExists(
  collectionId: string,
  key: string,
  createFn: () => Promise<unknown>
): Promise<void> {
  try {
    await createFn();
    console.log(`    ✅ Created attribute "${key}"`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('already exists')) {
      console.log(`    ℹ️  Attribute "${key}" already exists`);
    } else {
      throw error;
    }
  }
}

async function createIndexIfNotExists(
  collectionId: string,
  key: string,
  createFn: () => Promise<unknown>
): Promise<void> {
  try {
    await createFn();
    console.log(`    ✅ Created index "${key}"`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('already exists')) {
      console.log(`    ℹ️  Index "${key}" already exists`);
    } else {
      throw error;
    }
  }
}

// Wait for attributes to be available
async function waitForAttribute(collectionId: string, key: string): Promise<void> {
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const attr = await databases.getAttribute(DATABASE_ID, collectionId, key) as { status?: string };
      if (attr.status === 'available') return;
    } catch {
      // Attribute not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

// ============================================================================
// COLLECTION: algo-districts
// ============================================================================

async function setupDistrictsCollection(): Promise<void> {
  console.log('\n📁 Setting up algo-districts collection...');

  const collectionId = COLLECTIONS.DISTRICTS;

  // Permissions: Anyone can read, only admin can write
  const permissions = [
    Permission.read(Role.users()),
  ];

  await createCollectionIfNotExists(collectionId, 'ALGOBOG Districts', permissions);

  // Attributes
  await createAttributeIfNotExists(collectionId, 'slug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'slug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'name', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'name', 100, true)
  );

  await createAttributeIfNotExists(collectionId, 'subtitle', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'subtitle', 200, false)
  );

  await createAttributeIfNotExists(collectionId, 'description', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'description', 2000, false)
  );

  await createAttributeIfNotExists(collectionId, 'icon', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'icon', 10, true)
  );

  await createAttributeIfNotExists(collectionId, 'color', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'color', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'bgGradient', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'bgGradient', 200, false)
  );

  await createAttributeIfNotExists(collectionId, 'order', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'order', true, 1, 100)
  );

  await createAttributeIfNotExists(collectionId, 'totalModules', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'totalModules', true, 0, 50)
  );

  await createAttributeIfNotExists(collectionId, 'totalProblems', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'totalProblems', true, 0, 2500)
  );

  await createAttributeIfNotExists(collectionId, 'unlockRequirement', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'unlockRequirement', 500, false)
  );

  await createAttributeIfNotExists(collectionId, 'posX', () =>
    databases.createFloatAttribute(DATABASE_ID, collectionId, 'posX', true, 0, 100)
  );

  await createAttributeIfNotExists(collectionId, 'posY', () =>
    databases.createFloatAttribute(DATABASE_ID, collectionId, 'posY', true, 0, 100)
  );

  // Wait for attributes
  await waitForAttribute(collectionId, 'slug');
  await waitForAttribute(collectionId, 'order');

  // Indexes
  await createIndexIfNotExists(collectionId, 'idx_slug', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_slug', IndexType.Unique, ['slug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_order', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_order', IndexType.Key, ['order'])
  );
}

// ============================================================================
// COLLECTION: algo-buildings
// ============================================================================

async function setupBuildingsCollection(): Promise<void> {
  console.log('\n📁 Setting up algo-buildings collection...');

  const collectionId = COLLECTIONS.BUILDINGS;

  const permissions = [
    Permission.read(Role.users()),
  ];

  await createCollectionIfNotExists(collectionId, 'ALGOBOG Buildings', permissions);

  // Attributes
  await createAttributeIfNotExists(collectionId, 'slug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'slug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'districtSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'districtSlug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'name', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'name', 100, true)
  );

  await createAttributeIfNotExists(collectionId, 'subtitle', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'subtitle', 200, false)
  );

  await createAttributeIfNotExists(collectionId, 'description', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'description', 2000, false)
  );

  await createAttributeIfNotExists(collectionId, 'icon', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'icon', 10, true)
  );

  await createAttributeIfNotExists(collectionId, 'color', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'color', 50, false)
  );

  await createAttributeIfNotExists(collectionId, 'order', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'order', true, 1, 50)
  );

  await createAttributeIfNotExists(collectionId, 'concepts', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'concepts', 500, false)
  );

  await createAttributeIfNotExists(collectionId, 'totalProblems', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'totalProblems', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'easyCount', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'easyCount', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'mediumCount', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'mediumCount', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'hardCount', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'hardCount', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'problemRange', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'problemRange', 20, false)
  );

  await createAttributeIfNotExists(collectionId, 'unlockRequirement', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'unlockRequirement', 500, false)
  );

  // Wait for attributes
  await waitForAttribute(collectionId, 'slug');
  await waitForAttribute(collectionId, 'districtSlug');
  await waitForAttribute(collectionId, 'order');

  // Indexes
  await createIndexIfNotExists(collectionId, 'idx_slug', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_slug', IndexType.Unique, ['slug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_district', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_district', IndexType.Key, ['districtSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_district_order', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_district_order', IndexType.Key, ['districtSlug', 'order'])
  );
}

// ============================================================================
// COLLECTION: algo-problems
// ============================================================================

async function setupProblemsCollection(): Promise<void> {
  console.log('\n📁 Setting up algo-problems collection...');

  const collectionId = COLLECTIONS.PROBLEMS;

  const permissions = [
    Permission.read(Role.users()),
  ];

  await createCollectionIfNotExists(collectionId, 'ALGOBOG Problems', permissions);

  // Identification attributes
  await createAttributeIfNotExists(collectionId, 'slug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'slug', 100, true)
  );

  await createAttributeIfNotExists(collectionId, 'buildingSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'buildingSlug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'districtSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'districtSlug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'problemNumber', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'problemNumber', true, 1, 2500)
  );

  await createAttributeIfNotExists(collectionId, 'localNumber', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'localNumber', true, 1, 200)
  );

  await createAttributeIfNotExists(collectionId, 'leetcodeNumber', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'leetcodeNumber', false, 1, 3000, undefined)
  );

  await createAttributeIfNotExists(collectionId, 'leetcodeTitle', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'leetcodeTitle', 200, false)
  );

  // Content attributes
  await createAttributeIfNotExists(collectionId, 'title', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'title', 200, true)
  );

  await createAttributeIfNotExists(collectionId, 'statement', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'statement', 5000, true)
  );

  // Difficulty
  await createAttributeIfNotExists(collectionId, 'difficulty', () =>
    databases.createEnumAttribute(DATABASE_ID, collectionId, 'difficulty', ['easy', 'medium', 'hard'], true)
  );

  await createAttributeIfNotExists(collectionId, 'floor', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'floor', true, 1, 3)
  );

  // Code
  await createAttributeIfNotExists(collectionId, 'starterCode', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'starterCode', 2000, false)
  );

  await createAttributeIfNotExists(collectionId, 'testCode', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'testCode', 5000, false)
  );

  // Metadata
  await createAttributeIfNotExists(collectionId, 'order', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'order', true, 1, 200)
  );

  await createAttributeIfNotExists(collectionId, 'xpReward', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'xpReward', true, 1, 500)
  );

  await createAttributeIfNotExists(collectionId, 'timeLimit', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'timeLimit', false, 1, 3600, 300)
  );

  await createAttributeIfNotExists(collectionId, 'tags', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'tags', 300, false)
  );

  // Wait for attributes
  await waitForAttribute(collectionId, 'slug');
  await waitForAttribute(collectionId, 'buildingSlug');
  await waitForAttribute(collectionId, 'districtSlug');
  await waitForAttribute(collectionId, 'difficulty');
  await waitForAttribute(collectionId, 'order');
  await waitForAttribute(collectionId, 'problemNumber');

  // Indexes
  await createIndexIfNotExists(collectionId, 'idx_slug', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_slug', IndexType.Unique, ['slug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_building', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_building', IndexType.Key, ['buildingSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_building_order', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_building_order', IndexType.Key, ['buildingSlug', 'order'])
  );

  await createIndexIfNotExists(collectionId, 'idx_building_difficulty', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_building_difficulty', IndexType.Key, ['buildingSlug', 'difficulty'])
  );

  await createIndexIfNotExists(collectionId, 'idx_district', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_district', IndexType.Key, ['districtSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_problem_number', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_problem_number', IndexType.Unique, ['problemNumber'])
  );
}

// ============================================================================
// COLLECTION: algo-submissions
// ============================================================================

async function setupSubmissionsCollection(): Promise<void> {
  console.log('\n📁 Setting up algo-submissions collection...');

  const collectionId = COLLECTIONS.SUBMISSIONS;

  // SECURITY: Users can only read their own submissions
  // Write is handled by API only (no client writes)
  const permissions: string[] = [];

  await createCollectionIfNotExists(collectionId, 'ALGOBOG Submissions', permissions);

  // Attributes
  await createAttributeIfNotExists(collectionId, 'userId', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'userId', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'problemSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'problemSlug', 100, true)
  );

  await createAttributeIfNotExists(collectionId, 'buildingSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'buildingSlug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'districtSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'districtSlug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'passed', () =>
    databases.createBooleanAttribute(DATABASE_ID, collectionId, 'passed', true)
  );

  await createAttributeIfNotExists(collectionId, 'code', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'code', 50000, true)
  );

  await createAttributeIfNotExists(collectionId, 'testResults', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'testResults', 5000, false)
  );

  await createAttributeIfNotExists(collectionId, 'executionTime', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'executionTime', false, 0, 60000, undefined)
  );

  await createAttributeIfNotExists(collectionId, 'memoryUsage', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'memoryUsage', false, 0, 1000000, undefined)
  );

  await createAttributeIfNotExists(collectionId, 'submittedAt', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'submittedAt', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'xpEarned', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'xpEarned', true, 0, 500)
  );

  await createAttributeIfNotExists(collectionId, 'isFirstCompletion', () =>
    databases.createBooleanAttribute(DATABASE_ID, collectionId, 'isFirstCompletion', true)
  );

  // Wait for attributes
  await waitForAttribute(collectionId, 'userId');
  await waitForAttribute(collectionId, 'problemSlug');
  await waitForAttribute(collectionId, 'passed');
  await waitForAttribute(collectionId, 'submittedAt');

  // Indexes
  await createIndexIfNotExists(collectionId, 'idx_user_problem', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user_problem', IndexType.Key, ['userId', 'problemSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_user_problem_passed', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user_problem_passed', IndexType.Key, ['userId', 'problemSlug', 'passed'])
  );

  await createIndexIfNotExists(collectionId, 'idx_user_building', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user_building', IndexType.Key, ['userId', 'buildingSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_user_district', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user_district', IndexType.Key, ['userId', 'districtSlug'])
  );
}

// ============================================================================
// COLLECTION: algo-progress
// ============================================================================

async function setupProgressCollection(): Promise<void> {
  console.log('\n📁 Setting up algo-progress collection...');

  const collectionId = COLLECTIONS.PROGRESS;

  // SECURITY: No direct client access, managed by API
  const permissions: string[] = [];

  await createCollectionIfNotExists(collectionId, 'ALGOBOG Progress', permissions);

  // Attributes
  await createAttributeIfNotExists(collectionId, 'userId', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'userId', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'buildingSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'buildingSlug', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'completedProblems', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'completedProblems', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'totalProblems', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'totalProblems', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'percentComplete', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'percentComplete', true, 0, 100)
  );

  await createAttributeIfNotExists(collectionId, 'easyCompleted', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'easyCompleted', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'mediumCompleted', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'mediumCompleted', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'hardCompleted', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'hardCompleted', true, 0, 200)
  );

  await createAttributeIfNotExists(collectionId, 'totalXp', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'totalXp', true, 0, 100000)
  );

  await createAttributeIfNotExists(collectionId, 'lastActivityAt', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'lastActivityAt', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'firstCompletedAt', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'firstCompletedAt', 50, false)
  );

  await createAttributeIfNotExists(collectionId, 'allCompletedAt', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'allCompletedAt', 50, false)
  );

  // Wait for attributes
  await waitForAttribute(collectionId, 'userId');
  await waitForAttribute(collectionId, 'buildingSlug');

  // Indexes
  await createIndexIfNotExists(collectionId, 'idx_user_building', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user_building', IndexType.Unique, ['userId', 'buildingSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_user', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user', IndexType.Key, ['userId'])
  );
}

// ============================================================================
// COLLECTION: algo-unlocks
// ============================================================================

async function setupUnlocksCollection(): Promise<void> {
  console.log('\n📁 Setting up algo-unlocks collection...');

  const collectionId = COLLECTIONS.UNLOCKS;

  // SECURITY: No direct client access, managed by API
  const permissions: string[] = [];

  await createCollectionIfNotExists(collectionId, 'ALGOBOG Unlocks', permissions);

  // Attributes
  await createAttributeIfNotExists(collectionId, 'userId', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'userId', 50, true)
  );

  await createAttributeIfNotExists(collectionId, 'targetType', () =>
    databases.createEnumAttribute(DATABASE_ID, collectionId, 'targetType', ['district', 'building', 'problem'], true)
  );

  await createAttributeIfNotExists(collectionId, 'targetSlug', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'targetSlug', 100, true)
  );

  await createAttributeIfNotExists(collectionId, 'gemsCost', () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, 'gemsCost', true, 0, 10000)
  );

  await createAttributeIfNotExists(collectionId, 'unlockedAt', () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, 'unlockedAt', 50, true)
  );

  // Wait for attributes
  await waitForAttribute(collectionId, 'userId');
  await waitForAttribute(collectionId, 'targetType');
  await waitForAttribute(collectionId, 'targetSlug');

  // Indexes
  await createIndexIfNotExists(collectionId, 'idx_user_target', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user_target', IndexType.Unique, ['userId', 'targetType', 'targetSlug'])
  );

  await createIndexIfNotExists(collectionId, 'idx_user', () =>
    databases.createIndex(DATABASE_ID, collectionId, 'idx_user', IndexType.Key, ['userId'])
  );
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  console.log('🚀 ALGOBOG Collections Setup');
  console.log('============================');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Database: ${DATABASE_ID}`);

  try {
    await setupDistrictsCollection();
    await setupBuildingsCollection();
    await setupProblemsCollection();
    await setupSubmissionsCollection();
    await setupProgressCollection();
    await setupUnlocksCollection();

    console.log('\n✅ All ALGOBOG collections set up successfully!');
    console.log('\n📋 Collections created:');
    Object.entries(COLLECTIONS).forEach(([name, id]) => {
      console.log(`   - ${name}: ${id}`);
    });

    console.log('\n🔒 Security notes:');
    console.log('   - Districts, Buildings, Problems: Read-only for authenticated users');
    console.log('   - Submissions, Progress, Unlocks: No direct client access (API-only)');
    console.log('   - All writes are performed server-side with admin key');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
