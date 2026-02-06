import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

// ============================================================================
// MOCKS
// ============================================================================

const mockVerifyUserFromJWT = vi.fn();
const mockGetGemBalance = vi.fn();
const mockSpendGems = vi.fn();
const mockIsDistrictUnlocked = vi.fn();
const mockIsBuildingUnlocked = vi.fn();
const mockIsProblemUnlocked = vi.fn();
const mockCheckAlgoGemUnlock = vi.fn();
const mockCreateAlgoGemUnlock = vi.fn();
const mockGetUnlockCost = vi.fn();

vi.mock('@/lib/access-control', () => ({
  verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
}));

vi.mock('@/lib/gems/balance', () => ({
  getGemBalance: (...args: unknown[]) => mockGetGemBalance(...args),
  spendGems: (...args: unknown[]) => mockSpendGems(...args),
}));

vi.mock('@/lib/algobog/access-control', () => ({
  isDistrictUnlocked: (...args: unknown[]) => mockIsDistrictUnlocked(...args),
  isBuildingUnlocked: (...args: unknown[]) => mockIsBuildingUnlocked(...args),
  isProblemUnlocked: (...args: unknown[]) => mockIsProblemUnlocked(...args),
  checkAlgoGemUnlock: (...args: unknown[]) => mockCheckAlgoGemUnlock(...args),
  createAlgoGemUnlock: (...args: unknown[]) => mockCreateAlgoGemUnlock(...args),
  getUnlockCost: (...args: unknown[]) => mockGetUnlockCost(...args),
}));

