import { describe, it, expect, vi } from 'vitest';
import {
  forEachProperty,
  mapValues,
  filterProperties,
  reduceObject,
  invert,
  groupBy,
  findProperty
} from './index.js';

describe('Ex09 - Enumeration', () => {
  describe('forEachProperty()', () => {
    it('should call callback for each property', () => {
      const obj = { a: 1, b: 2 };
      const callback = vi.fn();

      forEachProperty(obj, callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('a', 1);
      expect(callback).toHaveBeenCalledWith('b', 2);
    });
  });

  describe('mapValues()', () => {
    it('should transform values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, x => x * 2);

      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should pass key to transform', () => {
      const obj = { x: 1, y: 2 };
      const result = mapValues(obj, (v, k) => `${k}:${v}`);

      expect(result).toEqual({ x: 'x:1', y: 'y:2' });
    });
  });

  describe('filterProperties()', () => {
    it('should filter by value', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = filterProperties(obj, v => v > 2);

      expect(result).toEqual({ c: 3, d: 4 });
    });

    it('should filter by key', () => {
      const obj = { name: 'Alice', age: 30, city: 'Paris' };
      const result = filterProperties(obj, (_, k) => k.length <= 4);

      expect(result).toEqual({ name: 'Alice', age: 30, city: 'Paris' });
    });
  });

  describe('reduceObject()', () => {
    it('should reduce to sum', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const sum = reduceObject(obj, (acc, v) => acc + v, 0);

      expect(sum).toBe(6);
    });

    it('should build string', () => {
      const obj = { x: 1, y: 2 };
      const result = reduceObject(obj, (acc, v, k) => acc + `${k}=${v};`, '');

      expect(result).toContain('x=1');
      expect(result).toContain('y=2');
    });
  });

  describe('invert()', () => {
    it('should swap keys and values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(invert(obj)).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
    });

    it('should work with string values', () => {
      const obj = { name: 'alice', role: 'admin' };
      expect(invert(obj)).toEqual({ alice: 'name', admin: 'role' });
    });
  });

  describe('groupBy()', () => {
    it('should group by function result', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = groupBy(obj, v => v % 2 === 0 ? 'even' : 'odd');

      expect(result.even).toEqual({ b: 2, d: 4 });
      expect(result.odd).toEqual({ a: 1, c: 3 });
    });
  });

  describe('findProperty()', () => {
    it('should find first matching property', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = findProperty(obj, v => v > 1);

      expect(result).toBeDefined();
      expect(['b', 'c']).toContain(result[0]);
      expect(result[1]).toBeGreaterThan(1);
    });

    it('should return undefined if not found', () => {
      const obj = { a: 1, b: 2 };
      expect(findProperty(obj, v => v > 10)).toBeUndefined();
    });
  });
});
