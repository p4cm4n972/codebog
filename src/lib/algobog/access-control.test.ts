import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Appwrite before imports
const mockListDocuments = vi.fn();
const mockCreateDocument = vi.fn();

vi.mock('node-appwrite', () => ({
  Client: class MockClient {
    setEndpoint() { return this; }
    setProject() { return this; }
    setKey() { return this; }
  },
  Databases: class MockDatabases {
    listDocuments = mockListDocuments;
    createDocument = mockCreateDocument;
  },
  Query: {
    equal: (field: string, value: unknown) => `${field}=${value}`,
    contains: (field: string, values: unknown[]) => `${field} contains [${values}]`,
    limit: (n: number) => `limit=${n}`,
    orderDesc: (field: string) => `orderDesc=${field}`,
  },
  ID: {
    unique: () => 'unique-id-123',
  },
}));

import {
  ALGO_COLLECTIONS,
  checkAlgoGemUnlock,
  createAlgoGemUnlock,
  isDistrictUnlocked,
  isBuildingUnlocked,
  isProblemUnlocked,
  getUnlockCost,
  type AccessResult,
  type AlgoDistrict,
  type AlgoBuilding,
  type AlgoProblem,
  type AlgoUnlock,
} from './access-control';

// ============================================================================
// CONSTANTS
// ============================================================================

describe('ALGO_COLLECTIONS', () => {
  it('should have all required collection IDs', () => {
    expect(ALGO_COLLECTIONS.DISTRICTS).toBe('algo-districts');
    expect(ALGO_COLLECTIONS.BUILDINGS).toBe('algo-buildings');
    expect(ALGO_COLLECTIONS.PROBLEMS).toBe('algo-problems');
    expect(ALGO_COLLECTIONS.SUBMISSIONS).toBe('algo-submissions');
    expect(ALGO_COLLECTIONS.PROGRESS).toBe('algo-progress');
    expect(ALGO_COLLECTIONS.UNLOCKS).toBe('algo-unlocks');
  });
});

// ============================================================================
// checkAlgoGemUnlock
// ============================================================================

describe('checkAlgoGemUnlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no unlock exists', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await checkAlgoGemUnlock('user-123', 'district', 'industrial');

    expect(result).toBeNull();
    expect(mockListDocuments).toHaveBeenCalledTimes(1);
  });

  it('should return unlock document when exists', async () => {
    const mockUnlock: AlgoUnlock = {
      $id: 'unlock-1',
      userId: 'user-123',
      targetType: 'district',
      targetSlug: 'industrial',
      gemsCost: 100,
      unlockedAt: '2024-01-01T00:00:00.000Z',
    };
    mockListDocuments.mockResolvedValueOnce({ documents: [mockUnlock] });

    const result = await checkAlgoGemUnlock('user-123', 'district', 'industrial');

    expect(result).toEqual(mockUnlock);
  });

  it('should return null on database error (graceful degradation)', async () => {
    mockListDocuments.mockRejectedValueOnce(new Error('Database unavailable'));

    const result = await checkAlgoGemUnlock('user-123', 'district', 'industrial');

    expect(result).toBeNull();
  });

  it('should throw for invalid userId', async () => {
    await expect(checkAlgoGemUnlock('', 'district', 'industrial')).rejects.toThrow(
      'Invalid userId'
    );

    // @ts-expect-error Testing invalid input
    await expect(checkAlgoGemUnlock(null, 'district', 'industrial')).rejects.toThrow(
      'Invalid userId'
    );
  });

  it('should throw for invalid slug format', async () => {
    await expect(
      checkAlgoGemUnlock('user-123', 'district', 'Invalid_Slug!')
    ).rejects.toThrow('Invalid target slug format');

    await expect(
      checkAlgoGemUnlock('user-123', 'district', '../../../etc')
    ).rejects.toThrow('Invalid target slug format');
  });
});

// ============================================================================
// createAlgoGemUnlock
// ============================================================================