vi.mock('@/lib/algobog/gem-config', () => ({
  isValidSlug: (slug: string) => /^[a-z][a-z0-9-]{2,49}$/.test(slug),
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

function createRequest(
  method: 'GET' | 'POST',
  params?: Record<string, string>,
  body?: object,
  authToken?: string
): NextRequest {
  const url = new URL('http://localhost:3000/api/algobog/unlock');

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers = new Headers();
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  headers.set('Content-Type', 'application/json');

  return new NextRequest(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ============================================================================
// GET /api/algobog/unlock TESTS
// ============================================================================

describe('GET /api/algobog/unlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Parameter Validation', () => {
    it('should return 400 if targetType is missing', async () => {
      const request = createRequest('GET', { targetSlug: 'downtown' });
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing targetType or targetSlug');
    });

    it('should return 400 if targetSlug is missing', async () => {
      const request = createRequest('GET', { targetType: 'district' });
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing targetType or targetSlug');
    });

    it('should return 400 for invalid targetType', async () => {
      const request = createRequest('GET', {
        targetType: 'invalid',
        targetSlug: 'downtown',
      });
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid targetType. Must be: district, building, or problem');
    });

    it('should return 400 for invalid slug format', async () => {
      const request = createRequest('GET', {
        targetType: 'district',
        targetSlug: 'Invalid_Slug!',
      });
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid targetSlug format');
    });
  });

  describe('Cost Retrieval', () => {
    it('should return 404 if target not found', async () => {
      mockGetUnlockCost.mockRejectedValueOnce(new Error('Unknown district: nonexistent'));

      const request = createRequest('GET', {
        targetType: 'district',
        targetSlug: 'nonexistent',
      });
      const response = await GET(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Unknown district: nonexistent');
    });

    it('should return cost for valid target without auth', async () => {
      mockGetUnlockCost.mockResolvedValueOnce(100);

      const request = createRequest('GET', {
        targetType: 'district',
        targetSlug: 'industrial',
      });
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.targetType).toBe('district');
      expect(data.targetSlug).toBe('industrial');
      expect(data.cost).toBe(100);
      expect(data.isUnlocked).toBe(false);
      expect(data.hasAccess).toBe(false);
      expect(data.userBalance).toBe(0);
    });
  });

  describe('Authenticated Access Check', () => {
    it('should return user status when authenticated', async () => {
      mockGetUnlockCost.mockResolvedValueOnce(100);
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockGetGemBalance.mockResolvedValueOnce({ balance: 50 });

      const request = createRequest(
        'GET',
        { targetType: 'district', targetSlug: 'industrial' },
        undefined,
        'valid-jwt-token'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.isUnlocked).toBe(false);
      expect(data.hasAccess).toBe(false);
      expect(data.userBalance).toBe(50);
      expect(data.canAfford).toBe(false);
      expect(data.needsUnlock).toBe(true);
    });

    it('should show hasAccess=true when user has progression unlock', async () => {
      mockGetUnlockCost.mockResolvedValueOnce(100);
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      mockGetGemBalance.mockResolvedValueOnce({ balance: 200 });

      const request = createRequest(
        'GET',
        { targetType: 'district', targetSlug: 'industrial' },
        undefined,
        'valid-jwt-token'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.hasAccess).toBe(true);
      expect(data.needsUnlock).toBe(false);
    });

    it('should show isUnlocked=true when gem unlock exists', async () => {
      mockGetUnlockCost.mockResolvedValueOnce(100);
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce({
        $id: 'unlock-1',
        targetType: 'district',
        targetSlug: 'industrial',
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'gem_unlock',
      });
      mockGetGemBalance.mockResolvedValueOnce({ balance: 100 });

      const request = createRequest(
        'GET',
        { targetType: 'district', targetSlug: 'industrial' },
        undefined,
        'valid-jwt-token'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.isUnlocked).toBe(true);
      expect(data.hasAccess).toBe(true);
      expect(data.needsUnlock).toBe(false);
    });

    it('should check building access for building targetType', async () => {
      mockGetUnlockCost.mockResolvedValueOnce(50);
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockIsBuildingUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockGetGemBalance.mockResolvedValueOnce({ balance: 100 });

      const request = createRequest(
        'GET',
        { targetType: 'building', targetSlug: 'dp-datacenter' },
        undefined,
        'valid-jwt-token'
      );
      const response = await GET(request);

      expect(mockIsBuildingUnlocked).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should check problem access for problem targetType', async () => {
      mockGetUnlockCost.mockResolvedValueOnce(15);
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      mockGetGemBalance.mockResolvedValueOnce({ balance: 100 });

      const request = createRequest(
        'GET',
        { targetType: 'problem', targetSlug: 'two-sum' },
        undefined,
        'valid-jwt-token'
      );
      const response = await GET(request);

      expect(mockIsProblemUnlocked).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });
});

// ============================================================================
// POST /api/algobog/unlock TESTS
// ============================================================================

describe('POST /api/algobog/unlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 if no auth header', async () => {
      const request = createRequest('POST', undefined, {
        targetType: 'district',
        targetSlug: 'industrial',
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 for invalid token', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce(null);

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'industrial' },
        'invalid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid or expired token');
    });
  });

  describe('Request Validation', () => {
    it('should return 400 for invalid JSON body', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const url = new URL('http://localhost:3000/api/algobog/unlock');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
        body: 'invalid json{',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid JSON body');
    });

    it('should return 400 for invalid targetType', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'invalid', targetSlug: 'industrial' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid targetType. Must be: district, building, or problem');
    });

    it('should return 400 for invalid slug format', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'Invalid!' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid targetSlug format');
    });
  });

  describe('Access Checks', () => {
    it('should return 400 if already has access', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'industrial' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Already have access');
      expect(data.reason).toBe('progression');
    });

    it('should return 400 if already gem-unlocked', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce({
        $id: 'unlock-1',
      });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'industrial' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Already unlocked with gems');
    });
  });

  describe('Cost and Balance', () => {
    it('should return 404 if target not found', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockGetUnlockCost.mockRejectedValueOnce(new Error('Unknown district'));

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'nonexistent' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Unknown district');
    });

    it('should return 400 if content is free', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockGetUnlockCost.mockResolvedValueOnce(0); // Free content

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'downtown' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('This content is free. No gems required.');
    });

    it('should return 402 if insufficient gems', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockGetUnlockCost.mockResolvedValueOnce(100);
      mockGetGemBalance.mockResolvedValueOnce({ balance: 50 });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'industrial' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(402);
      const data = await response.json();
      expect(data.error).toBe('Insufficient gems');
      expect(data.required).toBe(100);
      expect(data.balance).toBe(50);
      expect(data.shortfall).toBe(50);
    });
  });

  describe('Successful Unlock', () => {
    it('should process unlock successfully', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockGetUnlockCost.mockResolvedValueOnce(100);
      mockGetGemBalance.mockResolvedValueOnce({ balance: 200 });
      mockSpendGems.mockResolvedValueOnce({ balance: 100 });
      mockCreateAlgoGemUnlock.mockResolvedValueOnce({
        $id: 'unlock-1',
        unlockedAt: '2024-01-01T00:00:00.000Z',
      });
      mockGetGemBalance.mockResolvedValueOnce({ balance: 100 });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'industrial' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.targetType).toBe('district');
      expect(data.targetSlug).toBe('industrial');
      expect(data.gemsCost).toBe(100);
      expect(data.newBalance).toBe(100);
      expect(mockSpendGems).toHaveBeenCalledWith(
        'user-123',
        100,
        expect.stringContaining('ALGOBOG unlock'),
        'industrial'
      );
    });

    it('should handle spendGems failure gracefully', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsDistrictUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
      });
      mockCheckAlgoGemUnlock.mockResolvedValueOnce(null);
      mockGetUnlockCost.mockResolvedValueOnce(100);
      mockGetGemBalance.mockResolvedValueOnce({ balance: 200 });
      mockSpendGems.mockRejectedValueOnce(new Error('Insufficient balance'));

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: 'industrial' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(402);
      const data = await response.json();
      expect(data.error).toBe('Insufficient gems');
    });
  });

  describe('Security - Anti-bypass', () => {
    it('should prevent SQL injection via slug', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: "'; DROP TABLE--" },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid targetSlug format');
    });

    it('should prevent path traversal via slug', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { targetType: 'district', targetSlug: '../../../etc' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
