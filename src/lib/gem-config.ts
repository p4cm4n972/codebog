/**
 * Configuration for the gem system
 * Gems are a virtual currency used to unlock exercises without following normal progression
 */

// Gem packs available for purchase via Stripe
export const GEM_PACKS = [
    { id: 'pack_100', gems: 100, price: 200, label: '100 gemmes' },      // 2€ in cents
    { id: 'pack_500', gems: 500, price: 800, label: '500 gemmes (+25%)' },  // 8€ (20% bonus)
    { id: 'pack_1000', gems: 1000, price: 1500, label: '1000 gemmes (+33%)' }, // 15€ (33% bonus)
] as const;

export type GemPackId = typeof GEM_PACKS[number]['id'];

// Unlock costs for JavaScript exercises (JSBOG)
// Based on world difficulty
export const JS_UNLOCK_COSTS: Record<string, number> = {
    // World 1-2: Easy (easy) - 10 gems
    'variables': 10,
    'loops': 10,
    // World 3-4: Medium (medium) - 25 gems
    'functions': 25,
    'arrays': 25,
    // World 5+: Hard (hard) - 50 gems
    'objects': 50,
    'async': 50,
    'dom': 50,
};

// Default unlock cost by difficulty level
export const JS_DIFFICULTY_COSTS = {
    easy: 10,      // Monde 1-2
    medium: 25,    // Monde 3-4
    hard: 50,      // Monde 5+
} as const;

// Unlock costs for C exercises (CBOG)
// Based on week number
export const C_WEEK_COSTS: Record<string, number> = {
    'c00': 10,  // Week 0
    'c01': 15,  // Week 1
    'c02': 20,  // Week 2
    'c03': 30,  // Week 3
    'c04': 40,  // Week 4
    'c05': 50,  // Week 5
    'c06': 60,  // Week 6
    'c07': 75,  // Week 7
    'c08': 100, // Week 8
};

// Default C unlock costs
export const C_DEFAULT_COST = 25;

/**
 * Get the gem cost to unlock a JS exercise
 */
export function getJsUnlockCost(worldSlug: string, difficulty?: string): number {
    // Check if world has specific cost
    if (JS_UNLOCK_COSTS[worldSlug]) {
        return JS_UNLOCK_COSTS[worldSlug];
    }

    // Fall back to difficulty-based cost
    if (difficulty && JS_DIFFICULTY_COSTS[difficulty as keyof typeof JS_DIFFICULTY_COSTS]) {
        return JS_DIFFICULTY_COSTS[difficulty as keyof typeof JS_DIFFICULTY_COSTS];
    }

    // Default to medium
    return JS_DIFFICULTY_COSTS.medium;
}

/**
 * Get the gem cost to unlock a C exercise
 */
export function getCUnlockCost(week: string): number {
    // Extract week identifier (e.g., "c00" from "c00/ex00")
    const weekKey = week.toLowerCase();

    if (C_WEEK_COSTS[weekKey]) {
        return C_WEEK_COSTS[weekKey];
    }

    return C_DEFAULT_COST;
}

/**
 * Get a gem pack by its ID
 */
export function getGemPack(packId: GemPackId) {
    return GEM_PACKS.find(pack => pack.id === packId);
}

/**
 * Validate a pack ID
 */
export function isValidPackId(packId: string): packId is GemPackId {
    return GEM_PACKS.some(pack => pack.id === packId);
}
