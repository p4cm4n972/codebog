import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  logged,
  timed,
  memoized,
  retry,
  validate,
  deprecated,
  throttled,
  autobind,
  compose,
  singleton
} from './index.js';

describe('Ex21 - Decorators', () => {
  describe('logged()', () => {
    it('should log function calls', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const add = logged((a, b) => a + b, 'add');

      const result = add(2, 3);

      expect(result).toBe(5);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should log arguments and result', () => {
      const logs = [];
      vi.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')));

      const fn = logged((x) => x * 2, 'double');
      fn(5);

      expect(logs.some(l => l.includes('5'))).toBe(true);
      expect(logs.some(l => l.includes('10'))).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe('timed()', () => {
    it('should measure execution time', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const slowFn = timed(() => {
        let sum = 0;
        for (let i = 0; i < 10000; i++) sum += i;
        return sum;
      });

      slowFn();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\d+(\.\d+)?ms/)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('memoized()', () => {
    it('should cache results', () => {
      let callCount = 0;
      const expensive = memoized((n) => {
        callCount++;
        return n * 2;
      });

      expect(expensive(5)).toBe(10);
      expect(expensive(5)).toBe(10);
      expect(expensive(5)).toBe(10);

      expect(callCount).toBe(1);
    });

    it('should cache different arguments', () => {
      let callCount = 0;
      const fn = memoized((n) => {
        callCount++;
        return n;
      });

      fn(1);
      fn(2);
      fn(1);
      fn(2);

      expect(callCount).toBe(2);
    });
  });

  describe('retry()', () => {
    it('should retry on failure', () => {
      let attempts = 0;
      const flaky = retry(3)(() => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'success';
      });

      expect(flaky()).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw after max attempts', () => {
      const alwaysFails = retry(2)(() => {
        throw new Error('always fails');
      });

      expect(() => alwaysFails()).toThrow('always fails');
    });
  });

  describe('validate()', () => {
    it('should validate arguments', () => {
      const isNumber = (x) => typeof x === 'number';
      const isPositive = (x) => x > 0;

      const divide = validate(isNumber, isNumber)((a, b) => a / b);

      expect(divide(10, 2)).toBe(5);
      expect(() => divide('10', 2)).toThrow();
    });

    it('should use custom validators', () => {
      const isEmail = (x) => /^[^\s@]+@[^\s@]+$/.test(x);
      const sendEmail = validate(isEmail)((email) => `Sent to ${email}`);

      expect(sendEmail('test@example.com')).toBe('Sent to test@example.com');
      expect(() => sendEmail('invalid')).toThrow();
    });
  });

  describe('deprecated()', () => {
    it('should log deprecation warning', () => {
      const warnSpy = vi.spyOn(console, 'warn');

      const oldMethod = deprecated('Use newMethod instead')(() => 'old');
      oldMethod();

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
      );

      warnSpy.mockRestore();
    });

    it('should still execute function', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const oldMethod = deprecated('deprecated')((x) => x * 2);
      expect(oldMethod(5)).toBe(10);

      vi.restoreAllMocks();
    });
  });

  describe('throttled()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should limit call frequency', () => {
      let count = 0;
      const fn = throttled(100)(() => count++);

      fn();
      fn();
      fn();

      expect(count).toBe(1);

      vi.advanceTimersByTime(100);
      fn();

      expect(count).toBe(2);
    });
  });

  describe('autobind()', () => {
    it('should bind this context', () => {
      const obj = {
        value: 42,
        getValue: autobind(function() {
          return this.value;
        }, { value: 42 })
      };

      const getValue = obj.getValue;
      expect(getValue()).toBe(42);
    });
  });

  describe('compose()', () => {
    it('should apply decorators right to left', () => {
      const logs = [];
      const dec1 = (fn) => (...args) => { logs.push('dec1'); return fn(...args); };
      const dec2 = (fn) => (...args) => { logs.push('dec2'); return fn(...args); };

      const fn = compose((x) => x, dec1, dec2);
      fn(1);

      expect(logs).toEqual(['dec1', 'dec2']);
    });
  });

  describe('singleton()', () => {
    it('should return same instance', () => {
      const SingleClass = singleton(class {
        constructor(value) {
          this.value = value;
        }
      });

      const a = new SingleClass(1);
      const b = new SingleClass(2);

      expect(a).toBe(b);
      expect(a.value).toBe(1);
    });
  });
});