describe('createAlgoGemUnlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create unlock document successfully', async () => {
    // No existing unlock
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const createdUnlock = {
      $id: 'unique-id-123',
      userId: 'user-123',
      targetType: 'district',
      targetSlug: 'industrial',
      gemsCost: 100,
      unlockedAt: expect.any(String),
    };
    mockCreateDocument.mockResolvedValueOnce(createdUnlock);

    const result = await createAlgoGemUnlock('user-123', 'district', 'industrial', 100);

    expect(result).toEqual(createdUnlock);
    expect(mockCreateDocument).toHaveBeenCalledTimes(1);
  });

  it('should throw if already unlocked (prevent double-spending)', async () => {
    // Existing unlock
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ $id: 'existing-unlock' }],
    });

    await expect(
      createAlgoGemUnlock('user-123', 'district', 'industrial', 100)
    ).rejects.toThrow('Target already unlocked');

    expect(mockCreateDocument).not.toHaveBeenCalled();
  });

  it('should throw for negative gems cost', async () => {
    await expect(
      createAlgoGemUnlock('user-123', 'district', 'industrial', -10)
    ).rejects.toThrow('Invalid gems cost');
  });

  it('should throw for non-integer gems cost', async () => {
    await expect(
      createAlgoGemUnlock('user-123', 'district', 'industrial', 10.5)
    ).rejects.toThrow('Invalid gems cost');
  });

  it('should throw for invalid slug format', async () => {
    await expect(
      createAlgoGemUnlock('user-123', 'district', 'Invalid!', 100)
    ).rejects.toThrow('Invalid target slug format');
  });
});

// ============================================================================
// isDistrictUnlocked
// ============================================================================

describe('isDistrictUnlocked', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should grant access to admin (unlockAll = true)', async () => {
    const result = await isDistrictUnlocked('user-123', 'skyline', true);

    expect(result).toEqual({ hasAccess: true, reason: 'admin' });
    expect(mockListDocuments).not.toHaveBeenCalled(); // No DB call needed
  });

  it('should return invalid for malformed slug', async () => {
    const result = await isDistrictUnlocked('user-123', 'Invalid_Slug!', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Invalid district slug',
    });
  });

  it('should return invalid for non-existent district', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await isDistrictUnlocked('user-123', 'unknown-district', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'District not found',
    });
  });

  it('should always unlock first district (order = 1)', async () => {
    const district: AlgoDistrict = {
      $id: 'district-1',
      slug: 'downtown',
      name: 'Downtown',
      order: 1,
    };
    mockListDocuments.mockResolvedValueOnce({ documents: [district] });

    const result = await isDistrictUnlocked('user-123', 'downtown', false);

    expect(result).toEqual({ hasAccess: true, reason: 'unlocked' });
  });

  it('should grant access via gem unlock', async () => {
    const district: AlgoDistrict = {
      $id: 'district-2',
      slug: 'industrial',
      name: 'Industrial',
      order: 2,
    };
    const unlock: AlgoUnlock = {
      $id: 'unlock-1',
      userId: 'user-123',
      targetType: 'district',
      targetSlug: 'industrial',
      gemsCost: 100,
      unlockedAt: '2024-01-01',
    };

    // First call: get district
    mockListDocuments.mockResolvedValueOnce({ documents: [district] });
    // Second call: check gem unlock
    mockListDocuments.mockResolvedValueOnce({ documents: [unlock] });

    const result = await isDistrictUnlocked('user-123', 'industrial', false);

    expect(result).toEqual({ hasAccess: true, reason: 'gem_unlock' });
  });

  it('should return locked for district without progression or gem unlock', async () => {
    const district: AlgoDistrict = {
      $id: 'district-2',
      slug: 'industrial',
      name: 'Industrial',
      order: 2,
      // No unlockRequirement = no way to unlock via progression
    };

    // Get district
    mockListDocuments.mockResolvedValueOnce({ documents: [district] });
    // Check gem unlock - none
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await isDistrictUnlocked('user-123', 'industrial', false);

    expect(result).toEqual({ hasAccess: false, reason: 'locked' });
  });
});

