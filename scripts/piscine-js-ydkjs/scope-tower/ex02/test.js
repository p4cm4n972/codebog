import { describe, it, expect } from 'vitest';
import { tdz1, tdz2, tdz3, tdz4, tdz5 } from './index.js';

describe('Ex02 - TDZ (Temporal Dead Zone)', () => {
  describe('tdz1() - Assignment before let declaration', () => {
    it('should return "ReferenceError"', () => {
      expect(tdz1()).toBe('ReferenceError');
    });
  });

  describe('tdz2() - Self-reference in const', () => {
    it('should return "ReferenceError"', () => {
      expect(tdz2()).toBe('ReferenceError');
    });
  });

  describe('tdz3() - TDZ in inner block shadows outer', () => {
    it('should return "ReferenceError"', () => {
      expect(tdz3()).toBe('ReferenceError');
    });
  });

  describe('tdz4() - typeof on undeclared variable', () => {
    it('should return "undefined" (typeof is safe on undeclared)', () => {
      expect(tdz4()).toBe('undefined');
    });
  });

  describe('tdz5() - typeof does NOT protect from TDZ', () => {
    it('should return "ReferenceError"', () => {
      expect(tdz5()).toBe('ReferenceError');
    });
  });
});
