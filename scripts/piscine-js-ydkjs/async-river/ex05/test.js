import { describe, it, expect } from 'vitest';
import { error1, error2, error3, error4 } from './index.js';

describe('Ex05 - Error Propagation', () => {
  describe('error1() - try/catch with await', () => {
    it('should return "caught: error"', async () => {
      expect(await error1()).toBe('caught: error');
    });
  });

  describe('error2() - stored rejected promise', () => {
    it('should return "caught: error"', async () => {
      expect(await error2()).toBe('caught: error');
    });
  });

  describe('error3() - throw in async function', () => {
    it('should return "oops"', async () => {
      expect(await error3()).toBe('oops');
    });
  });

  describe('error4() - error bubbles up', () => {
    it('should return "inner error"', async () => {
      expect(await error4()).toBe('inner error');
    });
  });
});
