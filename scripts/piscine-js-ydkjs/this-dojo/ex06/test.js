import { describe, it, expect } from 'vitest';
import { lost1, lost2, lost3, lost4, lost5 } from './index.js';

describe('Ex06 - Lost this', () => {
  describe('lost1() - method passed as callback', () => {
    it('should return "Hello, undefined" (this is lost)', () => {
      expect(lost1()).toBe('Hello, undefined');
    });
  });

  describe('lost2() - fix with bind', () => {
    it('should return "Hello, obj" (bind preserves this)', () => {
      expect(lost2()).toBe('Hello, obj');
    });
  });

  describe('lost3() - fix with arrow wrapper', () => {
    it('should return "Hello, obj" (arrow preserves context)', () => {
      expect(lost3()).toBe('Hello, obj');
    });
  });

  describe('lost4() - setTimeout loses this', () => {
    it('should return "Hello, undefined" (callback loses this)', () => {
      expect(lost4()).toBe('Hello, undefined');
    });
  });

  describe('lost5() - fix setTimeout with arrow', () => {
    it('should return "Hello, obj" (arrow captures enclosing this)', () => {
      expect(lost5()).toBe('Hello, obj');
    });
  });
});
