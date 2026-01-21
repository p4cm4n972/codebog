import { describe, it, expect } from 'vitest';
import { isWorldUnlocked, getWorldProgress, WorldProgress } from './world-utils';

describe('isWorldUnlocked', () => {
    const mockProgress: WorldProgress[] = [
        { worldSlug: 'fondations', completedLevels: 10, totalLevels: 10 }, // 100%
        { worldSlug: 'fp-valley', completedLevels: 3, totalLevels: 10 },   // 30%
        { worldSlug: 'async-forest', completedLevels: 0, totalLevels: 5 }, // 0%
    ];

    it('should return true when unlockAll is true', () => {
        const requirement = JSON.stringify({ worldSlug: 'fondations', minPercent: 100 });
        expect(isWorldUnlocked(requirement, [], true)).toBe(true);
    });

    it('should return true when there is no unlock requirement', () => {
        expect(isWorldUnlocked(null, mockProgress)).toBe(true);
        expect(isWorldUnlocked(undefined, mockProgress)).toBe(true);
        expect(isWorldUnlocked('', mockProgress)).toBe(true);
    });

    it('should return true when prerequisite is completed', () => {
        const requirement = JSON.stringify({ worldSlug: 'fondations', minPercent: 100 });
        expect(isWorldUnlocked(requirement, mockProgress)).toBe(true);
    });

    it('should return false when prerequisite is not met', () => {
        const requirement = JSON.stringify({ worldSlug: 'fp-valley', minPercent: 50 });
        expect(isWorldUnlocked(requirement, mockProgress)).toBe(false);
    });

    it('should return true when progress meets minimum percent', () => {
        const requirement = JSON.stringify({ worldSlug: 'fp-valley', minPercent: 30 });
        expect(isWorldUnlocked(requirement, mockProgress)).toBe(true);
    });

    it('should return false when world has no progress', () => {
        const requirement = JSON.stringify({ worldSlug: 'unknown-world', minPercent: 10 });
        expect(isWorldUnlocked(requirement, mockProgress)).toBe(false);
    });

    it('should return false when world has 0% progress and requirement > 0', () => {
        const requirement = JSON.stringify({ worldSlug: 'async-forest', minPercent: 10 });
        expect(isWorldUnlocked(requirement, mockProgress)).toBe(false);
    });

    it('should return true for invalid JSON (fallback to unlocked)', () => {
        expect(isWorldUnlocked('invalid json', mockProgress)).toBe(true);
    });
});

describe('getWorldProgress', () => {
    const mockProgress: WorldProgress[] = [
        { worldSlug: 'fondations', completedLevels: 10, totalLevels: 10 },
        { worldSlug: 'fp-valley', completedLevels: 3, totalLevels: 10 },
        { worldSlug: 'empty-world', completedLevels: 0, totalLevels: 0 },
    ];

    it('should return 100 for fully completed world', () => {
        expect(getWorldProgress('fondations', mockProgress)).toBe(100);
    });

    it('should return correct percentage for partial progress', () => {
        expect(getWorldProgress('fp-valley', mockProgress)).toBe(30);
    });

    it('should return 0 for unknown world', () => {
        expect(getWorldProgress('unknown', mockProgress)).toBe(0);
    });

    it('should return 0 for world with 0 total levels', () => {
        expect(getWorldProgress('empty-world', mockProgress)).toBe(0);
    });

    it('should round percentage correctly', () => {
        const progress: WorldProgress[] = [
            { worldSlug: 'test', completedLevels: 1, totalLevels: 3 }, // 33.33...%
        ];
        expect(getWorldProgress('test', progress)).toBe(33);
    });
});
