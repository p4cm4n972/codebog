import { describe, it, expect } from 'vitest';
import { loop1, loop2, loop3 } from './index.js';

describe('Ex01 - Event Loop Basics', () => {
  describe('loop1() - setTimeout(fn, 0)', () => {
    it('should return ["1", "3", "2"]', async () => {
      expect(await loop1()).toEqual(['1', '3', '2']);
    });
  });

  describe('loop2() - multiple setTimeouts', () => {
    it('should return ["sync", "a", "b", "c"]', async () => {
      expect(await loop2()).toEqual(['sync', 'a', 'b', 'c']);
    });
  });

  describe('loop3() - order by delay', () => {
    it('should return ["sync", "timeout 0", "timeout 50", "timeout 100"]', async () => {
      expect(await loop3()).toEqual(['sync', 'timeout 0', 'timeout 50', 'timeout 100']);
    });
  });
});
