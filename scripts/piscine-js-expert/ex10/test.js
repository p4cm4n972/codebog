import { describe, it, expect, vi } from 'vitest';
import {
  createCounter,
  createBankAccount,
  createStack,
  createEventEmitter
} from './index.js';

describe('Ex10 - Module Pattern & Encapsulation', () => {
  describe('createCounter()', () => {
    it('should start at 0', () => {
      const counter = createCounter();
      expect(counter.getValue()).toBe(0);
    });

    it('should increment', () => {
      const counter = createCounter();
      expect(counter.increment()).toBe(1);
      expect(counter.increment()).toBe(2);
    });

    it('should decrement', () => {
      const counter = createCounter();
      counter.increment();
      counter.increment();
      expect(counter.decrement()).toBe(1);
    });

    it('should reset to 0', () => {
      const counter = createCounter();
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.getValue()).toBe(0);
    });

    it('should have private count (not accessible directly)', () => {
      const counter = createCounter();
      expect(counter.count).toBeUndefined();
    });
  });

  describe('createBankAccount()', () => {
    it('should start with initial balance', () => {
      const account = createBankAccount(1000);
      expect(account.getBalance()).toBe(1000);
    });

    it('should deposit money', () => {
      const account = createBankAccount(100);
      account.deposit(50);
      expect(account.getBalance()).toBe(150);
    });

    it('should withdraw money', () => {
      const account = createBankAccount(100);
      account.withdraw(30);
      expect(account.getBalance()).toBe(70);
    });

    it('should not allow negative balance', () => {
      const account = createBankAccount(100);
      expect(() => account.withdraw(150)).toThrow();
    });

    it('should track transaction history', () => {
      const account = createBankAccount(100);
      account.deposit(50);
      account.withdraw(25);

      const history = account.getHistory();
      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history.some(t => t.type === 'deposit')).toBe(true);
      expect(history.some(t => t.type === 'withdraw')).toBe(true);
    });

    it('should have private balance', () => {
      const account = createBankAccount(1000);
      expect(account.balance).toBeUndefined();
    });
  });

  describe('createStack()', () => {
    it('should push items', () => {
      const stack = createStack();
      stack.push(1);
      stack.push(2);
      expect(stack.size()).toBe(2);
    });

    it('should pop items in LIFO order', () => {
      const stack = createStack();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
    });

    it('should peek without removing', () => {
      const stack = createStack();
      stack.push(1);
      stack.push(2);
      expect(stack.peek()).toBe(2);
      expect(stack.size()).toBe(2);
    });

    it('should report isEmpty correctly', () => {
      const stack = createStack();
      expect(stack.isEmpty()).toBe(true);
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
    });
  });

  describe('createEventEmitter()', () => {
    it('should register and emit events', () => {
      const emitter = createEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.emit('test', 'data');

      expect(callback).toHaveBeenCalledWith('data');
    });

    it('should support multiple listeners', () => {
      const emitter = createEventEmitter();
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.emit('test');

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should remove listeners with off', () => {
      const emitter = createEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.off('test', callback);
      emitter.emit('test');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support once (fire only once)', () => {
      const emitter = createEventEmitter();
      const callback = vi.fn();

      emitter.once('test', callback);
      emitter.emit('test');
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
