import { describe, it, expect, vi } from 'vitest';
import {
  createInlineWorker,
  createWorkerPool,
  parallelize,
  createMutex,
  createAtomicCounter,
  createPriorityTaskQueue,
  transferToWorker,
  createMockWorker
} from './index.js';

describe('Ex24 - Web Workers & Concurrency', () => {
  describe('createMockWorker()', () => {
    it('should simulate worker message passing', async () => {
      const worker = createMockWorker((data) => data * 2);

      const result = await new Promise((resolve) => {
        worker.onmessage = (e) => resolve(e.data);
        worker.postMessage(5);
      });

      expect(result).toBe(10);
    });

    it('should handle async worker functions', async () => {
      const worker = createMockWorker(async (data) => {
        await new Promise(r => setTimeout(r, 10));
        return data.map(x => x * 2);
      });

      const result = await new Promise((resolve) => {
        worker.onmessage = (e) => resolve(e.data);
        worker.postMessage([1, 2, 3]);
      });

      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe('createInlineWorker()', () => {
    it('should create worker from function', async () => {
      const { run, terminate } = createInlineWorker((data) => data * 2);

      const result = await run(21);
      expect(result).toBe(42);

      terminate();
    });
  });

  describe('createWorkerPool()', () => {
    it('should run tasks on pool', async () => {
      const pool = createWorkerPool(
        URL.createObjectURL(new Blob([
          'self.onmessage = (e) => self.postMessage(e.data * 2)'
        ], { type: 'application/javascript' })),
        2
      );

      const results = await pool.runAll([1, 2, 3, 4]);
      expect(results.sort()).toEqual([2, 4, 6, 8]);

      pool.terminate();
    });

    it('should report stats', () => {
      const pool = createWorkerPool('worker.js', 4);
      const stats = pool.getStats();

      expect(stats).toHaveProperty('poolSize');
      expect(stats.poolSize).toBe(4);

      pool.terminate();
    });
  });

  describe('parallelize()', () => {
    it('should process chunks in parallel', async () => {
      const fn = (chunk) => chunk.reduce((a, b) => a + b, 0);
      const chunks = [[1, 2], [3, 4], [5, 6]];

      const results = await parallelize(fn, chunks);
      expect(results).toEqual([3, 7, 11]);
    });
  });

  describe('createMutex()', () => {
    it('should provide lock/unlock', () => {
      const buffer = new SharedArrayBuffer(4);
      const array = new Int32Array(buffer);
      const mutex = createMutex(array, 0);

      mutex.lock();
      expect(() => mutex.lock()).toThrow();
      mutex.unlock();
      expect(() => mutex.lock()).not.toThrow();
      mutex.unlock();
    });

    it('should support withLock', () => {
      const buffer = new SharedArrayBuffer(4);
      const array = new Int32Array(buffer);
      const mutex = createMutex(array, 0);

      let executed = false;
      mutex.withLock(() => {
        executed = true;
      });

      expect(executed).toBe(true);
    });
  });

  describe('createAtomicCounter()', () => {
    it('should increment atomically', () => {
      const buffer = new SharedArrayBuffer(4);
      const counter = createAtomicCounter(buffer);

      expect(counter.get()).toBe(0);
      counter.increment();
      counter.increment();
      expect(counter.get()).toBe(2);
    });

    it('should decrement atomically', () => {
      const buffer = new SharedArrayBuffer(4);
      const counter = createAtomicCounter(buffer);

      counter.increment();
      counter.increment();
      counter.decrement();
      expect(counter.get()).toBe(1);
    });

    it('should reset', () => {
      const buffer = new SharedArrayBuffer(4);
      const counter = createAtomicCounter(buffer);

      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.get()).toBe(0);
    });
  });

  describe('createPriorityTaskQueue()', () => {
    it('should process high priority first', async () => {
      const order = [];
      const queue = createPriorityTaskQueue(
        URL.createObjectURL(new Blob([
          'self.onmessage = (e) => self.postMessage(e.data)'
        ], { type: 'application/javascript' })),
        1
      );

      queue.enqueue('low', 'low').then(() => order.push('low'));
      queue.enqueue('normal', 'normal').then(() => order.push('normal'));
      queue.enqueue('high', 'high').then(() => order.push('high'));

      await new Promise(r => setTimeout(r, 100));

      expect(order[0]).toBe('high');
    });

    it('should report queue lengths', () => {
      const queue = createPriorityTaskQueue('worker.js', 1);
      const lengths = queue.getQueueLengths();

      expect(lengths).toHaveProperty('high');
      expect(lengths).toHaveProperty('normal');
      expect(lengths).toHaveProperty('low');
    });
  });

  describe('transferToWorker()', () => {
    it('should transfer buffer ownership', async () => {
      const worker = createMockWorker((data) => {
        const arr = new Uint8Array(data.buffer);
        return arr.length;
      });

      const buffer = new ArrayBuffer(100);
      const result = await transferToWorker(worker, buffer);

      expect(result).toBe(100);
      expect(buffer.byteLength).toBe(0);
    });
  });
});
