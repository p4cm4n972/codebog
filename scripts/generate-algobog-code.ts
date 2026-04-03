/**
 * ALGOBOG Code Generator Script
 *
 * Generates starterCode and testCode for all problems in the algo-problems collection.
 *
 * - 44 known problems (from leetcode-problems-data.json): specific tests with real inputs/outputs
 * - ~1085 remaining problems: function existence test
 * - Design problems (design-studio building): class template
 *
 * Usage:
 *   npx tsx scripts/generate-algobog-code.ts           # Generate (skip existing)
 *   npx tsx scripts/generate-algobog-code.ts --force    # Regenerate all
 *   npx tsx scripts/generate-algobog-code.ts --dry-run  # Preview without writing
 */

import { Client, Databases, Query } from 'node-appwrite';
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
const BATCH_SIZE = 100;

// CLI flags
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');

// ============================================================================
// CLIENT SETUP
// ============================================================================

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// ============================================================================
// TYPES
// ============================================================================

interface ProblemDoc {
  $id: string;
  slug: string;
  buildingSlug: string;
  districtSlug: string;
  leetcodeNumber: number;
  leetcodeTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode?: string;
  testCode?: string;
}

interface ProblemData {
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
}

// ============================================================================
// KNOWN PROBLEMS DATA (44 problems with real test cases)
// ============================================================================

const PROBLEMS_DATA_PATH = path.join(__dirname, 'leetcode-problems-data.json');
const knownProblemsData: Record<string, ProblemData> = JSON.parse(
  fs.readFileSync(PROBLEMS_DATA_PATH, 'utf-8')
);

/**
 * Problems that get existence tests only (complex data structures, design, unordered output).
 *
 * Rationale:
 * - Linked list / tree: ListNode/TreeNode unavailable in isolated-vm sandbox
 * - Design: class-based API with multiple operations, not a single function call
 * - Unordered output: array order varies between valid solutions (e.g. threeSum)
 * - Dual output: function returns a value AND mutates (format: "2, nums = [1, 2, _]")
 * - Complex input: matrix/grid too large for reliable test generation
 */
const EXISTENCE_ONLY = new Set([
  15,   // threeSum — output order varies
  21,   // mergeTwoLists — linked list
  26,   // removeDuplicates — dual output "2, nums = [1, 2, _]"
  27,   // removeElement — dual output
  36,   // isValidSudoku — 9x9 matrix input
  49,   // groupAnagrams — output order varies
  141,  // hasCycle — linked list + pos param
  146,  // LRUCache — design/class with multiple operations
  206,  // reverseList — linked list
  226,  // invertTree — tree
  347,  // topKFrequent — output order may vary
]);

/**
 * In-place void problems: function mutates first argument and returns void.
 * Test pattern: initialize array, call function, assert array matches expected output.
 */
const IN_PLACE_VOID = new Set([75, 88, 189, 283, 344]);

// ============================================================================
// FUNCTION NAME GENERATION
// ============================================================================

/**
 * Convert a LeetCode title to a camelCase JavaScript function name.
 *
 * Examples:
 *   "Two Sum"                          → "twoSum"
 *   "Container With Most Water"        → "containerWithMostWater"
 *   "3Sum"                             → "threeSum"
 *   "LRU Cache"                        → "lruCache"
 *   "Best Time to Buy and Sell Stock"  → "bestTimeToBuyAndSellStock"
 */
function titleToCamelCase(title: string): string {
  const digitWords = [
    'zero', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine', 'ten',
  ];

  // Replace leading digits with word equivalents
  let processed = title.replace(/^(\d+)/, (_, num) => {
    const n = parseInt(num);
    return n <= 10 ? digitWords[n] : `n${num}`;
  });

  // Remove non-alphanumeric chars (keep spaces for word splitting)
  processed = processed.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();

  const words = processed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return 'solve';

  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
  );
}

// ============================================================================
// DEFAULT PARAMETERS BY BUILDING SLUG
// ============================================================================

