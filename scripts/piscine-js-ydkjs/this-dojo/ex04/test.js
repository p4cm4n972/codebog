import { describe, it, expect } from 'vitest';
import { arrow1, arrow2, arrow3, arrow4 } from './index.js';

describe('Ex04 - Arrow Functions', () => {
  describe('arrow1() - arrow vs regular method', () => {
    it('should return ["obj", undefined] (arrow has no own this)', () => {
      expect(arrow1()).toEqual(['obj', undefined]);
    });
  });

  describe('arrow2() - arrow captures enclosing this', () => {
    it('should return "Hello, obj"', () => {
      expect(arrow2()).toBe('Hello, obj');
    });
  });

  describe('arrow3() - call does not affect arrow', () => {
    it('should return "Hello, obj" (call cannot override arrow this)', () => {
      expect(arrow3()).toBe('Hello, obj');
    });
  });

  describe('arrow4() - arrow in nested object', () => {
    it('should return "nested" (arrow captures nested.getArrow this)', () => {
      expect(arrow4()).toBe('nested');
    });
  });
});
