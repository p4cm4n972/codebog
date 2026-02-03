import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchAll,
  fetchAllSettled,
  fetchRace,
  fetchAny,
  fetchWithLimit,
  fetchByIds,
  fetchSequential,
  fetchWithPartition,
  fetchAndAggregate
} from './index.js';

describe('Ex22 - Parallel Requests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchAll()', () => {
    it('should fetch all URLs in parallel', async () => {
      global.fetch = vi.fn().mockImplementation(url =>
        Promise.resolve({
          json: () => Promise.resolve({ url })
        })
      );

      const results = await fetchAll(['/api/1', '/api/2', '/api/3']);

      expect(results.length).toBe(3);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should fail if any request fails', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({ json: () => Promise.resolve({}) })
        .mockRejectedValueOnce(new Error('Failed'));

      await expect(fetchAll(['/api/1', '/api/fail'])).rejects.toThrow();
    });
  });

  describe('fetchAllSettled()', () => {
    it('should return all results even with failures', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 1 }) })
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 3 }) });

      const results = await fetchAllSettled(['/api/1', '/api/fail', '/api/3']);

      expect(results.length).toBe(3);
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');
    });
  });

  describe('fetchRace()', () => {
    it('should return first completed result', async () => {
      global.fetch = vi.fn().mockImplementation(url => {
        const delay = url.includes('fast') ? 10 : 100;
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ json: () => Promise.resolve({ url }) });
          }, delay);
        });
      });

      const result = await fetchRace(['/api/slow', '/api/fast']);
      expect(result.url).toBe('/api/fast');
    });
  });

  describe('fetchAny()', () => {
    it('should return first successful result', async () => {
      global.fetch = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockResolvedValueOnce({ json: () => Promise.resolve({ success: true }) });

      const result = await fetchAny(['/api/fail', '/api/success']);
      expect(result.success).toBe(true);
    });
  });

  describe('fetchWithLimit()', () => {
    it('should limit concurrent requests', async () => {
      let concurrent = 0;
      let maxConcurrent = 0;

      global.fetch = vi.fn().mockImplementation(() => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        return new Promise(resolve => {
          setTimeout(() => {
            concurrent--;
            resolve({ json: () => Promise.resolve({}) });
          }, 10);
        });
      });

      const urls = Array(10).fill('/api/data');
      await fetchWithLimit(urls, 3);

      expect(maxConcurrent).toBeLessThanOrEqual(3);
    });
  });

  describe('fetchByIds()', () => {
    it('should fetch resources by IDs', async () => {
      global.fetch = vi.fn().mockImplementation(url => {
        const id = url.split('/').pop();
        return Promise.resolve({
          json: () => Promise.resolve({ id: Number(id) })
        });
      });

      const results = await fetchByIds('/api/users', [1, 2, 3]);

      expect(results.length).toBe(3);
      expect(results[0].id).toBe(1);
      expect(fetch).toHaveBeenCalledWith('/api/users/1');
    });
  });

  describe('fetchSequential()', () => {
    it('should fetch URLs one after another', async () => {
      const order = [];
      global.fetch = vi.fn().mockImplementation(url => {
        order.push(url);
        return Promise.resolve({
          json: () => Promise.resolve({ url })
        });
      });

      await fetchSequential(['/api/1', '/api/2', '/api/3']);

      expect(order).toEqual(['/api/1', '/api/2', '/api/3']);
    });
  });

  describe('fetchWithPartition()', () => {
    it('should separate successes and failures', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 1 }) })
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 3 }) });

      const { successes, failures } = await fetchWithPartition([
        '/api/1', '/api/fail', '/api/3'
      ]);

      expect(successes.length).toBe(2);
      expect(failures.length).toBe(1);
    });
  });

  describe('fetchAndAggregate()', () => {
    it('should aggregate results with keys', async () => {
      global.fetch = vi.fn().mockImplementation(url =>
        Promise.resolve({
          json: () => Promise.resolve({ source: url })
        })
      );

      const result = await fetchAndAggregate({
        users: '/api/users',
        posts: '/api/posts'
      });

      expect(result.users.source).toBe('/api/users');
      expect(result.posts.source).toBe('/api/posts');
    });
  });
});