const BUILDING_PARAMS: Record<string, string[]> = {
  'array-tower': ['nums'],
  'string-plaza': ['s'],
  'hash-hub': ['nums'],
  'two-pointers-bridge': ['nums'],
  'binary-search-center': ['nums', 'target'],
  'sliding-window-mall': ['s'],
  'sorting-station': ['nums'],
  'stack-skyscraper': ['s'],
  'linked-list-factory': ['head'],
  'queue-warehouse': ['nums'],
  'tree-greenhouse': ['root'],
  'bst-laboratory': ['root'],
  'heap-refinery': ['nums', 'k'],
  'trie-telecom': ['words'],
  'bfs-metro': ['graph'],
  'dfs-tunnel': ['graph'],
  'topo-terminal': ['numCourses', 'prerequisites'],
  'union-junction': ['n', 'edges'],
  'shortest-path-highway': ['n', 'edges'],
  'backtrack-incubator': ['nums'],
  'dp-datacenter': ['nums'],
  'segment-server': ['nums'],
  'fenwick-firewall': ['nums'],
  'dp2d-mainframe': ['grid'],
  'greedy-lab': ['nums'],
  'bitwise-bunker': ['n'],
  'math-observatory': ['n'],
  'design-studio': [],
  'concurrency-reactor': ['fn'],
  'advanced-dp-penthouse': ['nums'],
  'hard-graph-helipad': ['graph'],
  'string-algo-antenna': ['s'],
  'contest-crown': ['nums'],
};

// ============================================================================
// INPUT PARSER
// ============================================================================

/**
 * Parse example input string into parameter names and JS expression values.
 *
 * Handles nested brackets and quoted strings:
 *   "nums = [2, 7, 11, 15], target = 9"
 *     → { names: ['nums', 'target'], values: ['[2, 7, 11, 15]', '9'] }
 *
 *   "s = \"III\""
 *     → { names: ['s'], values: ['"III"'] }
 *
 * Returns null if parsing fails (e.g. non-standard input format).
 */
function parseExampleInput(input: string): { names: string[]; values: string[] } | null {
  const names: string[] = [];
  const values: string[] = [];

  // Split by top-level commas (respecting bracket depth and quotes)
  let depth = 0;
  let inQuotes = false;
  let current = '';
  const parts: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"' && (i === 0 || input[i - 1] !== '\\')) inQuotes = !inQuotes;
    if (!inQuotes) {
      if ('[({'.includes(c)) depth++;
      if ('])}'.includes(c)) depth--;
      if (c === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
        continue;
      }
    }
    current += c;
  }
  if (current.trim()) parts.push(current.trim());

  for (const part of parts) {
    const match = part.match(/^(\w+)\s*=\s*(.+)$/);
    if (match) {
      names.push(match[1]);
      values.push(match[2].trim());
    }
  }

  if (names.length === 0) return null;
  return { names, values };
}

/**
 * Generate the right JS comparison expression for an expected value.
 *
 * - Booleans: strict equality (===)
 * - Numbers: strict equality (===)
 * - Strings: strict equality (===)
 * - Arrays/objects: JSON.stringify deep comparison
 */
function generateComparison(varName: string, expected: string): string {
  const trimmed = expected.trim();

  if (trimmed === 'true' || trimmed === 'false') {
    return `${varName} === ${trimmed}`;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return `${varName} === ${trimmed}`;
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return `${varName} === ${trimmed}`;
  }

  return `JSON.stringify(${varName}) === JSON.stringify(${trimmed})`;
}

/**
 * Escape a string for use inside single-quoted JS string literals.
 */
