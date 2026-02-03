import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  nextTick,
  defer,
  createTaskScheduler,
  runSequentially,
  predictOrder1,
  predictOrder2,
  predictOrder3
} from './index.js';

describe('Ex09 - Event Loop & Microtasks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('nextTick()', () => {
    it('should schedule callback as microtask', async () => {
      const order = [];

      order.push('sync start');
      nextTick(() => order.push('next tick'));
      order.push('sync end');

      await vi.advanceTimersByTimeAsync(0);

      expect(order).toEqual(['sync start', 'sync end', 'next tick']);
    });

    it('should execute before setTimeout', async () => {
      const order = [];

      setTimeout(() => order.push('timeout'), 0);
      nextTick(() => order.push('tick'));

      await vi.advanceTimersByTimeAsync(0);

      expect(order[0]).toBe('tick');
      expect(order[1]).toBe('timeout');
    });
  });

  describe('defer()', () => {
    it('should schedule as macrotask', async () => {
      const order = [];

      Promise.resolve().then(() => order.push('microtask'));
      defer(() => order.push('deferred'));

      await vi.advanceTimersByTimeAsync(0);

      expect(order).toEqual(['microtask', 'deferred']);
    });
  });

  describe('createTaskScheduler()', () => {
    it('should execute high priority first', async () => {
      const scheduler = createTaskScheduler();
      const order = [];

      scheduler.scheduleLow(() => order.push('low'));
      scheduler.schedule(() => order.push('normal'));
      scheduler.scheduleHigh(() => order.push('high'));

      await vi.advanceTimersByTimeAsync(0);

      expect(order).toEqual(['high', 'normal', 'low']);
    });

    it('should track pending count', () => {
      const scheduler = createTaskScheduler();

      scheduler.schedule(() => {});
      scheduler.schedule(() => {});
      scheduler.scheduleHigh(() => {});

      expect(scheduler.pendingCount).toBe(3);
    });
  });

  describe('runSequentially()', () => {
    it('should run functions in sequence', async () => {
      const order = [];
      const fns = [
        async () => { order.push(1); return 'a'; },
        async () => { order.push(2); return 'b'; },
        async () => { order.push(3); return 'c'; }
      ];

      const results = await runSequentially(fns);

      expect(order).toEqual([1, 2, 3]);
      expect(results).toEqual(['a', 'b', 'c']);
    });

    it('should not run in parallel', async () => {
      let concurrent = 0;
      let maxConcurrent = 0;

      const fns = [1, 2, 3].map(() => async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise(r => setTimeout(r, 10));
        concurrent--;
      });

      await vi.runAllTimersAsync();
      await runSequentially(fns);

      expect(maxConcurrent).toBe(1);
    });
  });

  describe('predictOrder1()', () => {
    it('should return correct execution order', () => {
      expect(predictOrder1()).toEqual(['1', '4', '3', '2']);
    });
  });

  describe('predictOrder2()', () => {
    it('should return correct order with nested microtasks', () => {
      expect(predictOrder2()).toEqual([
        'start', 'end', 'promise 1', 'promise 2',
        'timeout 1', 'promise inside timeout', 'timeout 2'
      ]);
    });
  });

  describe('predictOrder3()', () => {
    it('should return correct order with async/await', () => {
      expect(predictOrder3()).toEqual([
        'script start', 'async start', 'promise executor', 'script end',
        'async after await', 'promise then', 'setTimeout'
      ]);
    });
  });
});
