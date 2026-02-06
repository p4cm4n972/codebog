import { describe, it, expect } from 'vitest';
import {
  DISTRICT_UNLOCK_COSTS,
  BUILDING_UNLOCK_COSTS,
  PROBLEM_UNLOCK_COSTS,
  HINT_COSTS,
  XP_REWARDS,
  XP_BONUSES,
  getDistrictUnlockCost,
  getBuildingUnlockCost,
  getProblemUnlockCost,
  calculateXpReward,
  isValidSlug,
} from './gem-config';

// ============================================================================
// DISTRICT UNLOCK COSTS
// ============================================================================

describe('DISTRICT_UNLOCK_COSTS', () => {
  it('should have 6 districts defined', () => {
    const districtSlugs = Object.keys(DISTRICT_UNLOCK_COSTS);
    expect(districtSlugs).toHaveLength(6);
  });

  it('should have downtown as free (first district)', () => {
    expect(DISTRICT_UNLOCK_COSTS['downtown']).toBe(0);
  });

  it('should have increasing costs for later districts', () => {
    expect(DISTRICT_UNLOCK_COSTS['industrial']).toBe(100);
    expect(DISTRICT_UNLOCK_COSTS['transit']).toBe(150);
    expect(DISTRICT_UNLOCK_COSTS['tech-park']).toBe(200);
    expect(DISTRICT_UNLOCK_COSTS['research']).toBe(250);
    expect(DISTRICT_UNLOCK_COSTS['skyline']).toBe(500);
  });

  it('should have skyline as most expensive (expert level)', () => {
    const maxCost = Math.max(...Object.values(DISTRICT_UNLOCK_COSTS));
    expect(DISTRICT_UNLOCK_COSTS['skyline']).toBe(maxCost);
  });
});

// ============================================================================
// BUILDING UNLOCK COSTS
// ============================================================================

describe('BUILDING_UNLOCK_COSTS', () => {
  it('should have 33 buildings defined', () => {
    const buildingSlugs = Object.keys(BUILDING_UNLOCK_COSTS);
    expect(buildingSlugs).toHaveLength(33);
  });

  it('should have first building of each district as free', () => {
    // Phase 1 - Downtown
    expect(BUILDING_UNLOCK_COSTS['array-tower']).toBe(0);
    // Phase 2 - Industrial
    expect(BUILDING_UNLOCK_COSTS['linked-list-factory']).toBe(0);
    // Phase 3 - Transit
    expect(BUILDING_UNLOCK_COSTS['bfs-metro']).toBe(0);
    // Phase 4 - Tech Park
    expect(BUILDING_UNLOCK_COSTS['backtrack-incubator']).toBe(0);
    // Phase 5 - Research
    expect(BUILDING_UNLOCK_COSTS['greedy-lab']).toBe(0);
    // Phase 6 - Skyline
    expect(BUILDING_UNLOCK_COSTS['advanced-dp-penthouse']).toBe(0);
  });

  it('should have increasing costs for non-first buildings', () => {
    // Phase 1 buildings should increase
    expect(BUILDING_UNLOCK_COSTS['string-plaza']).toBe(15);
    expect(BUILDING_UNLOCK_COSTS['stack-skyscraper']).toBe(45);
  });

  it('should have highest cost for contest-crown (final building)', () => {
    expect(BUILDING_UNLOCK_COSTS['contest-crown']).toBe(200);
  });
});

// ============================================================================
// PROBLEM UNLOCK COSTS
// ============================================================================

describe('PROBLEM_UNLOCK_COSTS', () => {
  it('should have 3 difficulty levels defined', () => {
    expect(Object.keys(PROBLEM_UNLOCK_COSTS)).toHaveLength(3);
  });

  it('should have correct costs per difficulty', () => {
    expect(PROBLEM_UNLOCK_COSTS.easy).toBe(5);
    expect(PROBLEM_UNLOCK_COSTS.medium).toBe(15);
    expect(PROBLEM_UNLOCK_COSTS.hard).toBe(30);
  });

  it('should have increasing costs with difficulty', () => {
    expect(PROBLEM_UNLOCK_COSTS.easy).toBeLessThan(PROBLEM_UNLOCK_COSTS.medium);
    expect(PROBLEM_UNLOCK_COSTS.medium).toBeLessThan(PROBLEM_UNLOCK_COSTS.hard);
  });
});

// ============================================================================
// HINT COSTS
// ============================================================================

describe('HINT_COSTS', () => {
  it('should have 3 hint levels defined', () => {
    expect(Object.keys(HINT_COSTS)).toHaveLength(3);
  });

  it('should have increasing costs per hint level', () => {
    expect(HINT_COSTS.hint1).toBe(2);
    expect(HINT_COSTS.hint2).toBe(5);
    expect(HINT_COSTS.hint3).toBe(10);
    expect(HINT_COSTS.hint1).toBeLessThan(HINT_COSTS.hint2);
    expect(HINT_COSTS.hint2).toBeLessThan(HINT_COSTS.hint3);
  });
});

