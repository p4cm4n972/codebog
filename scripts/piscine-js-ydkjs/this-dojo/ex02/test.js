import { describe, it, expect } from 'vitest';
import { explicit1, explicit2, explicit3, explicit4 } from './index.js';

describe('Ex02 - Explicit Binding', () => {
  describe('explicit1() - call', () => {
    it('should return "Hello, Alice"', () => {
      expect(explicit1()).toBe('Hello, Alice');
    });
  });

  describe('explicit2() - apply', () => {
    it('should return "Hi, Bob!"', () => {
      expect(explicit2()).toBe('Hi, Bob!');
    });
  });

  describe('explicit3() - bind wins over call', () => {
    it('should return "Hello, Charlie" (bind cannot be overridden)', () => {
      expect(explicit3()).toBe('Hello, Charlie');
    });
  });

  describe('explicit4() - bind cannot be re-bound', () => {
    it('should return "Hello, bound" (first bind wins)', () => {
      expect(explicit4()).toBe('Hello, bound');
    });
  });
});