function escapeForSingleQuote(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// ============================================================================
// STARTER CODE GENERATION
// ============================================================================

function generateStarterCode(
  functionName: string,
  buildingSlug: string,
  knownData?: ProblemData
): string {
  // Design problems → class template
  if (buildingSlug === 'design-studio') {
    const className = functionName.charAt(0).toUpperCase() + functionName.slice(1);
    return `class ${className} {\n  constructor() {\n    // Votre code ici\n  }\n}`;
  }

  // Extract params from known example data, or fall back to building defaults
  let params: string[];
  if (knownData && knownData.examples.length > 0) {
    const parsed = parseExampleInput(knownData.examples[0].input);
    if (parsed && parsed.names.length > 0) {
      params = parsed.names;
    } else {
      params = BUILDING_PARAMS[buildingSlug] || ['input'];
    }
  } else {
    params = BUILDING_PARAMS[buildingSlug] || ['input'];
  }

  return `function ${functionName}(${params.join(', ')}) {\n  // Votre code ici\n}`;
}

// ============================================================================
// TEST CODE GENERATION
// ============================================================================

function generateTestCode(
  functionName: string,
  leetcodeNumber: number,
  buildingSlug: string,
  knownData?: ProblemData
): string {
  // No known data → existence test
  if (!knownData) {
    return generateExistenceTest(functionName, buildingSlug);
  }

  // Complex problems → existence test with function name from data
  if (EXISTENCE_ONLY.has(leetcodeNumber)) {
    return generateExistenceTest(functionName, buildingSlug);
  }

  // In-place void problems → mutation test
  if (IN_PLACE_VOID.has(leetcodeNumber)) {
    return generateInPlaceTest(functionName, knownData);
  }

  // Standard problems → return value comparison tests
  return generateReturnValueTests(functionName, knownData);
}

/**
 * Generate a simple existence test (typeof check).
 */
function generateExistenceTest(functionName: string, buildingSlug: string): string {
  if (buildingSlug === 'design-studio') {
    const className = functionName.charAt(0).toUpperCase() + functionName.slice(1);
    return (
      `if (typeof ${className} === 'function') {\n` +
      `  console.log('✓ Classe ${className} définie');\n` +
      `} else {\n` +
      `  console.log('✗ La classe ${className} doit être définie');\n` +
      `}`
    );
  }
  return (
    `if (typeof ${functionName} === 'function') {\n` +
    `  console.log('✓ Fonction ${functionName} définie');\n` +
    `} else {\n` +
    `  console.log('✗ La fonction ${functionName} doit être définie');\n` +
    `}`
  );
}

/**
 * Generate tests for in-place void functions (mutate first argument).
 *
 * Pattern:
 *   var arr = [initial]; functionName(arr, ...otherArgs);
 *   assert(arr === expected)
 */
function generateInPlaceTest(functionName: string, data: ProblemData): string {
  const tests: string[] = [];
  const examples = data.examples.slice(0, 2);

  for (const example of examples) {
    const parsed = parseExampleInput(example.input);
    if (!parsed) continue;

    const output = example.output.trim();

    // Skip dual outputs like "2, nums = [1, 2, _]" or truncated outputs
    if (output.includes('=') || output.includes('_') || output.includes('...')) continue;

    const firstValue = parsed.values[0];
    const otherArgs = parsed.values.slice(1);
    const callArgs = ['arr', ...otherArgs].join(', ');

    const label = `${functionName}(${parsed.values.join(', ')})`;
    const safeLabel = escapeForSingleQuote(
      label.length > 55 ? label.substring(0, 52) + '...' : label
    );
    const safeOutput = escapeForSingleQuote(
      output.length > 30 ? output.substring(0, 27) + '...' : output
    );

    tests.push(
      `(function() {\n` +
      `  var arr = ${firstValue};\n` +
      `  ${functionName}(${callArgs});\n` +
      `  if (JSON.stringify(arr) === JSON.stringify(${output})) console.log('✓ ${safeLabel} → ${safeOutput}');\n` +
      `  else console.log('✗ ${safeLabel} : attendu ${safeOutput}, obtenu ' + JSON.stringify(arr));\n` +
      `})();`
    );
  }

  if (tests.length === 0) {
    return generateExistenceTest(functionName, '');
  }

  return tests.join('\n');
}

/**
 * Generate tests for functions that return a value.
 *
 * Pattern:
 *   var r = functionName(...args);
 *   assert(r === expected)
 */
function generateReturnValueTests(functionName: string, data: ProblemData): string {
  const tests: string[] = [];
  const examples = data.examples.slice(0, 3);

  for (const example of examples) {
    const parsed = parseExampleInput(example.input);
    if (!parsed) continue;

    const output = example.output.trim();

    // Skip complex/truncated outputs
    if (output.includes('=') || output.includes('_') || output.includes('...')) continue;

    const callArgs = parsed.values.join(', ');
    const comparison = generateComparison('r', output);

    const callStr = `${functionName}(${callArgs})`;
    const safeCall = escapeForSingleQuote(
      callStr.length > 50 ? callStr.substring(0, 47) + '...' : callStr
    );
    const safeOutput = escapeForSingleQuote(
      output.length > 30 ? output.substring(0, 27) + '...' : output
    );

    tests.push(
      `(function() {\n` +
      `  var r = ${functionName}(${callArgs});\n` +
      `  if (${comparison}) console.log('✓ ${safeCall} = ${safeOutput}');\n` +
      `  else console.log('✗ ${safeCall} : attendu ${safeOutput}, obtenu ' + JSON.stringify(r));\n` +
      `})();`
    );
  }

  if (tests.length === 0) {
    return generateExistenceTest(functionName, '');
  }

  return tests.join('\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  console.log('🚀 ALGOBOG Code Generator');
  console.log('========================');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Database: ${DATABASE_ID}`);
  console.log(`Known problems: ${Object.keys(knownProblemsData).length}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE (regenerate all)' : 'normal (skip existing)'}\n`);

  let offset = 0;
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let specificTests = 0;
  let inPlaceTests = 0;
  let existenceTests = 0;

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.limit(BATCH_SIZE),
        Query.offset(offset),
        Query.orderAsc('problemNumber'),
      ]
    );

    if (response.documents.length === 0) break;

    console.log(
      `📦 Batch ${Math.floor(offset / BATCH_SIZE) + 1} ` +
      `(${response.documents.length} problems, offset ${offset})...`
    );

    for (const doc of response.documents) {
      const problem = doc as unknown as ProblemDoc;
      totalProcessed++;

      // Skip if already has both codes (unless --force)
      if (!FORCE && problem.starterCode && problem.testCode) {
        totalSkipped++;
        continue;
      }

      try {
        const functionName = titleToCamelCase(problem.leetcodeTitle);
        const knownData = knownProblemsData[String(problem.leetcodeNumber)];

        const starterCode = generateStarterCode(
          functionName,
          problem.buildingSlug,
          knownData
        );

        const testCode = generateTestCode(
          functionName,
          problem.leetcodeNumber,
          problem.buildingSlug,
          knownData
        );

        // Validate attribute size limits
        if (starterCode.length > 2000) {
          console.warn(`  ⚠️ starterCode too long: ${problem.slug} (${starterCode.length}/2000)`);
          totalErrors++;
          continue;
        }
        if (testCode.length > 5000) {
          console.warn(`  ⚠️ testCode too long: ${problem.slug} (${testCode.length}/5000)`);
          totalErrors++;
          continue;
        }

        // Track test type
        if (knownData && !EXISTENCE_ONLY.has(problem.leetcodeNumber)) {
          if (IN_PLACE_VOID.has(problem.leetcodeNumber)) {
            inPlaceTests++;
          } else {
            specificTests++;
          }
        } else {
          existenceTests++;
        }

        if (DRY_RUN) {
          if (knownData) {
            const testType = EXISTENCE_ONLY.has(problem.leetcodeNumber)
              ? 'existence'
              : IN_PLACE_VOID.has(problem.leetcodeNumber)
                ? 'in-place'
                : 'specific';
            console.log(`  🔍 ${problem.slug} → ${functionName}() [${testType}]`);
          }
          totalUpdated++;
        } else {
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            problem.$id,
            { starterCode, testCode }
          );
          totalUpdated++;

          if (knownData) {
            const testType = EXISTENCE_ONLY.has(problem.leetcodeNumber)
              ? 'existence'
              : IN_PLACE_VOID.has(problem.leetcodeNumber)
                ? 'in-place'
                : 'specific';
            console.log(`  ✅ ${problem.slug} → ${functionName}() [${testType}]`);
          }
        }
      } catch (error) {
        totalErrors++;
        console.error(`  ❌ ${problem.slug}: ${(error as Error).message}`);
      }
    }

    offset += response.documents.length;

    // Rate-limit protection (Appwrite)
    if (!DRY_RUN) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  console.log('\n========================================');
  console.log('📊 Summary');
  console.log('========================================');
  console.log(`   Total problems scanned: ${totalProcessed}`);
  console.log(`   Updated: ${totalUpdated}`);
  console.log(`   Skipped (already has code): ${totalSkipped}`);
  console.log(`   Errors: ${totalErrors}`);
  console.log('');
  console.log('   Test types:');
  console.log(`     Specific tests (real I/O): ${specificTests}`);
  console.log(`     In-place tests: ${inPlaceTests}`);
  console.log(`     Existence tests: ${existenceTests}`);
  if (DRY_RUN) {
    console.log('\n   ⚠️ DRY RUN — no documents were modified');
  }
}

main().catch((error) => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
