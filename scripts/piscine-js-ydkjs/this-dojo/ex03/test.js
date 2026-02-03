import { describe, it, expect } from 'vitest';
import { new1, new2, new3, new4 } from './index.js';

describe('Ex03 - new Binding', () => {
  describe('new1() - basic constructor', () => {
    it('should return "Alice"', () => {
      expect(new1()).toBe('Alice');
    });
  });

  describe('new2() - return object overrides', () => {
    it('should return "Overridden"', () => {
      expect(new2()).toBe('Overridden');
    });
  });

  describe('new3() - return primitive ignored', () => {
    it('should return "Alice" (primitive return ignored)', () => {
      expect(new3()).toBe('Alice');
    });
  });

  describe('new4() - prototype method', () => {
    it('should return "Hello, Bob"', () => {
      expect(new4()).toBe('Hello, Bob');
    });
  });
});
