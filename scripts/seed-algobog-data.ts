/**
 * ALGOBOG Data Seed Script
 *
 * Seeds initial districts and buildings data.
 * Run AFTER setup-algobog-collections.ts
 *
 * Usage:
 *   npx tsx scripts/seed-algobog-data.ts
 */

import { Client, Databases, ID, Query } from 'node-appwrite';
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

const COLLECTIONS = {
  DISTRICTS: 'algo-districts',
  BUILDINGS: 'algo-buildings',
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
// DISTRICTS DATA
// ============================================================================

interface DistrictData {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  order: number;
  totalModules: number;
  totalProblems: number;
  unlockRequirement: string | null;
  posX: number;
  posY: number;
}

const DISTRICTS: DistrictData[] = [
  {
    slug: 'downtown',
    name: 'Downtown',
    subtitle: 'Phase 1 - Fondamentaux',
    description: 'Le cœur de la ville. Maîtrisez les bases : arrays, strings, hash tables, et plus. Ces compétences fondamentales sont essentielles pour tout développeur.',
    icon: '🏛️',
    color: 'green',
    bgGradient: 'from-green-500 to-emerald-700',
    order: 1,
    totalModules: 8,
    totalProblems: 400,
    unlockRequirement: null,
    posX: 20,
    posY: 30,
  },
  {
    slug: 'industrial',
    name: 'Industrial Zone',
    subtitle: 'Phase 2 - Structures de Données',
    description: 'La zone industrielle où les structures de données sont forgées. Linked lists, queues, arbres binaires, heaps et tries vous attendent.',
    icon: '🏭',
    color: 'orange',
    bgGradient: 'from-orange-500 to-amber-700',
    order: 2,
    totalModules: 6,
    totalProblems: 400,
    unlockRequirement: JSON.stringify({ districtSlug: 'downtown', minPercent: 50 }),
    posX: 50,
    posY: 20,
  },
  {
    slug: 'transit',
    name: 'Transit Hub',
    subtitle: 'Phase 3 - Graphes',
    description: 'Le centre névralgique des transports. BFS, DFS, topological sort, union-find et algorithmes de plus court chemin.',
    icon: '🚇',
    color: 'cyan',
    bgGradient: 'from-cyan-500 to-teal-700',
    order: 3,
    totalModules: 5,
    totalProblems: 300,
    unlockRequirement: JSON.stringify({ districtSlug: 'industrial', minPercent: 50 }),
    posX: 80,
    posY: 35,
  },
  {
    slug: 'tech-park',
    name: 'Tech Park',
    subtitle: 'Phase 4 - Algorithmes Avancés',
    description: 'Le parc technologique où l\'innovation règne. Backtracking, programmation dynamique 1D et 2D, segment trees et Fenwick trees.',
    icon: '🏢',
    color: 'purple',
    bgGradient: 'from-purple-500 to-violet-700',
    order: 4,
    totalModules: 5,
    totalProblems: 400,
    unlockRequirement: JSON.stringify({ districtSlug: 'transit', minPercent: 50 }),
    posX: 75,
    posY: 65,
  },
  {
    slug: 'research',
    name: 'Research Campus',
    subtitle: 'Phase 5 - Spécialisation',
    description: 'Le campus de recherche pour les esprits curieux. Algorithmes greedy, manipulation de bits, mathématiques, design patterns et concurrency.',
    icon: '🔬',
    color: 'pink',
    bgGradient: 'from-pink-500 to-rose-700',
    order: 5,
    totalModules: 5,
    totalProblems: 400,
    unlockRequirement: JSON.stringify({ districtSlug: 'tech-park', minPercent: 50 }),
    posX: 40,
    posY: 70,
  },
  {
    slug: 'skyline',
    name: 'Skyline Tower',
    subtitle: 'Phase 6 - Expert',
    description: 'La tour emblématique de la ville. Réservée aux experts : DP avancée, graphes complexes, algorithmes de chaînes avancés et problèmes de compétition.',
    icon: '🗼',
    color: 'amber',
    bgGradient: 'from-amber-500 to-yellow-600',
    order: 6,
    totalModules: 4,
    totalProblems: 600,
    unlockRequirement: JSON.stringify({ districtSlug: 'research', minPercent: 75 }),
    posX: 15,
    posY: 60,
  },
];

// ============================================================================
// BUILDINGS DATA
// ============================================================================

interface BuildingData {
  slug: string;
  districtSlug: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string | null;
  order: number;
  concepts: string;
  totalProblems: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  problemRange: string;
  unlockRequirement: string | null;
}

const BUILDINGS: BuildingData[] = [
  // =========================================================================
  // DOWNTOWN - Phase 1 (8 buildings)
  // =========================================================================
  {
    slug: 'array-tower',
    districtSlug: 'downtown',
    name: 'Array Tower',
    subtitle: 'Module 1 - Array Basics',
    description: 'La tour des tableaux. Maîtrisez les parcours, manipulations et opérations in-place sur les arrays.',
    icon: '🏢',
    color: null,
    order: 1,
    concepts: JSON.stringify(['parcours', 'manipulation', 'in-place', 'binary search']),
    totalProblems: 50,
    easyCount: 40,
    mediumCount: 10,
    hardCount: 0,
    problemRange: '1-50',
    unlockRequirement: null,
  },
  {
    slug: 'string-plaza',
    districtSlug: 'downtown',
    name: 'String Plaza',
    subtitle: 'Module 2 - String Basics',
    description: 'La plaza des chaînes. Manipulation de strings, parsing et détection de palindromes.',
    icon: '🏬',
    color: null,
    order: 2,
    concepts: JSON.stringify(['manipulation', 'parsing', 'palindrome', 'anagram']),
    totalProblems: 50,
    easyCount: 35,
    mediumCount: 15,
    hardCount: 0,
    problemRange: '51-100',
    unlockRequirement: JSON.stringify({ buildingSlug: 'array-tower', minPercent: 30 }),
  },
  {
    slug: 'hash-hub',
    districtSlug: 'downtown',
    name: 'Hash Hub',
    subtitle: 'Module 3 - Hash Table',
    description: 'Le hub du hashing. Lookup O(1), comptage et regroupement avec les tables de hachage.',
    icon: '🏦',
    color: null,
    order: 3,
    concepts: JSON.stringify(['lookup O(1)', 'counting', 'grouping', 'two sum']),
    totalProblems: 50,
    easyCount: 30,
    mediumCount: 20,
    hardCount: 0,
    problemRange: '101-150',
    unlockRequirement: JSON.stringify({ buildingSlug: 'string-plaza', minPercent: 30 }),
  },
  {
    slug: 'two-pointers-bridge',
    districtSlug: 'downtown',
    name: 'Two Pointers Bridge',
    subtitle: 'Module 4 - Two Pointers',
    description: 'Le pont aux deux pointeurs. Technique des pointeurs opposés, même direction et fast/slow.',
    icon: '🌉',
    color: null,
    order: 4,
    concepts: JSON.stringify(['opposés', 'même direction', 'fast/slow', 'sliding']),
    totalProblems: 50,
    easyCount: 25,
    mediumCount: 25,
    hardCount: 0,
    problemRange: '151-200',
    unlockRequirement: JSON.stringify({ buildingSlug: 'hash-hub', minPercent: 30 }),
  },
  {
    slug: 'binary-search-center',
    districtSlug: 'downtown',
    name: 'Binary Search Center',
    subtitle: 'Module 5 - Binary Search Advanced',
    description: 'Le centre de recherche binaire. Arrays pivotées, pics et recherche de frontières.',
    icon: '🎯',
    color: null,
    order: 5,
    concepts: JSON.stringify(['rotated array', 'peak finding', 'boundary search', 'template']),
    totalProblems: 50,
    easyCount: 15,
    mediumCount: 30,
    hardCount: 5,
    problemRange: '201-250',
    unlockRequirement: JSON.stringify({ buildingSlug: 'two-pointers-bridge', minPercent: 30 }),
  },
  {
    slug: 'sliding-window-mall',
    districtSlug: 'downtown',
    name: 'Sliding Window Mall',
    subtitle: 'Module 6 - Sliding Window',
    description: 'Le centre commercial de la fenêtre glissante. Taille fixe, variable et optimisation.',
    icon: '🛒',
    color: null,
    order: 6,
    concepts: JSON.stringify(['fixed size', 'variable size', 'optimal window', 'substring']),
    totalProblems: 50,
    easyCount: 15,
    mediumCount: 30,
    hardCount: 5,
    problemRange: '251-300',
    unlockRequirement: JSON.stringify({ buildingSlug: 'binary-search-center', minPercent: 30 }),
  },
  {
    slug: 'sorting-station',
    districtSlug: 'downtown',
    name: 'Sorting Station',
    subtitle: 'Module 7 - Sorting & Selection',
    description: 'La gare du tri. Quick select, merge sort, bucket sort et algorithmes de sélection.',
    icon: '🚉',
    color: null,
    order: 7,
    concepts: JSON.stringify(['quick select', 'merge sort', 'bucket sort', 'kth element']),
    totalProblems: 50,
    easyCount: 15,
    mediumCount: 30,
    hardCount: 5,
    problemRange: '301-350',
    unlockRequirement: JSON.stringify({ buildingSlug: 'sliding-window-mall', minPercent: 30 }),
  },
  {
    slug: 'stack-skyscraper',
    districtSlug: 'downtown',
    name: 'Stack Skyscraper',
    subtitle: 'Module 8 - Stack',
    description: 'Le gratte-ciel des piles. Monotonic stack, parsing d\'expressions et backtracking.',
    icon: '🏙️',
    color: null,
    order: 8,
    concepts: JSON.stringify(['monotonic stack', 'parsing', 'backtracking', 'next greater']),
    totalProblems: 50,
    easyCount: 20,
    mediumCount: 25,
    hardCount: 5,
    problemRange: '351-400',
    unlockRequirement: JSON.stringify({ buildingSlug: 'sorting-station', minPercent: 30 }),
  },

  // =========================================================================
  // INDUSTRIAL - Phase 2 (6 buildings)
  // =========================================================================
  {
    slug: 'linked-list-factory',
    districtSlug: 'industrial',
    name: 'Linked List Factory',
    subtitle: 'Module 9 - Linked List',
    description: 'L\'usine des listes chaînées. Singly, doubly, circular et manipulation de pointeurs.',
    icon: '🏭',
    color: null,
    order: 1,
    concepts: JSON.stringify(['singly', 'doubly', 'circular', 'reverse', 'merge']),
    totalProblems: 75,
    easyCount: 30,
    mediumCount: 35,
    hardCount: 10,
    problemRange: '401-475',
    unlockRequirement: null,
  },
  {
    slug: 'queue-warehouse',
    districtSlug: 'industrial',
    name: 'Queue Warehouse',
    subtitle: 'Module 10 - Queue & Deque',
    description: 'L\'entrepôt des files. FIFO, priority queue, deque et circular queue.',
    icon: '📦',
    color: null,
    order: 2,
    concepts: JSON.stringify(['FIFO', 'priority queue', 'deque', 'circular queue']),
    totalProblems: 50,
    easyCount: 20,
    mediumCount: 25,
    hardCount: 5,
    problemRange: '476-525',
    unlockRequirement: JSON.stringify({ buildingSlug: 'linked-list-factory', minPercent: 30 }),
  },
  {
    slug: 'tree-greenhouse',
    districtSlug: 'industrial',
    name: 'Tree Greenhouse',
    subtitle: 'Module 11 - Binary Tree Basics',
    description: 'La serre des arbres binaires. Traversals, construction et propriétés.',
    icon: '🌳',
    color: null,
    order: 3,
    concepts: JSON.stringify(['inorder', 'preorder', 'postorder', 'level order', 'construction']),
    totalProblems: 75,
    easyCount: 25,
    mediumCount: 40,
    hardCount: 10,
    problemRange: '526-600',
    unlockRequirement: JSON.stringify({ buildingSlug: 'queue-warehouse', minPercent: 30 }),
  },
  {
    slug: 'bst-laboratory',
    districtSlug: 'industrial',
    name: 'BST Laboratory',
    subtitle: 'Module 12 - Binary Search Tree',
    description: 'Le laboratoire des BST. Opérations, validation et équilibrage.',
    icon: '🔬',
    color: null,
    order: 4,
    concepts: JSON.stringify(['search', 'insert', 'delete', 'validate', 'balance']),
    totalProblems: 75,
    easyCount: 20,
    mediumCount: 45,
    hardCount: 10,
    problemRange: '601-675',
    unlockRequirement: JSON.stringify({ buildingSlug: 'tree-greenhouse', minPercent: 30 }),
  },
  {
    slug: 'heap-refinery',
    districtSlug: 'industrial',
    name: 'Heap Refinery',
    subtitle: 'Module 13 - Heap / Priority Queue',
    description: 'La raffinerie des tas. Min/max heap, k-elements et merge de streams.',
    icon: '⛽',
    color: null,
    order: 5,
    concepts: JSON.stringify(['min heap', 'max heap', 'k-elements', 'merge', 'scheduling']),
    totalProblems: 75,
    easyCount: 15,
    mediumCount: 45,
    hardCount: 15,
    problemRange: '676-750',
    unlockRequirement: JSON.stringify({ buildingSlug: 'bst-laboratory', minPercent: 30 }),
  },
  {
    slug: 'trie-telecom',
    districtSlug: 'industrial',
    name: 'Trie Telecom',
    subtitle: 'Module 14 - Trie',
    description: 'La tour télécom des tries. Prefix tree, autocomplete et recherche de mots.',
    icon: '📡',
    color: null,
    order: 6,
    concepts: JSON.stringify(['prefix tree', 'autocomplete', 'word search', 'wildcard']),
    totalProblems: 50,
    easyCount: 10,
    mediumCount: 30,
    hardCount: 10,
    problemRange: '751-800',
    unlockRequirement: JSON.stringify({ buildingSlug: 'heap-refinery', minPercent: 30 }),
  },

  // =========================================================================
  // TRANSIT - Phase 3 (5 buildings)
  // =========================================================================
  {
    slug: 'bfs-metro',
    districtSlug: 'transit',
    name: 'BFS Metro',
    subtitle: 'Module 15 - Graph BFS',
    description: 'Le métro BFS. Parcours par niveau, plus court chemin et multi-source BFS.',
    icon: '🚇',
    color: null,
    order: 1,
    concepts: JSON.stringify(['level order', 'shortest path', 'multi-source', 'islands']),
    totalProblems: 75,
    easyCount: 15,
    mediumCount: 45,
    hardCount: 15,
    problemRange: '801-875',
    unlockRequirement: null,
  },
  {
    slug: 'dfs-tunnel',
    districtSlug: 'transit',
    name: 'DFS Tunnel',
    subtitle: 'Module 16 - Graph DFS',
    description: 'Le tunnel DFS. Composantes connexes, détection de cycles et backtracking.',
    icon: '🚇',
    color: null,
    order: 2,
    concepts: JSON.stringify(['connected components', 'cycle detection', 'backtracking', 'path finding']),
    totalProblems: 75,
    easyCount: 15,
    mediumCount: 45,
    hardCount: 15,
    problemRange: '876-950',
    unlockRequirement: JSON.stringify({ buildingSlug: 'bfs-metro', minPercent: 30 }),
  },
  {
    slug: 'topo-terminal',
    districtSlug: 'transit',
    name: 'Topo Terminal',
    subtitle: 'Module 17 - Topological Sort',
    description: 'Le terminal topologique. DAG, dépendances et détection de cycles.',
    icon: '🚏',
    color: null,
    order: 3,
    concepts: JSON.stringify(['DAG', 'dependencies', 'cycle detection', 'course schedule']),
    totalProblems: 50,
    easyCount: 10,
    mediumCount: 35,
    hardCount: 5,
    problemRange: '951-1000',
    unlockRequirement: JSON.stringify({ buildingSlug: 'dfs-tunnel', minPercent: 30 }),
  },
  {
    slug: 'union-junction',
    districtSlug: 'transit',
    name: 'Union Junction',
    subtitle: 'Module 18 - Union Find',
    description: 'La jonction Union-Find. Ensembles disjoints, composantes connexes et compression de chemin.',
    icon: '🔗',
    color: null,
    order: 4,
    concepts: JSON.stringify(['disjoint sets', 'path compression', 'rank', 'connected']),
    totalProblems: 50,
    easyCount: 5,
    mediumCount: 35,
    hardCount: 10,
    problemRange: '1001-1050',
    unlockRequirement: JSON.stringify({ buildingSlug: 'topo-terminal', minPercent: 30 }),
  },
  {
    slug: 'shortest-path-highway',
    districtSlug: 'transit',
    name: 'Shortest Path Highway',
    subtitle: 'Module 19 - Shortest Path',
    description: 'L\'autoroute du plus court chemin. Dijkstra, Bellman-Ford et Floyd-Warshall.',
    icon: '🛣️',
    color: null,
    order: 5,
    concepts: JSON.stringify(['Dijkstra', 'Bellman-Ford', 'Floyd-Warshall', 'weighted graph']),
    totalProblems: 50,
    easyCount: 5,
    mediumCount: 35,
    hardCount: 10,
    problemRange: '1051-1100',
    unlockRequirement: JSON.stringify({ buildingSlug: 'union-junction', minPercent: 30 }),
  },

  // =========================================================================
  // TECH PARK - Phase 4 (5 buildings)
  // =========================================================================
  {
    slug: 'backtrack-incubator',
    districtSlug: 'tech-park',
    name: 'Backtrack Incubator',
    subtitle: 'Module 20 - Backtracking',
    description: 'L\'incubateur du backtracking. Permutations, combinaisons, subsets et N-Queens.',
    icon: '💡',
    color: null,
    order: 1,
    concepts: JSON.stringify(['permutations', 'combinations', 'subsets', 'N-Queens', 'sudoku']),
    totalProblems: 100,
    easyCount: 15,
    mediumCount: 60,
    hardCount: 25,
    problemRange: '1101-1200',
    unlockRequirement: null,
  },
  {
    slug: 'dp-datacenter',
    districtSlug: 'tech-park',
    name: 'DP Datacenter',
    subtitle: 'Module 21 - Dynamic Programming 1D',
    description: 'Le datacenter de la DP. Memoization, tabulation et sous-structure optimale.',
    icon: '🖥️',
    color: null,
    order: 2,
    concepts: JSON.stringify(['memoization', 'tabulation', 'optimal substructure', 'coin change']),
    totalProblems: 150,
    easyCount: 30,
    mediumCount: 90,
    hardCount: 30,
    problemRange: '1201-1350',
    unlockRequirement: JSON.stringify({ buildingSlug: 'backtrack-incubator', minPercent: 30 }),
  },
  {
    slug: 'segment-server',
    districtSlug: 'tech-park',
    name: 'Segment Server',
    subtitle: 'Module 22 - Segment Tree',
    description: 'Le serveur des segment trees. Range queries, updates et lazy propagation.',
    icon: '🗄️',
    color: null,
    order: 3,
    concepts: JSON.stringify(['range query', 'range update', 'lazy propagation', 'point update']),
    totalProblems: 50,
    easyCount: 5,
    mediumCount: 30,
    hardCount: 15,
    problemRange: '1351-1400',
    unlockRequirement: JSON.stringify({ buildingSlug: 'dp-datacenter', minPercent: 30 }),
  },
  {
    slug: 'fenwick-firewall',
    districtSlug: 'tech-park',
    name: 'Fenwick Firewall',
    subtitle: 'Module 23 - Binary Indexed Tree',
    description: 'Le firewall Fenwick. Prefix sums, range updates et comptage d\'inversions.',
    icon: '🔥',
    color: null,
    order: 4,
    concepts: JSON.stringify(['prefix sum', 'range update', 'inversions', 'Fenwick tree']),
    totalProblems: 50,
    easyCount: 5,
    mediumCount: 35,
    hardCount: 10,
    problemRange: '1401-1450',
    unlockRequirement: JSON.stringify({ buildingSlug: 'segment-server', minPercent: 30 }),
  },
  {
    slug: 'dp2d-mainframe',
    districtSlug: 'tech-park',
    name: 'DP2D Mainframe',
    subtitle: 'Module 24 - Dynamic Programming 2D',
    description: 'Le mainframe de la DP 2D. Grid DP, string DP et interval DP.',
    icon: '🖲️',
    color: null,
    order: 5,
    concepts: JSON.stringify(['grid DP', 'string DP', 'interval DP', 'LCS', 'edit distance']),
    totalProblems: 50,
    easyCount: 10,
    mediumCount: 30,
    hardCount: 10,
    problemRange: '1451-1500',
    unlockRequirement: JSON.stringify({ buildingSlug: 'fenwick-firewall', minPercent: 30 }),
  },

  // =========================================================================
  // RESEARCH - Phase 5 (5 buildings)
  // =========================================================================
  {
    slug: 'greedy-lab',
    districtSlug: 'research',
    name: 'Greedy Lab',
    subtitle: 'Module 25 - Greedy',
    description: 'Le laboratoire gourmand. Choix optimal local, scheduling et algorithmes Huffman.',
    icon: '🧪',
    color: null,
    order: 1,
    concepts: JSON.stringify(['local optimal', 'scheduling', 'interval', 'huffman']),
    totalProblems: 75,
    easyCount: 20,
    mediumCount: 40,
    hardCount: 15,
    problemRange: '1501-1575',
    unlockRequirement: null,
  },
  {
    slug: 'bitwise-bunker',
    districtSlug: 'research',
    name: 'Bitwise Bunker',
    subtitle: 'Module 26 - Bit Manipulation',
    description: 'Le bunker bit à bit. XOR, masques, comptage de bits et opérations bit à bit.',
    icon: '💾',
    color: null,
    order: 2,
    concepts: JSON.stringify(['XOR', 'bit mask', 'counting bits', 'bit operations']),
    totalProblems: 75,
    easyCount: 25,
    mediumCount: 35,
    hardCount: 15,
    problemRange: '1576-1650',
    unlockRequirement: JSON.stringify({ buildingSlug: 'greedy-lab', minPercent: 30 }),
  },
  {
    slug: 'math-observatory',
    districtSlug: 'research',
    name: 'Math Observatory',
    subtitle: 'Module 27 - Math & Geometry',
    description: 'L\'observatoire mathématique. Nombres premiers, GCD/LCM, géométrie et combinatoire.',
    icon: '🔭',
    color: null,
    order: 3,
    concepts: JSON.stringify(['primes', 'GCD', 'LCM', 'geometry', 'combinatorics']),
    totalProblems: 75,
    easyCount: 20,
    mediumCount: 40,
    hardCount: 15,
    problemRange: '1651-1725',
    unlockRequirement: JSON.stringify({ buildingSlug: 'bitwise-bunker', minPercent: 30 }),
  },
  {
    slug: 'design-studio',
    districtSlug: 'research',
    name: 'Design Studio',
    subtitle: 'Module 28 - Design Problems',
    description: 'Le studio de design. OOP, structures custom, caches et itérateurs.',
    icon: '🎨',
    color: null,
    order: 4,
    concepts: JSON.stringify(['OOP', 'LRU cache', 'iterators', 'data structures']),
    totalProblems: 75,
    easyCount: 10,
    mediumCount: 45,
    hardCount: 20,
    problemRange: '1726-1800',
    unlockRequirement: JSON.stringify({ buildingSlug: 'math-observatory', minPercent: 30 }),
  },
  {
    slug: 'concurrency-reactor',
    districtSlug: 'research',
    name: 'Concurrency Reactor',
    subtitle: 'Module 29 - Concurrency',
    description: 'Le réacteur concurrent. Mutexes, sémaphores, barriers, channels et async/await.',
    icon: '⚛️',
    color: null,
    order: 5,
    concepts: JSON.stringify(['mutex', 'semaphore', 'barrier', 'channel', 'async/await']),
    totalProblems: 100,
    easyCount: 25,
    mediumCount: 50,
    hardCount: 25,
    problemRange: '1801-1900',
    unlockRequirement: JSON.stringify({ buildingSlug: 'design-studio', minPercent: 30 }),
  },

  // =========================================================================
  // SKYLINE - Phase 6 (4 buildings)
  // =========================================================================
  {
    slug: 'advanced-dp-penthouse',
    districtSlug: 'skyline',
    name: 'Advanced DP Penthouse',
    subtitle: 'Module 31 - Advanced DP',
    description: 'Le penthouse de la DP avancée. Bitmask DP, interval DP, tree DP et optimisations.',
    icon: '🏰',
    color: null,
    order: 1,
    concepts: JSON.stringify(['bitmask DP', 'interval DP', 'tree DP', 'optimization']),
    totalProblems: 150,
    easyCount: 10,
    mediumCount: 70,
    hardCount: 70,
    problemRange: '1901-2050',
    unlockRequirement: null,
  },
  {
    slug: 'hard-graph-helipad',
    districtSlug: 'skyline',
    name: 'Hard Graph Helipad',
    subtitle: 'Module 32 - Hard Graph',
    description: 'L\'héliport des graphes avancés. Graphes bipartis, flot max, cycle eulérien.',
    icon: '🚁',
    color: null,
    order: 2,
    concepts: JSON.stringify(['bipartite', 'max flow', 'Eulerian', 'weighted']),
    totalProblems: 150,
    easyCount: 5,
    mediumCount: 60,
    hardCount: 85,
    problemRange: '2051-2200',
    unlockRequirement: JSON.stringify({ buildingSlug: 'advanced-dp-penthouse', minPercent: 30 }),
  },
  {
    slug: 'string-algo-antenna',
    districtSlug: 'skyline',
    name: 'String Algo Antenna',
    subtitle: 'Module 33 - String Algorithms',
    description: 'L\'antenne des algorithmes de chaînes. KMP, Rabin-Karp, suffix array et Z-algorithm.',
    icon: '📻',
    color: null,
    order: 3,
    concepts: JSON.stringify(['KMP', 'Rabin-Karp', 'suffix array', 'Z-algorithm', 'Aho-Corasick']),
    totalProblems: 150,
    easyCount: 15,
    mediumCount: 80,
    hardCount: 55,
    problemRange: '2201-2350',
    unlockRequirement: JSON.stringify({ buildingSlug: 'hard-graph-helipad', minPercent: 30 }),
  },
  {
    slug: 'contest-crown',
    districtSlug: 'skyline',
    name: 'Contest Crown',
    subtitle: 'Module 34 - Contest Problems',
    description: 'La couronne des compétitions. Problèmes combinés, patterns mixtes et optimisation avancée.',
    icon: '👑',
    color: null,
    order: 4,
    concepts: JSON.stringify(['mixed patterns', 'optimization', 'contest', 'competitive']),
    totalProblems: 150,
    easyCount: 20,
    mediumCount: 80,
    hardCount: 50,
    problemRange: '2351-2500',
    unlockRequirement: JSON.stringify({ buildingSlug: 'string-algo-antenna', minPercent: 30 }),
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedDistricts(): Promise<void> {
  console.log('\n🏙️  Seeding districts...');

  for (const district of DISTRICTS) {
    try {
      // Check if already exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DISTRICTS,
        [Query.equal('slug', district.slug), Query.limit(1)]
      );

      if (existing.documents.length > 0) {
        console.log(`  ℹ️  District "${district.name}" already exists`);
        continue;
      }

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.DISTRICTS,
        ID.unique(),
        district
      );

      console.log(`  ✅ Created district "${district.name}"`);
    } catch (error) {
      console.error(`  ❌ Failed to create district "${district.name}":`, error);
    }
  }
}

async function seedBuildings(): Promise<void> {
  console.log('\n🏢 Seeding buildings...');

  for (const building of BUILDINGS) {
    try {
      // Check if already exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUILDINGS,
        [Query.equal('slug', building.slug), Query.limit(1)]
      );

      if (existing.documents.length > 0) {
        console.log(`  ℹ️  Building "${building.name}" already exists`);
        continue;
      }

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BUILDINGS,
        ID.unique(),
        building
      );

      console.log(`  ✅ Created building "${building.name}"`);
    } catch (error) {
      console.error(`  ❌ Failed to create building "${building.name}":`, error);
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  console.log('🚀 ALGOBOG Data Seed');
  console.log('====================');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Database: ${DATABASE_ID}`);

  try {
    await seedDistricts();
    await seedBuildings();

    console.log('\n✅ ALGOBOG data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${DISTRICTS.length} districts`);
    console.log(`   - ${BUILDINGS.length} buildings`);
    console.log(`   - Total problems: 2500 (to be imported separately)`);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
