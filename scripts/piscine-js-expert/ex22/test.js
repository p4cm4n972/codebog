import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  measurePerformance,
  memoize,
  memoizeLRU,
  memoizeTTL,
  debounce,
  throttle,
  batchProcess,
  createObjectPool,
  lazy
} from './index.js';

describe('Ex22 - Performance & Optimization', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('measurePerformance()', () => {
    it('should return performance stats', () => {
      vi.useRealTimers();

      const stats = measurePerformance(() => {
        let sum = 0;
        for (let i = 0; i < 100; i++) sum += i;
        return sum;
      }, 100);

      expect(stats).toHaveProperty('iterations');
      expect(stats).toHaveProperty('mean');
      expect(stats).toHaveProperty('median');
      expect(stats).toHaveProperty('min');
      expect(stats).toHaveProperty('max');
      expect(stats.iterations).toBe(100);
    });
  });

  describe('memoize()', () => {
    it('should cache results', () => {
      let callCount = 0;
      const fn = memoize((n) => {
        callCount++;
        return n * 2;
      });

      expect(fn(5)).toBe(10);
      expect(fn(5)).toBe(10);
      expect(callCount).toBe(1);
    });

    it('should handle multiple arguments', () => {
      const fn = memoize((a, b) => a + b);
      expect(fn(1, 2)).toBe(3);
      expect(fn(1, 2)).toBe(3);
      expect(fn(2, 1)).toBe(3);
    });
  });

  describe('memoizeLRU()', () => {
    it('should evict least recently used', () => {
      let callCount = 0;
      const fn = memoizeLRU((n) => {
        callCount++;
        return n * 2;
      }, 2);

      fn(1);
      fn(2);
      fn(3);
      fn(1);

      expect(callCount).toBe(4);
    });

    it('should keep recently used', () => {
      let callCount = 0;
      const fn = memoizeLRU((n) => {
        callCount++;
        return n;
      }, 2);

      fn(1);
      fn(2);
      fn(1);
      fn(3);
      fn(1);

      expect(callCount).toBeLessThan(5);
    });
  });

  describe('memoizeTTL()', () => {
    it('should expire after TTL', async () => {
      let callCount = 0;
      const fn = memoizeTTL((n) => {
        callCount++;
        return n;
      }, 1000);

      expect(fn(1)).toBe(1);
      expect(fn(1)).toBe(1);
      expect(callCount).toBe(1);

      vi.advanceTimersByTime(1001);

      expect(fn(1)).toBe(1);
      expect(callCount).toBe(2);
    });
  });

  describe('debounce()', () => {
    it('should delay execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset on subsequent calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle()', () => {
    it('should execute immediately', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should limit frequency', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('batchProcess()', () => {
    it('should process in batches', async () => {
      vi.useRealTimers();

      const items = [1, 2, 3, 4, 5];
      const results = await batchProcess(items, 2, (x) => x * 2);

      expect(results).toEqual([2, 4, 6, 8, 10]);
    });

    it('should yield to main thread', async () => {
      vi.useRealTimers();

      let yielded = false;
      const originalSetTimeout = setTimeout;
      global.setTimeout = (fn, delay) => {
        if (delay === 0) yielded = true;
        return originalSetTimeout(fn, delay);
      };

      await batchProcess([1, 2, 3, 4], 2, (x) => x);

      global.setTimeout = originalSetTimeout;
      expect(yielded).toBe(true);
    });
  });

  describe('createObjectPool()', () => {
    it('should reuse objects', () => {
      const factory = vi.fn(() => ({ value: 0 }));
      const pool = createObjectPool(factory, 2);

      const obj1 = pool.acquire();
      pool.release(obj1);
      const obj2 = pool.acquire();

      expect(obj1).toBe(obj2);
    });

    it('should pre-populate pool', () => {
      const factory = vi.fn(() => ({}));
      createObjectPool(factory, 5);

      expect(factory).toHaveBeenCalledTimes(5);
    });

    it('should track stats', () => {
      const pool = createObjectPool(() => ({}), 3);

      pool.acquire();
      pool.acquire();

      const stats = pool.stats;
      expect(stats.active).toBe(2);
      expect(stats.available).toBe(1);
    });

    it('should throw when exhausted', () => {
      const pool = createObjectPool(() => ({}), 1, 1);

      pool.acquire();
      expect(() => pool.acquire()).toThrow();
    });
  });

  describe('lazy()', () => {
    it('should not evaluate until accessed', () => {
      const fn = vi.fn(() => 'computed');
      const lazyValue = lazy(fn);

      expect(fn).not.toHaveBeenCalled();

      expect(lazyValue.value).toBe('computed');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should cache the value', () => {
      const fn = vi.fn(() => Math.random());
      const lazyValue = lazy(fn);

      const first = lazyValue.value;
      const second = lazyValue.value;

      expect(first).toBe(second);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