// ============================================================================
// XP REWARDS
// ============================================================================

describe('XP_REWARDS', () => {
  it('should have 3 difficulty levels defined', () => {
    expect(Object.keys(XP_REWARDS)).toHaveLength(3);
  });

  it('should have correct XP per difficulty', () => {
    expect(XP_REWARDS.easy).toBe(10);
    expect(XP_REWARDS.medium).toBe(25);
    expect(XP_REWARDS.hard).toBe(50);
  });
});

describe('XP_BONUSES', () => {
  it('should have correct bonus multipliers', () => {
    expect(XP_BONUSES.firstTry).toBe(1.5);
    expect(XP_BONUSES.speedBonus).toBe(1.2);
    expect(XP_BONUSES.noHints).toBe(1.1);
    expect(XP_BONUSES.streakBonus).toBe(0.1);
    expect(XP_BONUSES.maxStreakMultiplier).toBe(1.5);
  });
});

// ============================================================================
// getDistrictUnlockCost
// ============================================================================

describe('getDistrictUnlockCost', () => {
  it('should return correct cost for known districts', () => {
    expect(getDistrictUnlockCost('downtown')).toBe(0);
    expect(getDistrictUnlockCost('industrial')).toBe(100);
    expect(getDistrictUnlockCost('skyline')).toBe(500);
  });

  it('should throw for unknown district slug', () => {
    expect(() => getDistrictUnlockCost('unknown-district')).toThrow(
      'Unknown district: unknown-district'
    );
  });

  it('should throw for empty string', () => {
    expect(() => getDistrictUnlockCost('')).toThrow('Unknown district: ');
  });
});

// ============================================================================
// getBuildingUnlockCost
// ============================================================================

describe('getBuildingUnlockCost', () => {
  it('should return correct cost for known buildings', () => {
    expect(getBuildingUnlockCost('array-tower')).toBe(0);
    expect(getBuildingUnlockCost('string-plaza')).toBe(15);
    expect(getBuildingUnlockCost('contest-crown')).toBe(200);
  });

  it('should throw for unknown building slug', () => {
    expect(() => getBuildingUnlockCost('unknown-building')).toThrow(
      'Unknown building: unknown-building'
    );
  });

  it('should throw for typos in building names', () => {
    expect(() => getBuildingUnlockCost('arraytower')).toThrow(
      'Unknown building: arraytower'
    );
  });
});

// ============================================================================
// getProblemUnlockCost
// ============================================================================

describe('getProblemUnlockCost', () => {
  it('should return correct cost for valid difficulties', () => {
    expect(getProblemUnlockCost('easy')).toBe(5);
    expect(getProblemUnlockCost('medium')).toBe(15);
    expect(getProblemUnlockCost('hard')).toBe(30);
  });

  it('should throw for invalid difficulty', () => {
    expect(() => getProblemUnlockCost('invalid')).toThrow(
      'Invalid difficulty: invalid'
    );
  });

  it('should throw for empty string', () => {
    expect(() => getProblemUnlockCost('')).toThrow('Invalid difficulty: ');
  });

  it('should throw for capitalized difficulty (case sensitive)', () => {
    expect(() => getProblemUnlockCost('Easy')).toThrow(
      'Invalid difficulty: Easy'
    );
  });
});

// ============================================================================
// calculateXpReward
// ============================================================================

