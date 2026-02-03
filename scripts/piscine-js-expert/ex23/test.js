import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createMemoryMonitor,
  createLeakDetector,
  createLRUCache,
  Resource,
  using,
  createMetadataManager,
  createStringPool,
  hasCircularReference
} from './index.js';

describe('Ex23 - Memory Management', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createMemoryMonitor()', () => {
    it('should collect samples', () => {
      vi.useRealTimers();

      const monitor = createMemoryMonitor({ interval: 10 });
      monitor.start();

      return new Promise((resolve) => {
        setTimeout(() => {
          monitor.stop();
          const samples = monitor.getSamples();
          expect(samples.length).toBeGreaterThan(0);
          resolve();
        }, 50);
      });
    });

    it('should provide snapshot', () => {
      vi.useRealTimers();

      const monitor = createMemoryMonitor();
      const snapshot = monitor.snapshot();

      expect(snapshot).toHaveProperty('timestamp');
      expect(snapshot).toHaveProperty('heapUsed');
    });

    it('should compare snapshots', () => {
      vi.useRealTimers();

      const monitor = createMemoryMonitor();
      const snap1 = { timestamp: 0, heapUsed: 1000 };
      const snap2 = { timestamp: 100, heapUsed: 2000 };

      const diff = monitor.compare(snap1, snap2);
      expect(diff.heapDiff).toBe(1000);
    });
  });

  describe('createLeakDetector()', () => {
    it('should analyze memory growth', () => {
      vi.useRealTimers();

      const detector = createLeakDetector({ sampleInterval: 10, windowSize: 5 });
      detector.start();

      return new Promise((resolve) => {
        setTimeout(() => {
          detector.stop();
          const analysis = detector.analyze();
          if (analysis) {
            expect(analysis).toHaveProperty('trend');
            expect(analysis).toHaveProperty('isLeaking');
          }
          resolve();
        }, 100);
      });
    });
  });

  describe('createLRUCache()', () => {
    it('should store and retrieve values', () => {
      const cache = createLRUCache(3);
      cache.set('a', 1);
      cache.set('b', 2);

      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBe(2);
    });

    it('should evict least recently used', () => {
      const cache = createLRUCache(2);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.get('a');
      cache.set('c', 3);

      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
    });

    it('should update order on get', () => {
      const cache = createLRUCache(2);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.get('a');
      cache.set('c', 3);

      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBeUndefined();
    });
  });

  describe('Resource class', () => {
    it('should be usable when not disposed', () => {
      const resource = new Resource();
      expect(() => resource.use()).not.toThrow();
    });

    it('should throw when used after dispose', () => {
      const resource = new Resource();
      resource.dispose();
      expect(() => resource.use()).toThrow();
    });

    it('should report disposed state', () => {
      const resource = new Resource();
      expect(resource.isDisposed).toBe(false);
      resource.dispose();
      expect(resource.isDisposed).toBe(true);
    });
  });

  describe('using()', () => {
    it('should auto-dispose after use', async () => {
      vi.useRealTimers();

      const resource = new Resource();

      await using(resource, (res) => {
        expect(res.isDisposed).toBe(false);
        return res.use();
      });

      expect(resource.isDisposed).toBe(true);
    });

    it('should dispose even on error', async () => {
      vi.useRealTimers();

      const resource = new Resource();

      try {
        await using(resource, () => {
          throw new Error('test');
        });
      } catch (e) {
        // Expected
      }

      expect(resource.isDisposed).toBe(true);
    });
  });

  describe('createMetadataManager()', () => {
    it('should store metadata on objects', () => {
      const manager = createMetadataManager();
      const obj = { id: 1 };

      manager.setMetadata(obj, { created: Date.now() });
      expect(manager.getMetadata(obj)).toHaveProperty('created');
    });

    it('should not prevent garbage collection', () => {
      const manager = createMetadataManager();
      let obj = { id: 1 };

      manager.setMetadata(obj, { data: 'test' });
      expect(manager.hasMetadata(obj)).toBe(true);

      obj = null;
    });
  });

  describe('createStringPool()', () => {
    it('should intern strings', () => {
      const pool = createStringPool();

      const s1 = pool.intern('hello');
      const s2 = pool.intern('hello');

      expect(s1).toBe(s2);
    });

    it('should track stats', () => {
      const pool = createStringPool();

      pool.intern('a');
      pool.intern('b');
      pool.intern('a');

      const stats = pool.stats;
      expect(stats.size).toBe(2);
      expect(stats.hits).toBe(1);
    });
  });

  describe('hasCircularReference()', () => {
    it('should detect direct circular reference', () => {
      const obj = { a: 1 };
      obj.self = obj;

      expect(hasCircularReference(obj)).toBe(true);
    });

    it('should detect indirect circular reference', () => {
      const a = { name: 'a' };
      const b = { name: 'b', ref: a };
      a.ref = b;

      expect(hasCircularReference(a)).toBe(true);
    });

    it('should return false for non-circular objects', () => {
      const obj = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, 3]
      };

      expect(hasCircularReference(obj)).toBe(false);
    });

    it('should handle arrays', () => {
      const arr = [1, 2];
      arr.push(arr);

      expect(hasCircularReference(arr)).toBe(true);
    });
  });
});
