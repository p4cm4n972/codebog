import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { once, after, debounce, throttle, partial } from './index.js';

describe('Ex11 - Advanced Closures', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('once()', () => {
    it('should call function only once', () => {
      const fn = vi.fn(() => 'result');
      const onceFn = once(fn);

      expect(onceFn()).toBe('result');
      expect(onceFn()).toBe('result');
      expect(onceFn()).toBe('result');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should preserve arguments and this', () => {
      const fn = vi.fn(function(a, b) {
        return a + b + this.value;
      });
      const onceFn = once(fn);
      const obj = { value: 10, method: onceFn };

      expect(obj.method(1, 2)).toBe(13);
      expect(fn).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('after()', () => {
    it('should only call function after n calls', () => {
      const fn = vi.fn(() => 'done');
      const afterFn = after(3, fn);

      expect(afterFn()).toBeUndefined();
      expect(afterFn()).toBeUndefined();
      expect(afterFn()).toBe('done');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should continue calling after threshold', () => {
      const fn = vi.fn(() => 'done');
      const afterFn = after(2, fn);

      afterFn();
      afterFn();
      afterFn();
      afterFn();

      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('debounce()', () => {
    it('should delay execution', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('a');
      vi.advanceTimersByTime(50);
      debouncedFn('b');
      vi.advanceTimersByTime(50);
      debouncedFn('c');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('c');
    });
  });

  describe('throttle()', () => {
    it('should execute immediately on first call', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn('first');
      expect(fn).toHaveBeenCalledWith('first');
    });

    it('should limit execution frequency', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn('1');
      throttledFn('2');
      throttledFn('3');

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttledFn('4');

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('partial()', () => {
    it('should partially apply arguments', () => {
      const add = (a, b, c) => a + b + c;
      const add5 = partial(add, 5);

      expect(add5(2, 3)).toBe(10);
    });

    it('should work with multiple partial args', () => {
      const greet = (greeting, name, punctuation) =>
        `${greeting}, ${name}${punctuation}`;
      const greetHello = partial(greet, 'Hello', 'Alice');

      expect(greetHello('!')).toBe('Hello, Alice!');
    });

    it('should preserve this context', () => {
      const obj = {
        value: 10,
        add: function(a, b) {
          return this.value + a + b;
        }
      };

      const addTo10 = partial(obj.add.bind(obj), 5);
      expect(addTo10(3)).toBe(18);
    });
  });
});
