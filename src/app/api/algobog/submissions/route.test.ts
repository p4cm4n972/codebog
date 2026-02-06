import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

// ============================================================================
// MOCKS
// ============================================================================

const mockVerifyUserFromJWT = vi.fn();
const mockIsProblemUnlocked = vi.fn();
const mockExecuteInSandbox = vi.fn();
const mockListDocuments = vi.fn();
const mockCreateDocument = vi.fn();
const mockUpdateDocument = vi.fn();

vi.mock('@/lib/access-control', () => ({
  verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
}));

vi.mock('@/lib/algobog/access-control', () => ({
  isProblemUnlocked: (...args: unknown[]) => mockIsProblemUnlocked(...args),
  ALGO_COLLECTIONS: {
    DISTRICTS: 'algo-districts',
    BUILDINGS: 'algo-buildings',
    PROBLEMS: 'algo-problems',
    SUBMISSIONS: 'algo-submissions',
    PROGRESS: 'algo-progress',
    UNLOCKS: 'algo-unlocks',
  },
}));

vi.mock('@/lib/sandbox', () => ({
  executeInSandbox: (...args: unknown[]) => mockExecuteInSandbox(...args),
}));

vi.mock('@/lib/algobog/gem-config', () => ({
  isValidSlug: (slug: string) => /^[a-z][a-z0-9-]{2,49}$/.test(slug),
}));

vi.mock('node-appwrite', () => ({
  Query: {
    equal: (field: string, value: unknown) => `${field}=${value}`,
    orderDesc: (field: string) => `orderDesc=${field}`,
    limit: (n: number) => `limit=${n}`,
  },
  ID: {
    unique: () => 'unique-id-123',
  },
}));

vi.mock('@/lib/appwrite-admin', () => ({
  getAdminDatabases: () => ({
    listDocuments: mockListDocuments,
    createDocument: mockCreateDocument,
    updateDocument: mockUpdateDocument,
  }),
  toDocument: <T>(doc: T) => doc,
  toDocuments: <T>(docs: T[]) => docs,
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
  const url = new URL('http://localhost:3000/api/algobog/submissions');

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
// GET /api/algobog/submissions TESTS
// ============================================================================

describe('GET /api/algobog/submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Parameter Validation', () => {
    it('should return 400 if problemSlug is missing', async () => {
      const request = createRequest('GET');
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Valid problemSlug is required');
    });

    it('should return 400 for invalid slug format', async () => {
      const request = createRequest('GET', { problemSlug: 'Invalid_Slug!' });
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Valid problemSlug is required');
    });
  });

  describe('Authentication', () => {
    it('should return 401 if no auth header', async () => {
      const request = createRequest('GET', { problemSlug: 'two-sum' });
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 for invalid token', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce(null);

      const request = createRequest('GET', { problemSlug: 'two-sum' }, undefined, 'invalid-token');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid or expired token');
    });
  });

  describe('Successful Retrieval', () => {
    it('should return user submissions', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            $id: 'sub-1',
            submittedAt: '2024-01-01T00:00:00.000Z',
            passed: true,
            executionTime: 50,
          },
          {
            $id: 'sub-2',
            submittedAt: '2024-01-01T01:00:00.000Z',
            passed: false,
            executionTime: 100,
          },
        ],
        total: 2,
      });

      const request = createRequest('GET', { problemSlug: 'two-sum' }, undefined, 'valid-token');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.submissions).toHaveLength(2);
      expect(data.hasPassed).toBe(true);
      expect(data.totalSubmissions).toBe(2);
      expect(data.submissions[0].id).toBe('sub-1');
    });

    it('should return hasPassed=false when no passing submission', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            $id: 'sub-1',
            submittedAt: '2024-01-01T00:00:00.000Z',
            passed: false,
            executionTime: 50,
          },
        ],
        total: 1,
      });

      const request = createRequest('GET', { problemSlug: 'two-sum' }, undefined, 'valid-token');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.hasPassed).toBe(false);
    });

    it('should return empty array when no submissions', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [],
        total: 0,
      });

      const request = createRequest('GET', { problemSlug: 'two-sum' }, undefined, 'valid-token');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.submissions).toHaveLength(0);
      expect(data.hasPassed).toBe(false);
      expect(data.totalSubmissions).toBe(0);
    });
  });
});

// ============================================================================
// POST /api/algobog/submissions TESTS
// ============================================================================

