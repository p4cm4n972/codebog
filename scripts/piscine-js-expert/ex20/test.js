import { describe, it, expect, vi } from 'vitest';
import {
  range,
  fibonacci,
  take,
  filter,
  map,
  zip,
  flatten,
  paginate,
  createRangeIterable,
  accumulator
} from './index.js';

describe('Ex20 - Generators & Iterators', () => {
  describe('range()', () => {
    it('should generate numbers from 1 to n', () => {
      expect([...range(5)]).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with 0', () => {
      expect([...range(0)]).toEqual([]);
    });
  });

  describe('fibonacci()', () => {
    it('should generate Fibonacci sequence', () => {
      const fib = fibonacci();
      expect(fib.next().value).toBe(0);
      expect(fib.next().value).toBe(1);
      expect(fib.next().value).toBe(1);
      expect(fib.next().value).toBe(2);
      expect(fib.next().value).toBe(3);
      expect(fib.next().value).toBe(5);
    });

    it('should be infinite', () => {
      const fib = fibonacci();
      for (let i = 0; i < 100; i++) fib.next();
      expect(fib.next().done).toBe(false);
    });
  });

  describe('take()', () => {
    it('should take first n elements', () => {
      expect([...take(3, [1, 2, 3, 4, 5])]).toEqual([1, 2, 3]);
    });

    it('should work with generators', () => {
      expect([...take(5, fibonacci())]).toEqual([0, 1, 1, 2, 3]);
    });

    it('should handle fewer elements', () => {
      expect([...take(10, [1, 2])]).toEqual([1, 2]);
    });
  });

  describe('filter()', () => {
    it('should filter elements', () => {
      const evens = [...filter([1, 2, 3, 4, 5], x => x % 2 === 0)];
      expect(evens).toEqual([2, 4]);
    });

    it('should work with generators', () => {
      const evenFibs = [...take(5, filter(fibonacci(), x => x % 2 === 0))];
      expect(evenFibs).toEqual([0, 2, 8, 34, 144]);
    });
  });

  describe('map()', () => {
    it('should transform elements', () => {
      const doubled = [...map([1, 2, 3], x => x * 2)];
      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should work lazily with generators', () => {
      const mapped = [...take(3, map(fibonacci(), x => x * 10))];
      expect(mapped).toEqual([0, 10, 10]);
    });
  });

  describe('zip()', () => {
    it('should zip arrays together', () => {
      const zipped = [...zip([1, 2, 3], ['a', 'b', 'c'])];
      expect(zipped).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
    });

    it('should stop at shortest', () => {
      const zipped = [...zip([1, 2], ['a', 'b', 'c', 'd'])];
      expect(zipped).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('should handle multiple iterables', () => {
      const zipped = [...zip([1, 2], ['a', 'b'], [true, false])];
      expect(zipped).toEqual([[1, 'a', true], [2, 'b', false]]);
    });
  });

  describe('flatten()', () => {
    it('should flatten one level by default', () => {
      const flat = [...flatten([[1, 2], [3, 4]])];
      expect(flat).toEqual([1, 2, 3, 4]);
    });

    it('should flatten to specified depth', () => {
      const flat = [...flatten([[[1, 2]], [[3, 4]]], 2)];
      expect(flat).toEqual([1, 2, 3, 4]);
    });

    it('should leave non-arrays', () => {
      const flat = [...flatten([1, [2, 3], 4])];
      expect(flat).toEqual([1, 2, 3, 4]);
    });
  });

  describe('paginate()', () => {
    it('should paginate through pages', async () => {
      let page = 0;
      const fetchPage = vi.fn(() => {
        page++;
        if (page > 2) return { items: [], hasMore: false };
        return { items: [page * 10, page * 10 + 1], hasMore: true };
      });

      const items = [];
      for await (const item of paginate(fetchPage)) {
        items.push(item);
      }

      expect(items).toEqual([10, 11, 20, 21]);
      expect(fetchPage).toHaveBeenCalledTimes(3);
    });
  });

  describe('createRangeIterable()', () => {
    it('should create iterable range', () => {
      const range = createRangeIterable(1, 5);
      expect([...range]).toEqual([1, 2, 3, 4, 5]);
    });

    it('should respect step', () => {
      const range = createRangeIterable(0, 10, 2);
      expect([...range]).toEqual([0, 2, 4, 6, 8, 10]);
    });

    it('should be reusable', () => {
      const range = createRangeIterable(1, 3);
      expect([...range]).toEqual([1, 2, 3]);
      expect([...range]).toEqual([1, 2, 3]);
    });
  });

  describe('accumulator()', () => {
    it('should accumulate values', () => {
      const acc = accumulator();

      acc.next();
      expect(acc.next(10).value).toBe(10);
      expect(acc.next(5).value).toBe(15);
      expect(acc.next(3).value).toBe(18);
    });

    it('should return total on return', () => {
      const acc = accumulator();
      acc.next();
      acc.next(10);
      acc.next(20);
      expect(acc.return().value).toBe(30);
    });
  });
});
