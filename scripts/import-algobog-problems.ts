/**
 * ALGOBOG Problems Import Script
 *
 * Parses PROBLEMS_CURRICULUM.md and imports problems into Appwrite.
 * Run AFTER setup-algobog-collections.ts and seed-algobog-data.ts
 *
 * Usage:
 *   npx tsx scripts/import-algobog-problems.ts
 */

import { Client, Databases, ID, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

const COLLECTION_ID = 'algo-problems';

// Path to the curriculum file
const CURRICULUM_PATH = '/home/itmade/Documents/ITMADE-STUDIO/itmade/itmade-learning/PROBLEMS_CURRICULUM.md';

// ============================================================================
// CLIENT SETUP
// ============================================================================

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// ============================================================================
// MODULE TO BUILDING MAPPING
// ============================================================================

interface ModuleInfo {
  moduleNumber: number;
  buildingSlug: string;
  districtSlug: string;
  problemRange: [number, number];
  defaultDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

const MODULE_MAP: ModuleInfo[] = [
  // PHASE 1 - Downtown
  { moduleNumber: 1, buildingSlug: 'array-tower', districtSlug: 'downtown', problemRange: [1, 50], defaultDifficulty: { easy: 40, medium: 10, hard: 0 } },
  { moduleNumber: 2, buildingSlug: 'string-plaza', districtSlug: 'downtown', problemRange: [51, 100], defaultDifficulty: { easy: 35, medium: 15, hard: 0 } },
  { moduleNumber: 3, buildingSlug: 'hash-hub', districtSlug: 'downtown', problemRange: [101, 150], defaultDifficulty: { easy: 30, medium: 20, hard: 0 } },
  { moduleNumber: 4, buildingSlug: 'two-pointers-bridge', districtSlug: 'downtown', problemRange: [151, 200], defaultDifficulty: { easy: 25, medium: 25, hard: 0 } },
  { moduleNumber: 5, buildingSlug: 'binary-search-center', districtSlug: 'downtown', problemRange: [201, 250], defaultDifficulty: { easy: 15, medium: 30, hard: 5 } },
  { moduleNumber: 6, buildingSlug: 'sliding-window-mall', districtSlug: 'downtown', problemRange: [251, 300], defaultDifficulty: { easy: 15, medium: 30, hard: 5 } },
  { moduleNumber: 7, buildingSlug: 'sorting-station', districtSlug: 'downtown', problemRange: [301, 350], defaultDifficulty: { easy: 15, medium: 30, hard: 5 } },
  { moduleNumber: 8, buildingSlug: 'stack-skyscraper', districtSlug: 'downtown', problemRange: [351, 400], defaultDifficulty: { easy: 20, medium: 25, hard: 5 } },

  // PHASE 2 - Industrial
  { moduleNumber: 9, buildingSlug: 'linked-list-factory', districtSlug: 'industrial', problemRange: [401, 475], defaultDifficulty: { easy: 30, medium: 35, hard: 10 } },
  { moduleNumber: 10, buildingSlug: 'queue-warehouse', districtSlug: 'industrial', problemRange: [476, 525], defaultDifficulty: { easy: 20, medium: 25, hard: 5 } },
  { moduleNumber: 11, buildingSlug: 'tree-greenhouse', districtSlug: 'industrial', problemRange: [526, 600], defaultDifficulty: { easy: 25, medium: 40, hard: 10 } },
  { moduleNumber: 12, buildingSlug: 'bst-laboratory', districtSlug: 'industrial', problemRange: [601, 675], defaultDifficulty: { easy: 20, medium: 45, hard: 10 } },
  { moduleNumber: 13, buildingSlug: 'heap-refinery', districtSlug: 'industrial', problemRange: [676, 750], defaultDifficulty: { easy: 15, medium: 45, hard: 15 } },
  { moduleNumber: 14, buildingSlug: 'trie-telecom', districtSlug: 'industrial', problemRange: [751, 800], defaultDifficulty: { easy: 10, medium: 30, hard: 10 } },

  // PHASE 3 - Transit
  { moduleNumber: 15, buildingSlug: 'bfs-metro', districtSlug: 'transit', problemRange: [801, 875], defaultDifficulty: { easy: 15, medium: 45, hard: 15 } },
  { moduleNumber: 16, buildingSlug: 'dfs-tunnel', districtSlug: 'transit', problemRange: [876, 950], defaultDifficulty: { easy: 15, medium: 45, hard: 15 } },
  { moduleNumber: 17, buildingSlug: 'topo-terminal', districtSlug: 'transit', problemRange: [951, 1000], defaultDifficulty: { easy: 10, medium: 35, hard: 5 } },
  { moduleNumber: 18, buildingSlug: 'union-junction', districtSlug: 'transit', problemRange: [1001, 1050], defaultDifficulty: { easy: 5, medium: 35, hard: 10 } },
  { moduleNumber: 19, buildingSlug: 'shortest-path-highway', districtSlug: 'transit', problemRange: [1051, 1100], defaultDifficulty: { easy: 5, medium: 35, hard: 10 } },

  // PHASE 4 - Tech Park
  { moduleNumber: 20, buildingSlug: 'backtrack-incubator', districtSlug: 'tech-park', problemRange: [1101, 1200], defaultDifficulty: { easy: 15, medium: 60, hard: 25 } },
  { moduleNumber: 21, buildingSlug: 'dp-datacenter', districtSlug: 'tech-park', problemRange: [1201, 1350], defaultDifficulty: { easy: 30, medium: 90, hard: 30 } },
  { moduleNumber: 22, buildingSlug: 'segment-server', districtSlug: 'tech-park', problemRange: [1351, 1400], defaultDifficulty: { easy: 5, medium: 30, hard: 15 } },
  { moduleNumber: 23, buildingSlug: 'fenwick-firewall', districtSlug: 'tech-park', problemRange: [1401, 1450], defaultDifficulty: { easy: 5, medium: 35, hard: 10 } },
  { moduleNumber: 24, buildingSlug: 'dp2d-mainframe', districtSlug: 'tech-park', problemRange: [1451, 1500], defaultDifficulty: { easy: 10, medium: 30, hard: 10 } },

  // PHASE 5 - Research
  { moduleNumber: 25, buildingSlug: 'greedy-lab', districtSlug: 'research', problemRange: [1501, 1575], defaultDifficulty: { easy: 20, medium: 40, hard: 15 } },
  { moduleNumber: 26, buildingSlug: 'bitwise-bunker', districtSlug: 'research', problemRange: [1576, 1650], defaultDifficulty: { easy: 25, medium: 35, hard: 15 } },
  { moduleNumber: 27, buildingSlug: 'math-observatory', districtSlug: 'research', problemRange: [1651, 1725], defaultDifficulty: { easy: 20, medium: 40, hard: 15 } },
  { moduleNumber: 28, buildingSlug: 'design-studio', districtSlug: 'research', problemRange: [1726, 1800], defaultDifficulty: { easy: 10, medium: 45, hard: 20 } },
  { moduleNumber: 29, buildingSlug: 'concurrency-reactor', districtSlug: 'research', problemRange: [1801, 1900], defaultDifficulty: { easy: 25, medium: 50, hard: 25 } },

  // PHASE 6 - Skyline
  { moduleNumber: 31, buildingSlug: 'advanced-dp-penthouse', districtSlug: 'skyline', problemRange: [1901, 2050], defaultDifficulty: { easy: 10, medium: 70, hard: 70 } },
  { moduleNumber: 32, buildingSlug: 'hard-graph-helipad', districtSlug: 'skyline', problemRange: [2051, 2200], defaultDifficulty: { easy: 5, medium: 60, hard: 85 } },
  { moduleNumber: 33, buildingSlug: 'string-algo-antenna', districtSlug: 'skyline', problemRange: [2201, 2350], defaultDifficulty: { easy: 15, medium: 80, hard: 55 } },
  { moduleNumber: 34, buildingSlug: 'contest-crown', districtSlug: 'skyline', problemRange: [2351, 2500], defaultDifficulty: { easy: 20, medium: 80, hard: 50 } },
];

// ============================================================================
// TYPES
// ============================================================================

interface ParsedProblem {
  leetcodeNumber: number;
  leetcodeTitle: string;
  moduleNumber: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ProblemDocument {
  slug: string;
  buildingSlug: string;
  districtSlug: string;
  problemNumber: number;
  localNumber: number;
  leetcodeNumber: number;
  leetcodeTitle: string;
  title: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  floor: number;
  order: number;
  xpReward: number;
  tags: string;
}

// ============================================================================
// PARSING
// ============================================================================

function parseCurriculum(content: string): ParsedProblem[] {
  const problems: ParsedProblem[] = [];
  const lines = content.split('\n');

  let currentModule = 0;

  for (const line of lines) {
    // Detect module header: "#### Module N : ..."
    const moduleMatch = line.match(/^####\s+Module\s+(\d+)\s*:/);
    if (moduleMatch) {
      currentModule = parseInt(moduleMatch[1], 10);
      continue;
    }

    // Detect problem line: "  - [✅] NUMBER Title" or "  - NUMBER Title"
    const problemMatch = line.match(/^\s*-\s*(?:✅\s*)?(\d+)\s+(.+)$/);
    if (problemMatch && currentModule > 0) {
      const leetcodeNumber = parseInt(problemMatch[1], 10);
      const leetcodeTitle = problemMatch[2].trim();

      // Detect difficulty from title if mentioned
      let difficulty: 'easy' | 'medium' | 'hard' | undefined;
      if (leetcodeTitle.toLowerCase().includes('(hard)')) {
        difficulty = 'hard';
      } else if (leetcodeTitle.toLowerCase().includes('(medium)')) {
        difficulty = 'medium';
      } else if (leetcodeTitle.toLowerCase().includes('(easy)')) {
        difficulty = 'easy';
      }

      problems.push({
        leetcodeNumber,
        leetcodeTitle: leetcodeTitle.replace(/\s*\((easy|medium|hard)\)/gi, '').trim(),
        moduleNumber: currentModule,
        difficulty,
      });
    }
  }

  return problems;
}

// ============================================================================
// DIFFICULTY ASSIGNMENT
// ============================================================================

function assignDifficulty(
  problems: ParsedProblem[],
  moduleInfo: ModuleInfo
): (ParsedProblem & { difficulty: 'easy' | 'medium' | 'hard' })[] {
  const { easy, medium } = moduleInfo.defaultDifficulty;
  const total = problems.length;

  // Sort problems by LeetCode number for consistent ordering
  const sorted = [...problems].sort((a, b) => a.leetcodeNumber - b.leetcodeNumber);

  // Calculate thresholds based on module ratios
  const easyRatio = easy / (easy + medium + moduleInfo.defaultDifficulty.hard);
  const mediumRatio = medium / (easy + medium + moduleInfo.defaultDifficulty.hard);

  const easyCount = Math.round(total * easyRatio);
  const mediumCount = Math.round(total * mediumRatio);

  return sorted.map((problem, index) => {
    // Use explicit difficulty if set, otherwise assign based on position
    let difficulty: 'easy' | 'medium' | 'hard';
    if (problem.difficulty) {
      difficulty = problem.difficulty;
    } else if (index < easyCount) {
      difficulty = 'easy';
    } else if (index < easyCount + mediumCount) {
      difficulty = 'medium';
    } else {
      difficulty = 'hard';
    }

    return { ...problem, difficulty };
  });
}

// ============================================================================
// SLUG GENERATION
// ============================================================================

function generateSlug(leetcodeNumber: number, leetcodeTitle: string): string {
  // Create URL-friendly slug: "two-sum-1" or "array-basics-123"
  const titleSlug = leetcodeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 40);

  return `${titleSlug}-${leetcodeNumber}`;
}

// ============================================================================
// XP REWARD CALCULATION
// ============================================================================

function calculateXpReward(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy':
      return 10;
    case 'medium':
      return 20;
    case 'hard':
      return 30;
    default:
      return 10;
  }
}

// ============================================================================
// FLOOR ASSIGNMENT (1-3 based on difficulty)
// ============================================================================

function assignFloor(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return 3;
    default:
      return 1;
  }
}

// ============================================================================
// IMPORT FUNCTION
// ============================================================================

async function importProblems(): Promise<void> {
  console.log('🚀 ALGOBOG Problems Import');
  console.log('==========================');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Database: ${DATABASE_ID}`);

  // Read curriculum file
  console.log(`\n📄 Reading curriculum from: ${CURRICULUM_PATH}`);

  if (!fs.existsSync(CURRICULUM_PATH)) {
    console.error('❌ Curriculum file not found!');
    process.exit(1);
  }

  const content = fs.readFileSync(CURRICULUM_PATH, 'utf-8');
  const parsedProblems = parseCurriculum(content);

  console.log(`   Found ${parsedProblems.length} problems in curriculum`);

  // Group problems by module
  const problemsByModule = new Map<number, ParsedProblem[]>();
  for (const problem of parsedProblems) {
    const existing = problemsByModule.get(problem.moduleNumber) || [];
    existing.push(problem);
    problemsByModule.set(problem.moduleNumber, existing);
  }

  console.log(`   Spread across ${problemsByModule.size} modules\n`);

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let globalProblemNumber = 0;

  // Process each module
  for (const moduleInfo of MODULE_MAP) {
    const moduleProblems = problemsByModule.get(moduleInfo.moduleNumber);

    if (!moduleProblems || moduleProblems.length === 0) {
      console.log(`⚠️  Module ${moduleInfo.moduleNumber} (${moduleInfo.buildingSlug}): No problems found`);
      continue;
    }

    console.log(`📦 Module ${moduleInfo.moduleNumber} - ${moduleInfo.buildingSlug}: ${moduleProblems.length} problems`);

    // Assign difficulties
    const problemsWithDifficulty = assignDifficulty(moduleProblems, moduleInfo);

    let localNumber = 0;

    for (const problem of problemsWithDifficulty) {
      globalProblemNumber++;
      localNumber++;

      const slug = generateSlug(problem.leetcodeNumber, problem.leetcodeTitle);

      try {
        // Check if already exists
        const existing = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('slug', slug), Query.limit(1)]
        );

        if (existing.documents.length > 0) {
          totalSkipped++;
          continue;
        }

        const doc: ProblemDocument = {
          slug,
          buildingSlug: moduleInfo.buildingSlug,
          districtSlug: moduleInfo.districtSlug,
          problemNumber: globalProblemNumber,
          localNumber,
          leetcodeNumber: problem.leetcodeNumber,
          leetcodeTitle: problem.leetcodeTitle,
          title: problem.leetcodeTitle,
          statement: `Solve LeetCode problem #${problem.leetcodeNumber}: ${problem.leetcodeTitle}`,
          difficulty: problem.difficulty,
          floor: assignFloor(problem.difficulty),
          order: localNumber,
          xpReward: calculateXpReward(problem.difficulty),
          tags: JSON.stringify([moduleInfo.buildingSlug, problem.difficulty]),
        };

        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          doc
        );

        totalCreated++;
      } catch (error) {
        totalErrors++;
        console.error(`   ❌ Error creating problem ${slug}:`, (error as Error).message);
      }
    }

    console.log(`   ✅ Created: ${problemsWithDifficulty.length - totalSkipped} | Skipped: ${totalSkipped}`);
    totalSkipped = 0; // Reset for next module display
  }

  console.log('\n========================================');
  console.log('📊 Import Summary');
  console.log('========================================');
  console.log(`   Total Created: ${totalCreated}`);
  console.log(`   Total Errors: ${totalErrors}`);
  console.log(`   Last Problem Number: ${globalProblemNumber}`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  try {
    await importProblems();
    console.log('\n✅ Import completed successfully!');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

main();