describe('POST /api/algobog/submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 if no auth header', async () => {
      const request = createRequest('POST', undefined, {
        code: 'function twoSum() {}',
        problemSlug: 'two-sum',
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
        { code: 'function twoSum() {}', problemSlug: 'two-sum' },
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

      const url = new URL('http://localhost:3000/api/algobog/submissions');
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

    it('should return 400 if code is missing', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { problemSlug: 'two-sum' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Code is required');
    });

    it('should return 400 for invalid problemSlug', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum() {}', problemSlug: 'Invalid!' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Valid problemSlug is required');
    });
  });

  describe('Access Control', () => {
    it('should return 403 if user does not have access', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: false,
        reason: 'locked',
        message: 'Complete problem 1 first',
      });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum() {}', problemSlug: 'two-sum' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Access denied');
      expect(data.reason).toBe('locked');
      expect(data.message).toBe('Complete problem 1 first');
    });
  });

  describe('Problem Retrieval', () => {
    it('should return 404 if problem not found', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [],
      });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum() {}', problemSlug: 'nonexistent-problem' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Problem not found');
    });

    it('should return 500 if no test code configured', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            slug: 'two-sum',
            buildingSlug: 'array-tower',
            districtSlug: 'downtown',
            // No testCode
          },
        ],
      });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum() {}', problemSlug: 'two-sum' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Test code not configured for this problem');
    });
  });

  describe('Code Execution', () => {
    it('should execute code and return passing result', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      // Get problem
      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            slug: 'two-sum',
            buildingSlug: 'array-tower',
            districtSlug: 'downtown',
            difficulty: 'easy',
            testCode: 'assert(twoSum([2,7,11,15], 9), [0,1])',
          },
        ],
      });
      mockExecuteInSandbox.mockResolvedValueOnce({
        results: {
          passed: true,
          tests: [{ name: 'test1', passed: true }],
        },
      });
      // Check existing submission
      mockListDocuments.mockResolvedValueOnce({ documents: [] });
      // Create submission
      mockCreateDocument.mockResolvedValueOnce({ $id: 'sub-1' });
      // Get problems in building
      mockListDocuments.mockResolvedValueOnce({ documents: [], total: 10 });
      // Get completed problems
      mockListDocuments.mockResolvedValueOnce({ documents: [] });
      // Check progress
      mockListDocuments.mockResolvedValueOnce({ documents: [] });
      // Create progress
      mockCreateDocument.mockResolvedValueOnce({ $id: 'progress-1' });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum(nums, target) { return [0, 1]; }', problemSlug: 'two-sum' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.results.passed).toBe(true);
      expect(data.submission.created).toBe(true);
      expect(data.submission.isFirstCompletion).toBe(true);
    });

    it('should return failing result without creating submission', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            slug: 'two-sum',
            buildingSlug: 'array-tower',
            districtSlug: 'downtown',
            testCode: 'assert(twoSum([2,7,11,15], 9), [0,1])',
          },
        ],
      });
      mockExecuteInSandbox.mockResolvedValueOnce({
        results: {
          passed: false,
          tests: [{ name: 'test1', passed: false, error: 'Expected [0,1] but got [1,0]' }],
        },
      });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum() { return [1, 0]; }', problemSlug: 'two-sum' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.results.passed).toBe(false);
      expect(data.submission.created).toBe(false);
      expect(data.submission.reason).toBe('Tests did not pass');
      expect(mockCreateDocument).not.toHaveBeenCalled();
    });

    it('should detect existing completion (anti-farming)', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });
      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            slug: 'two-sum',
            buildingSlug: 'array-tower',
            districtSlug: 'downtown',
            difficulty: 'easy',
            testCode: 'assert(twoSum([2,7,11,15], 9), [0,1])',
          },
        ],
      });
      mockExecuteInSandbox.mockResolvedValueOnce({
        results: {
          passed: true,
          tests: [{ name: 'test1', passed: true }],
        },
      });
      // Existing passing submission (anti-farming)
      mockListDocuments.mockResolvedValueOnce({
        documents: [{ $id: 'existing-sub', passed: true }],
      });
      // Create submission
      mockCreateDocument.mockResolvedValueOnce({ $id: 'sub-2' });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'function twoSum(nums, target) { return [0, 1]; }', problemSlug: 'two-sum' },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.results.passed).toBe(true);
      expect(data.submission.isFirstCompletion).toBe(false);
    });
  });

  describe('Security', () => {
    it('should use server-side test code (never trust client)', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });
      mockIsProblemUnlocked.mockResolvedValueOnce({
        hasAccess: true,
        reason: 'progression',
      });

      const serverTestCode = 'assert(twoSum([2,7], 9), [0,1])';
      const clientTestCode = 'assert(true, true)'; // Malicious bypass attempt

      mockListDocuments.mockResolvedValueOnce({
        documents: [
          {
            slug: 'two-sum',
            buildingSlug: 'array-tower',
            districtSlug: 'downtown',
            testCode: serverTestCode, // Server has real tests
          },
        ],
      });
      mockExecuteInSandbox.mockResolvedValueOnce({
        results: { passed: false },
      });

      const request = createRequest(
        'POST',
        undefined,
        {
          code: 'function twoSum() { return null; }',
          problemSlug: 'two-sum',
          testCode: clientTestCode, // Client tries to send easy tests
        },
        'valid-token'
      );
      const response = await POST(request);

      // Verify server test code was used, not client's
      expect(mockExecuteInSandbox).toHaveBeenCalledWith(
        expect.any(String),
        serverTestCode // Server-side test code should be used
      );
    });

    it('should prevent SQL injection via problemSlug', async () => {
      mockVerifyUserFromJWT.mockResolvedValueOnce({
        userId: 'user-123',
        unlockAll: false,
      });

      const request = createRequest(
        'POST',
        undefined,
        { code: 'code', problemSlug: "'; DROP TABLE--" },
        'valid-token'
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Valid problemSlug is required');
    });
  });
});