describe('calculateXpReward', () => {
  // Note: noHints bonus (1.1x) is applied by DEFAULT when usedHints is undefined
  // This is intentional: !undefined === true, so no hints = bonus

  it('should return base XP when usedHints=true (disables noHints bonus)', () => {
    // usedHints: true disables the automatic noHints bonus
    expect(calculateXpReward('easy', { usedHints: true })).toBe(10);
    expect(calculateXpReward('medium', { usedHints: true })).toBe(25);
    expect(calculateXpReward('hard', { usedHints: true })).toBe(50);
  });

  it('should apply noHints bonus by default (1.1x)', () => {
    // When usedHints is undefined, !undefined === true → bonus applied
    expect(calculateXpReward('easy', {})).toBe(11); // 10 * 1.1
    expect(calculateXpReward('medium', {})).toBe(28); // 25 * 1.1 = 27.5 → 28
  });

  it('should apply firstTry bonus (1.5x)', () => {
    // With usedHints: true to isolate firstTry bonus
    expect(calculateXpReward('easy', { isFirstTry: true, usedHints: true })).toBe(15);
    expect(calculateXpReward('medium', { isFirstTry: true, usedHints: true })).toBe(38); // 25 * 1.5 = 37.5 -> 38
  });

  it('should apply speedBonus (1.2x)', () => {
    // With usedHints: true to isolate speed bonus
    expect(calculateXpReward('easy', { isUnderTimeLimit: true, usedHints: true })).toBe(12);
  });

  it('should apply noHints bonus (1.1x) when usedHints is explicitly false', () => {
    expect(calculateXpReward('easy', { usedHints: false })).toBe(11);
  });

  it('should NOT apply noHints bonus when usedHints is true', () => {
    expect(calculateXpReward('easy', { usedHints: true })).toBe(10);
  });

  it('should apply streak bonus correctly (with usedHints: true to isolate)', () => {
    // 1 day streak = 1.1x
    expect(calculateXpReward('easy', { streakDays: 1, usedHints: true })).toBe(11);
    // 3 day streak = 1.3x
    expect(calculateXpReward('easy', { streakDays: 3, usedHints: true })).toBe(13);
    // 5 day streak = 1.5x (max)
    expect(calculateXpReward('easy', { streakDays: 5, usedHints: true })).toBe(15);
  });

  it('should cap streak bonus at maxStreakMultiplier (1.5x)', () => {
    // 10 day streak should still be capped at 1.5x (with usedHints: true)
    expect(calculateXpReward('easy', { streakDays: 10, usedHints: true })).toBe(15);
    expect(calculateXpReward('easy', { streakDays: 100, usedHints: true })).toBe(15);
  });

  it('should stack multiple bonuses', () => {
    // easy (10) * firstTry (1.5) * speed (1.2) * noHints (1.1) = 19.8 -> 20
    expect(
      calculateXpReward('easy', {
        isFirstTry: true,
        isUnderTimeLimit: true,
        usedHints: false,
      })
    ).toBe(20);
  });

  it('should handle all bonuses stacked for max XP', () => {
    // hard (50) * firstTry (1.5) * speed (1.2) * noHints (1.1) * streak max (1.5)
    // 50 * 1.5 * 1.2 * 1.1 * 1.5 = 148.5 -> 149
    expect(
      calculateXpReward('hard', {
        isFirstTry: true,
        isUnderTimeLimit: true,
        usedHints: false,
        streakDays: 10,
      })
    ).toBe(149);
  });

  it('should handle zero streak days (noHints still applied by default)', () => {
    // noHints bonus applied: 10 * 1.1 = 11
    expect(calculateXpReward('easy', { streakDays: 0 })).toBe(11);
    // Explicitly no hints bonus
    expect(calculateXpReward('easy', { streakDays: 0, usedHints: true })).toBe(10);
  });

  it('should ignore negative streak days', () => {
    // noHints applied: 10 * 1.1 = 11
    expect(calculateXpReward('easy', { streakDays: -5 })).toBe(11);
    // Explicitly no hints bonus
    expect(calculateXpReward('easy', { streakDays: -5, usedHints: true })).toBe(10);
  });
});

// ============================================================================
// isValidSlug
// ============================================================================

describe('isValidSlug', () => {
  describe('valid slugs', () => {
    it('should accept lowercase letters and hyphens', () => {
      expect(isValidSlug('array-tower')).toBe(true);
      expect(isValidSlug('two-sum')).toBe(true);
      expect(isValidSlug('bfs-metro')).toBe(true);
    });

    it('should accept slugs with numbers', () => {
      expect(isValidSlug('dp2d-mainframe')).toBe(true);
      expect(isValidSlug('problem123')).toBe(true);
    });

    it('should accept slugs at minimum length (3 chars)', () => {
      expect(isValidSlug('abc')).toBe(true);
    });

    it('should accept slugs at maximum length (50 chars)', () => {
      const longSlug = 'a' + 'b'.repeat(49);
      expect(isValidSlug(longSlug)).toBe(true);
    });
  });

  describe('invalid slugs', () => {
    it('should reject empty string', () => {
      expect(isValidSlug('')).toBe(false);
    });

    it('should reject slugs starting with number', () => {
      expect(isValidSlug('2sum')).toBe(false);
      expect(isValidSlug('123problem')).toBe(false);
    });

    it('should reject slugs starting with hyphen', () => {
      expect(isValidSlug('-array')).toBe(false);
    });

    it('should reject slugs with uppercase letters', () => {
      expect(isValidSlug('Array-Tower')).toBe(false);
      expect(isValidSlug('ARRAY')).toBe(false);
    });

    it('should reject slugs with special characters', () => {
      expect(isValidSlug('array_tower')).toBe(false); // underscore
      expect(isValidSlug('array.tower')).toBe(false); // dot
      expect(isValidSlug('array tower')).toBe(false); // space
      expect(isValidSlug('array@tower')).toBe(false); // at sign
    });

    it('should reject slugs too short (< 3 chars)', () => {
      expect(isValidSlug('ab')).toBe(false);
      expect(isValidSlug('a')).toBe(false);
    });

    it('should reject slugs too long (> 50 chars)', () => {
      const tooLongSlug = 'a' + 'b'.repeat(50);
      expect(isValidSlug(tooLongSlug)).toBe(false);
    });

    it('should reject SQL injection attempts', () => {
      expect(isValidSlug("array'; DROP TABLE--")).toBe(false);
      expect(isValidSlug('array OR 1=1')).toBe(false);
    });

    it('should reject path traversal attempts', () => {
      expect(isValidSlug('../../../etc/passwd')).toBe(false);
      expect(isValidSlug('..%2f..%2f')).toBe(false);
    });
  });
});
