/**
 * ALGOBOG Gem Configuration
 *
 * Pricing structure for unlocking problems with gems.
 * Security: Costs are defined server-side only, never trust client values.
 */

// ============================================================================
// DISTRICT (PHASE) UNLOCK COSTS
// ============================================================================

/**
 * Cost to unlock an entire district (bypass progression requirement)
 * Users normally need 50% of previous district to unlock next
 */
export const DISTRICT_UNLOCK_COSTS: Record<string, number> = {
  // Phase 1 - Always unlocked
  'downtown': 0,

  // Phase 2 - Requires 50% of Phase 1 OR gems
  'industrial': 100,

  // Phase 3 - Requires 50% of Phase 2 OR gems
  'transit': 150,

  // Phase 4 - Requires 50% of Phase 3 OR gems
  'tech-park': 200,

  // Phase 5 - Requires 50% of Phase 4 OR gems
  'research': 250,

  // Phase 6 - Requires 75% of Phase 5 OR gems (expert level)
  'skyline': 500,
};

// ============================================================================
// BUILDING (MODULE) UNLOCK COSTS
// ============================================================================

/**
 * Cost to unlock a building within a district
 * First building of each district is always free
 */
export const BUILDING_UNLOCK_COSTS: Record<string, number> = {
  // Phase 1 - Downtown (8 buildings)
  'array-tower': 0,           // First = free
  'string-plaza': 15,
  'hash-hub': 20,
  'two-pointers-bridge': 25,
  'binary-search-center': 30,
  'sliding-window-mall': 35,
  'sorting-station': 40,
  'stack-skyscraper': 45,

  // Phase 2 - Industrial (6 buildings)
  'linked-list-factory': 0,   // First = free
  'queue-warehouse': 30,
  'tree-greenhouse': 40,
  'bst-laboratory': 50,
  'heap-refinery': 60,
  'trie-telecom': 70,

  // Phase 3 - Transit (5 buildings)
  'bfs-metro': 0,             // First = free
  'dfs-tunnel': 50,
  'topo-terminal': 60,
  'union-junction': 70,
  'shortest-path-highway': 80,

  // Phase 4 - Tech Park (5 buildings)
  'backtrack-incubator': 0,   // First = free
  'dp-datacenter': 75,
  'segment-server': 85,
  'fenwick-firewall': 95,
  'dp2d-mainframe': 100,

  // Phase 5 - Research (5 buildings)
  'greedy-lab': 0,            // First = free
  'bitwise-bunker': 80,
  'math-observatory': 90,
  'design-studio': 100,
  'concurrency-reactor': 120,

  // Phase 6 - Skyline (4 buildings)
  'advanced-dp-penthouse': 0, // First = free
  'hard-graph-helipad': 150,
  'string-algo-antenna': 175,
  'contest-crown': 200,
};

// ============================================================================
// PROBLEM UNLOCK COSTS
// ============================================================================

/**
 * Cost to unlock individual problems (skip to specific problem)
 * Based on difficulty
 */
export const PROBLEM_UNLOCK_COSTS = {
  easy: 5,
  medium: 15,
  hard: 30,
} as const;

// ============================================================================
// HINT COSTS
// ============================================================================

/**
 * Cost to reveal hints for a problem
 */
export const HINT_COSTS = {
  hint1: 2,   // First hint (general direction)
  hint2: 5,   // Second hint (approach)
  hint3: 10,  // Third hint (near-solution)
} as const;

// ============================================================================
// XP REWARDS
// ============================================================================

/**
 * XP earned for completing problems
 * Note: XP only awarded on FIRST completion (anti-farming)
 */
export const XP_REWARDS = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const;

/**
 * XP bonuses (multipliers applied to base XP)
 */
export const XP_BONUSES = {
  firstTry: 1.5,        // Solved on first submission
  speedBonus: 1.2,      // Solved under time limit (easy: 5min, medium: 15min, hard: 30min)
  noHints: 1.1,         // Solved without using any hints
  streakBonus: 0.1,     // +10% per consecutive day (max +50%)
  maxStreakMultiplier: 1.5,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get unlock cost for a district
 * @throws Error if district not found (prevents bypass via unknown slug)
 */
export function getDistrictUnlockCost(districtSlug: string): number {
  const cost = DISTRICT_UNLOCK_COSTS[districtSlug];
  if (cost === undefined) {
    throw new Error(`Unknown district: ${districtSlug}`);
  }
  return cost;
}

/**
 * Get unlock cost for a building
 * @throws Error if building not found (prevents bypass via unknown slug)
 */
export function getBuildingUnlockCost(buildingSlug: string): number {
  const cost = BUILDING_UNLOCK_COSTS[buildingSlug];
  if (cost === undefined) {
    throw new Error(`Unknown building: ${buildingSlug}`);
  }
  return cost;
}

/**
 * Get unlock cost for a problem based on difficulty
 * @throws Error if difficulty not valid (prevents bypass via invalid difficulty)
 */
export function getProblemUnlockCost(difficulty: string): number {
  if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
    throw new Error(`Invalid difficulty: ${difficulty}`);
  }
  return PROBLEM_UNLOCK_COSTS[difficulty];
}

/**
 * Calculate XP reward with bonuses
 */
export function calculateXpReward(
  difficulty: 'easy' | 'medium' | 'hard',
  options: {
    isFirstTry?: boolean;
    isUnderTimeLimit?: boolean;
    usedHints?: boolean;
    streakDays?: number;
  } = {}
): number {
  let xp = XP_REWARDS[difficulty];

  if (options.isFirstTry) {
    xp *= XP_BONUSES.firstTry;
  }

  if (options.isUnderTimeLimit) {
    xp *= XP_BONUSES.speedBonus;
  }

  if (!options.usedHints) {
    xp *= XP_BONUSES.noHints;
  }

  if (options.streakDays && options.streakDays > 0) {
    const streakMultiplier = Math.min(
      1 + (options.streakDays * XP_BONUSES.streakBonus),
      XP_BONUSES.maxStreakMultiplier
    );
    xp *= streakMultiplier;
  }

  return Math.round(xp);
}

/**
 * Validate that a slug matches expected format
 * Prevents injection attacks via malformed slugs
 */
export function isValidSlug(slug: string): boolean {
  // Only allow lowercase letters, numbers, and hyphens
  // Must start with a letter, 3-50 chars
  return /^[a-z][a-z0-9-]{2,49}$/.test(slug);
}
