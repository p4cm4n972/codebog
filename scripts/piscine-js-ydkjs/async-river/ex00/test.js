import { describe, it, expect } from 'vitest';
import { stack1, stack2 } from './index.js';

describe('Ex00 - Call Stack', () => {
  describe('stack1() - basic execution order', () => {
    it('should return ["main start", "first start", "second", "first end", "main end"]', () => {
      expect(stack1()).toEqual(['main start', 'first start', 'second', 'first end', 'main end']);
    });
  });

  describe('stack2() - recursion and call stack', () => {
    it('should return [3, 2, 1, "done 1", "done 2", "done 3"]', () => {
      expect(stack2()).toEqual([3, 2, 1, 'done 1', 'done 2', 'done 3']);
    });
  });
});
