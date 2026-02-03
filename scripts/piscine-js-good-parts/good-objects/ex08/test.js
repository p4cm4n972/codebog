import { describe, it, expect } from 'vitest';
import {
  getOwnKeys,
  getOwnValues,
  countByType,
  filterByType,
  isEnumerable,
  addHiddenProperty,
  getPropertyDescriptor,
  hasSameStructure
} from './index.js';

describe('Ex08 - Reflection', () => {
  describe('getOwnKeys()', () => {
    it('should return own keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(getOwnKeys(obj).sort()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('getOwnValues()', () => {
    it('should return own values', () => {
      const obj = { a: 1, b: 2 };
      expect(getOwnValues(obj).sort()).toEqual([1, 2]);
    });
  });

  describe('countByType()', () => {
    it('should count properties by type', () => {
      const obj = {
        name: 'Alice',
        age: 30,
        active: true,
        city: 'Paris'
      };
      const counts = countByType(obj);

      expect(counts.string).toBe(2);
      expect(counts.number).toBe(1);
      expect(counts.boolean).toBe(1);
    });
  });

  describe('filterByType()', () => {
    it('should keep only specified type', () => {
      const obj = { a: 1, b: 'hello', c: 2, d: 'world' };
      expect(filterByType(obj, 'string')).toEqual({ b: 'hello', d: 'world' });
      expect(filterByType(obj, 'number')).toEqual({ a: 1, c: 2 });
    });
  });

  describe('isEnumerable()', () => {
    it('should return true for normal properties', () => {
      const obj = { name: 'Alice' };
      expect(isEnumerable(obj, 'name')).toBe(true);
    });

    it('should return false for non-enumerable', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false
      });
      expect(isEnumerable(obj, 'hidden')).toBe(false);
    });
  });

  describe('addHiddenProperty()', () => {
    it('should add non-enumerable property', () => {
      const obj = { visible: 1 };
      addHiddenProperty(obj, 'hidden', 'secret');

      expect(obj.hidden).toBe('secret');
      expect(Object.keys(obj)).toEqual(['visible']);
    });
  });

  describe('getPropertyDescriptor()', () => {
    it('should return property descriptor', () => {
      const obj = { name: 'Alice' };
      const desc = getPropertyDescriptor(obj, 'name');

      expect(desc.value).toBe('Alice');
      expect(desc.writable).toBe(true);
      expect(desc.enumerable).toBe(true);
      expect(desc.configurable).toBe(true);
    });
  });

  describe('hasSameStructure()', () => {
    it('should return true for same keys', () => {
      const a = { x: 1, y: 2 };
      const b = { x: 'a', y: 'b' };
      expect(hasSameStructure(a, b)).toBe(true);
    });

    it('should return false for different keys', () => {
      const a = { x: 1, y: 2 };
      const b = { x: 1, z: 2 };
      expect(hasSameStructure(a, b)).toBe(false);
    });
  });
});
