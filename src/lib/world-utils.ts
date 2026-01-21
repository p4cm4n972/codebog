// Extracted utility functions for WorldMap (for testability)

export interface WorldProgress {
    worldSlug: string;
    completedLevels: number;
    totalLevels: number;
}

export interface WorldUnlockRequirement {
    worldSlug: string;
    minPercent: number;
}

/**
 * Check if a world is unlocked based on progress in prerequisite worlds
 */
export function isWorldUnlocked(
    unlockRequirement: string | null | undefined,
    userProgress: WorldProgress[],
    unlockAll?: boolean
): boolean {
    // Admins and moderators have all worlds unlocked
    if (unlockAll) return true;

    if (!unlockRequirement) return true;

    try {
        const requirement = JSON.parse(unlockRequirement) as WorldUnlockRequirement;
        const progress = userProgress.find(p => p.worldSlug === requirement.worldSlug);
        if (!progress) return false;

        const percent = progress.totalLevels > 0
            ? (progress.completedLevels / progress.totalLevels) * 100
            : 0;
        return percent >= requirement.minPercent;
    } catch {
        // Invalid JSON = no requirement
        return true;
    }
}

/**
 * Get completion percentage for a world
 */
export function getWorldProgress(worldSlug: string, userProgress: WorldProgress[]): number {
    const progress = userProgress.find(p => p.worldSlug === worldSlug);
    if (!progress || progress.totalLevels === 0) return 0;
    return Math.round((progress.completedLevels / progress.totalLevels) * 100);
}
