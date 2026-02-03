import { describe, it, expect } from 'vitest';
import {
  updateProperty,
  updateImmutable,
  mergeObjects,
  isSameReference,
  shallowClone,
  deepClone,
  applyUpdates
} from './index.js';

describe('Ex06 - Object Update', () => {
  describe('updateProperty()', () => {
    it('should mutate the object', () => {
      const obj = { a: 1 };
      const result = updateProperty(obj, 'a', 2);
      expect(obj.a).toBe(2);
      expect(result).toBe(obj);
    });

    it('should add new property', () => {
      const obj = { a: 1 };
      updateProperty(obj, 'b', 2);
      expect(obj.b).toBe(2);
    });
  });

  describe('updateImmutable()', () => {
    it('should not mutate original', () => {
      const obj = { a: 1, b: 2 };
      const result = updateImmutable(obj, 'a', 10);

      expect(obj.a).toBe(1);
      expect(result.a).toBe(10);
      expect(result.b).toBe(2);
      expect(result).not.toBe(obj);
    });
  });

  describe('mergeObjects()', () => {
    it('should merge without mutation', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = mergeObjects(target, source);

      expect(result).toEqual({ a: 1, b: 2 });
      expect(target).toEqual({ a: 1 });
    });

    it('should merge multiple sources', () => {
      const result = mergeObjects({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('isSameReference()', () => {
    it('should return true for same reference', () => {
      const obj = { a: 1 };
      const ref = obj;
      expect(isSameReference(obj, ref)).toBe(true);
    });

    it('should return false for different objects', () => {
      const a = { value: 1 };
      const b = { value: 1 };
      expect(isSameReference(a, b)).toBe(false);
    });
  });

  describe('shallowClone()', () => {
    it('should create new object', () => {
      const obj = { a: 1 };
      const clone = shallowClone(obj);

      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });

    it('should share nested references', () => {
      const obj = { nested: { value: 1 } };
      const clone = shallowClone(obj);

      expect(clone.nested).toBe(obj.nested);
    });
  });

  describe('deepClone()', () => {
    it('should clone nested objects', () => {
      const obj = { nested: { value: 1 } };
      const clone = deepClone(obj);

      expect(clone).toEqual(obj);
      expect(clone.nested).not.toBe(obj.nested);
    });

    it('should not affect original when modified', () => {
      const obj = { nested: { value: 1 } };
      const clone = deepClone(obj);

      clone.nested.value = 999;
      expect(obj.nested.value).toBe(1);
    });
  });

  describe('applyUpdates()', () => {
    it('should apply updates immutably', () => {
      const obj = { a: 1, b: 2 };
      const result = applyUpdates(obj, { b: 20, c: 30 });

      expect(result).toEqual({ a: 1, b: 20, c: 30 });
      expect(obj).toEqual({ a: 1, b: 2 });
    });
  });
});