// ============================================================================
// isBuildingUnlocked
// ============================================================================

describe('isBuildingUnlocked', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should grant access to admin', async () => {
    const result = await isBuildingUnlocked('user-123', 'dp-datacenter', true);

    expect(result).toEqual({ hasAccess: true, reason: 'admin' });
  });

  it('should return invalid for malformed slug', async () => {
    const result = await isBuildingUnlocked('user-123', 'Invalid!', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Invalid building slug',
    });
  });

  it('should return invalid for non-existent building', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await isBuildingUnlocked('user-123', 'unknown-building', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Building not found',
    });
  });

  it('should check parent district access first', async () => {
    const building: AlgoBuilding = {
      $id: 'building-1',
      slug: 'dp-datacenter',
      districtSlug: 'tech-park',
      name: 'DP Datacenter',
      order: 2,
      totalProblems: 50,
    };

    // Get building
    mockListDocuments.mockResolvedValueOnce({ documents: [building] });
    // Get parent district (tech-park, order > 1)
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ slug: 'tech-park', order: 4 }],
    });
    // Check district gem unlock - none
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await isBuildingUnlocked('user-123', 'dp-datacenter', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'locked',
      message: 'District tech-park is locked',
    });
  });

  it('should unlock first building in district (order = 1)', async () => {
    const building: AlgoBuilding = {
      $id: 'building-1',
      slug: 'array-tower',
      districtSlug: 'downtown',
      name: 'Array Tower',
      order: 1,
      totalProblems: 100,
    };

    // Get building
    mockListDocuments.mockResolvedValueOnce({ documents: [building] });
    // Get parent district (downtown, order = 1, always unlocked)
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ slug: 'downtown', order: 1 }],
    });

    const result = await isBuildingUnlocked('user-123', 'array-tower', false);

    expect(result).toEqual({ hasAccess: true, reason: 'unlocked' });
  });
});

// ============================================================================
// isProblemUnlocked
// ============================================================================

describe('isProblemUnlocked', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should grant access to admin', async () => {
    const result = await isProblemUnlocked('user-123', 'two-sum', true);

    expect(result).toEqual({ hasAccess: true, reason: 'admin' });
  });

  it('should return invalid for malformed slug', async () => {
    const result = await isProblemUnlocked('user-123', 'Invalid!', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Invalid problem slug',
    });
  });

  it('should return invalid for non-existent problem', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await isProblemUnlocked('user-123', 'unknown-problem', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Problem not found',
    });
  });

  it('should check parent building access first', async () => {
    const problem: AlgoProblem = {
      $id: 'problem-1',
      slug: 'two-sum',
      buildingSlug: 'array-tower',
      districtSlug: 'downtown',
      order: 1,
      difficulty: 'easy',
    };

    // Get problem
    mockListDocuments.mockResolvedValueOnce({ documents: [problem] });
    // Get building - not found (simulating locked)
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    const result = await isProblemUnlocked('user-123', 'two-sum', false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'locked',
      message: 'Building array-tower is locked',
    });
  });

  it('should unlock first problem in building (order = 1)', async () => {
    const problem: AlgoProblem = {
      $id: 'problem-1',
      slug: 'two-sum',
      buildingSlug: 'array-tower',
      districtSlug: 'downtown',
      order: 1,
      difficulty: 'easy',
    };
    const building: AlgoBuilding = {
      $id: 'building-1',
      slug: 'array-tower',
      districtSlug: 'downtown',
      name: 'Array Tower',
      order: 1,
      totalProblems: 100,
    };
    const district: AlgoDistrict = {
      $id: 'district-1',
      slug: 'downtown',
      name: 'Downtown',
      order: 1,
    };

    // Get problem
    mockListDocuments.mockResolvedValueOnce({ documents: [problem] });
    // Get building
    mockListDocuments.mockResolvedValueOnce({ documents: [building] });
    // Get district (for building check)
    mockListDocuments.mockResolvedValueOnce({ documents: [district] });

    const result = await isProblemUnlocked('user-123', 'two-sum', false);

    expect(result).toEqual({ hasAccess: true, reason: 'unlocked' });
  });
});

