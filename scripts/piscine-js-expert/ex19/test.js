import { describe, it, expect } from 'vitest';
import {
  createPrivateKey,
  createWithSymbol,
  getSymbols,
  getGlobalSymbol,
  getSymbolKey,
  makeIterable,
  createTaggedObject,
  createCustomInstanceCheck,
  createConvertible,
  createCustomSplitter
} from './index.js';

describe('Ex19 - Symbols', () => {
  describe('createPrivateKey()', () => {
    it('should create unique symbols', () => {
      const key1 = createPrivateKey('secret');
      const key2 = createPrivateKey('secret');
      expect(key1).not.toBe(key2);
      expect(typeof key1).toBe('symbol');
    });

    it('should have description', () => {
      const key = createPrivateKey('test');
      expect(key.description).toBe('test');
    });
  });

  describe('createWithSymbol()', () => {
    it('should create object with symbol property', () => {
      const key = Symbol('private');
      const obj = createWithSymbol(key, 'secret value');
      expect(obj[key]).toBe('secret value');
    });

    it('should not be enumerable with for...in', () => {
      const key = Symbol('hidden');
      const obj = createWithSymbol(key, 'value');
      const keys = [];
      for (const k in obj) keys.push(k);
      expect(keys).not.toContain(key);
    });
  });

  describe('getSymbols()', () => {
    it('should return all symbol keys', () => {
      const sym1 = Symbol('a');
      const sym2 = Symbol('b');
      const obj = { [sym1]: 1, [sym2]: 2, regular: 3 };

      const symbols = getSymbols(obj);
      expect(symbols).toContain(sym1);
      expect(symbols).toContain(sym2);
      expect(symbols.length).toBe(2);
    });
  });

  describe('getGlobalSymbol() & getSymbolKey()', () => {
    it('should return same symbol for same key', () => {
      const sym1 = getGlobalSymbol('app.config');
      const sym2 = getGlobalSymbol('app.config');
      expect(sym1).toBe(sym2);
    });

    it('should retrieve key from global symbol', () => {
      const sym = getGlobalSymbol('my.key');
      expect(getSymbolKey(sym)).toBe('my.key');
    });

    it('should return undefined for local symbol', () => {
      const local = Symbol('local');
      expect(getSymbolKey(local)).toBeUndefined();
    });
  });

  describe('makeIterable()', () => {
    it('should make object iterable with spread', () => {
      const obj = makeIterable({ a: 1, b: 2, c: 3 });
      expect([...obj]).toEqual([1, 2, 3]);
    });

    it('should work with for...of', () => {
      const obj = makeIterable({ x: 10, y: 20 });
      const values = [];
      for (const v of obj) values.push(v);
      expect(values).toEqual([10, 20]);
    });
  });

  describe('createTaggedObject()', () => {
    it('should have custom toStringTag', () => {
      const obj = createTaggedObject('MyCustomType');
      expect(Object.prototype.toString.call(obj)).toBe('[object MyCustomType]');
    });
  });

  describe('createCustomInstanceCheck()', () => {
    it('should return true for matching objects', () => {
      const Custom = createCustomInstanceCheck();
      const obj = { isCustom: true };
      expect(obj instanceof Custom).toBe(true);
    });

    it('should return false for non-matching objects', () => {
      const Custom = createCustomInstanceCheck();
      const obj = { isCustom: false };
      expect(obj instanceof Custom).toBe(false);
    });
  });

  describe('createConvertible()', () => {
    it('should convert to number', () => {
      const obj = createConvertible(42, 'forty-two');
      expect(+obj).toBe(42);
      expect(obj * 2).toBe(84);
    });

    it('should convert to string', () => {
      const obj = createConvertible(42, 'forty-two');
      expect(`${obj}`).toBe('forty-two');
    });

    it('should have default conversion', () => {
      const obj = createConvertible(42, 'forty-two');
      expect(obj + '').toBe('forty-two');
    });
  });

  describe('createCustomSplitter()', () => {
    it('should implement custom split', () => {
      const splitter = createCustomSplitter('|');
      const result = 'a|b|c'.split(splitter);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should work with different delimiters', () => {
      const splitter = createCustomSplitter('::');
      const result = 'one::two::three'.split(splitter);
      expect(result).toEqual(['one', 'two', 'three']);
    });
  });
});
