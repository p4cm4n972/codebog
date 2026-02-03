import { describe, it, expect } from 'vitest';
import { priority1, priority2, priority3, priority4 } from './index.js';

describe('Ex05 - Binding Priority', () => {
  describe('priority1() - new vs implicit', () => {
    it('should return "Alice" (new wins over implicit)', () => {
      expect(priority1()).toBe('Alice');
    });
  });

  describe('priority2() - bind vs implicit', () => {
    it('should return "Hello, other" (bind wins over implicit)', () => {
      expect(priority2()).toBe('Hello, other');
    });
  });

  describe('priority3() - new vs bind', () => {
    it('should return "Alice" (new wins over bind)', () => {
      expect(priority3()).toBe('Alice');
    });
  });

  describe('priority4() - explicit vs implicit', () => {
    it('should return "Hello, call" (call wins over implicit)', () => {
      expect(priority4()).toBe('Hello, call');
    });
  });
});