// ============================================================================
// getUnlockCost
// ============================================================================

describe('getUnlockCost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return district cost', async () => {
    const cost = await getUnlockCost('district', 'industrial');
    expect(cost).toBe(100);
  });

  it('should return building cost', async () => {
    const cost = await getUnlockCost('building', 'string-plaza');
    expect(cost).toBe(15);
  });

  it('should return problem cost with provided difficulty', async () => {
    const cost = await getUnlockCost('problem', 'two-sum', 'easy');
    expect(cost).toBe(5);
  });

  it('should fetch problem to get difficulty if not provided', async () => {
    const problem: AlgoProblem = {
      $id: 'problem-1',
      slug: 'median-arrays',
      buildingSlug: 'array-tower',
      districtSlug: 'downtown',
      order: 5,
      difficulty: 'hard',
    };
    mockListDocuments.mockResolvedValueOnce({ documents: [problem] });

    const cost = await getUnlockCost('problem', 'median-arrays');
    expect(cost).toBe(30); // hard = 30 gems
  });

  it('should throw for invalid slug', async () => {
    await expect(getUnlockCost('district', 'Invalid!')).rejects.toThrow(
      'Invalid target slug'
    );
  });

  it('should throw for unknown district', async () => {
    await expect(getUnlockCost('district', 'unknown-district')).rejects.toThrow(
      'Unknown district'
    );
  });

  it('should throw for unknown building', async () => {
    await expect(getUnlockCost('building', 'unknown-building')).rejects.toThrow(
      'Unknown building'
    );
  });

  it('should throw for non-existent problem', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });

    await expect(getUnlockCost('problem', 'nonexistent-problem')).rejects.toThrow(
      'Problem not found'
    );
  });

  it('should throw for invalid target type', async () => {
    // @ts-expect-error Testing invalid input
    await expect(getUnlockCost('invalid', 'some-slug')).rejects.toThrow(
      'Invalid target type'
    );
  });
});

// ============================================================================
// Security Edge Cases
// ============================================================================

describe('Security - Input Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should prevent SQL injection via slug', async () => {
    const maliciousSlug = "'; DROP TABLE algo-districts; --";

    const result = await isDistrictUnlocked('user-123', maliciousSlug, false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Invalid district slug',
    });
  });

  it('should prevent path traversal via slug', async () => {
    const maliciousSlug = '../../../etc/passwd';

    const result = await isBuildingUnlocked('user-123', maliciousSlug, false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Invalid building slug',
    });
  });

  it('should prevent XSS via slug', async () => {
    const maliciousSlug = '<script>alert(1)</script>';

    const result = await isProblemUnlocked('user-123', maliciousSlug, false);

    expect(result).toEqual({
      hasAccess: false,
      reason: 'invalid',
      message: 'Invalid problem slug',
    });
  });

  it('should prevent bypass via empty userId', async () => {
    await expect(checkAlgoGemUnlock('', 'district', 'industrial')).rejects.toThrow(
      'Invalid userId'
    );
  });
});

// ============================================================================
// Type Guards
// ============================================================================

describe('AccessResult type', () => {
  it('should have correct reason values', () => {
    const validReasons = ['unlocked', 'gem_unlock', 'progression', 'admin', 'locked', 'invalid'];

    // Type checking - this would fail at compile time if wrong
    const result: AccessResult = {
      hasAccess: true,
      reason: 'unlocked',
    };

    expect(validReasons).toContain(result.reason);
  });
});
