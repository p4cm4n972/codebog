import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createRateLimiter,
  retry,
  createCircuitBreaker,
  createThrottledQueue,
  createBatcher
} from './index.js';

describe('Ex08 - Rate Limiter & Retry Patterns', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createRateLimiter()', () => {
    it('should limit requests per time window', async () => {
      const limiter = createRateLimiter(2, 1000);
      const results = [];
      const fn = async (n) => {
        results.push(n);
        return n;
      };

      limiter(() => fn(1));
      limiter(() => fn(2));
      limiter(() => fn(3));

      await vi.advanceTimersByTimeAsync(0);
      expect(results).toEqual([1, 2]);

      await vi.advanceTimersByTimeAsync(1000);
      expect(results).toEqual([1, 2, 3]);
    });

    it('should return a promise that resolves with the result', async () => {
      const limiter = createRateLimiter(5, 1000);
      const result = await limiter(async () => 'test');
      expect(result).toBe('test');
    });
  });

  describe('retry()', () => {
    it('should return result on first success', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retry(fn, { maxAttempts: 3 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const resultPromise = retry(fn, {
        maxAttempts: 3,
        initialDelay: 100
      });

      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);

      const result = await resultPromise;
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fail'));

      const promise = retry(fn, { maxAttempts: 2, initialDelay: 100 });
      await vi.advanceTimersByTimeAsync(100);

      await expect(promise).rejects.toThrow('always fail');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should call onRetry callback', async () => {
      const onRetry = vi.fn();
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const promise = retry(fn, {
        maxAttempts: 3,
        initialDelay: 100,
        onRetry
      });

      await vi.advanceTimersByTimeAsync(100);
      await promise;

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({
        attempt: 1,
        error: expect.any(Error)
      }));
    });
  });

  describe('createCircuitBreaker()', () => {
    it('should pass through when closed', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const breaker = createCircuitBreaker(fn, { failureThreshold: 3 });

      const result = await breaker();
      expect(result).toBe('result');
    });

    it('should open after failure threshold', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('fail'));
      const breaker = createCircuitBreaker(fn, { failureThreshold: 2 });

      await expect(breaker()).rejects.toThrow('fail');
      await expect(breaker()).rejects.toThrow('fail');

      await expect(breaker()).rejects.toThrow('Circuit breaker is OPEN');
    });

    it('should transition to half-open after timeout', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const breaker = createCircuitBreaker(fn, {
        failureThreshold: 2,
        timeout: 1000
      });

      await expect(breaker()).rejects.toThrow('fail');
      await expect(breaker()).rejects.toThrow('fail');
      await expect(breaker()).rejects.toThrow('Circuit breaker is OPEN');

      await vi.advanceTimersByTimeAsync(1000);

      const result = await breaker();
      expect(result).toBe('success');
    });
  });

  describe('createThrottledQueue()', () => {
    it('should limit concurrent executions', async () => {
      const queue = createThrottledQueue(2);
      let running = 0;
      let maxRunning = 0;

      const task = () => new Promise(resolve => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        setTimeout(() => {
          running--;
          resolve();
        }, 100);
      });

      const promises = [
        queue.add(task),
        queue.add(task),
        queue.add(task),
        queue.add(task)
      ];

      await vi.advanceTimersByTimeAsync(200);
      await Promise.all(promises);

      expect(maxRunning).toBe(2);
    });

    it('should return results in order', async () => {
      const queue = createThrottledQueue(2);

      const results = await queue.addAll([
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3)
      ]);

      expect(results).toEqual([1, 2, 3]);
    });
  });

  describe('createBatcher()', () => {
    it('should batch multiple calls', async () => {
      const batchFn = vi.fn(async (items) => items.map(x => x * 2));
      const batcher = createBatcher(batchFn, { maxWaitMs: 10 });

      const promises = [
        batcher(1),
        batcher(2),
        batcher(3)
      ];

      await vi.advanceTimersByTimeAsync(10);
      const results = await Promise.all(promises);

      expect(batchFn).toHaveBeenCalledTimes(1);
      expect(batchFn).toHaveBeenCalledWith([1, 2, 3]);
      expect(results).toEqual([2, 4, 6]);
    });

    it('should flush when maxBatchSize is reached', async () => {
      const batchFn = vi.fn(async (items) => items);
      const batcher = createBatcher(batchFn, { maxBatchSize: 2, maxWaitMs: 1000 });

      const p1 = batcher(1);
      const p2 = batcher(2);

      await vi.advanceTimersByTimeAsync(0);
      await Promise.all([p1, p2]);

      expect(batchFn).toHaveBeenCalledTimes(1);
      expect(batchFn).toHaveBeenCalledWith([1, 2]);
    });
  });
});
