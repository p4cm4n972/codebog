import { describe, it, expect } from 'vitest';
import { class1, class2, class3 } from './index.js';

describe('Ex05 - Class Sugar', () => {
  describe('class1() - class is a function', () => {
    it('should return ["function", true]', () => {
      expect(class1()).toEqual(['function', true]);
    });
  });

  describe('class2() - extends and prototype chain', () => {
    it('should return ["Rex speaks", true]', () => {
      expect(class2()).toEqual(['Rex speaks', true]);
    });
  });

  describe('class3() - classes are not hoisted', () => {
    it('should return "ReferenceError"', () => {
      expect(class3()).toBe('ReferenceError');
    });
  });
});
