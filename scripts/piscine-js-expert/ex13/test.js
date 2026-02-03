import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createPerson,
  createBankAccount,
  createStateMachine,
  createEventEmitter,
  createCache
} from './index.js';

describe('Ex13 - Factory Functions & Data Privacy', () => {
  describe('createPerson()', () => {
    it('should create a person with getters', () => {
      const person = createPerson('Alice', 30);
      expect(person.getName()).toBe('Alice');
      expect(person.getAge()).toBe(30);
    });

    it('should validate on construction', () => {
      expect(() => createPerson('', 30)).toThrow();
      expect(() => createPerson('Alice', -5)).toThrow();
    });

    it('should validate on setters', () => {
      const person = createPerson('Alice', 30);
      expect(() => person.setName('')).toThrow();
      expect(() => person.setAge(-1)).toThrow();
    });

    it('should celebrate birthday', () => {
      const person = createPerson('Alice', 30);
      person.celebrateBirthday();
      expect(person.getAge()).toBe(31);
    });

    it('should have private data', () => {
      const person = createPerson('Alice', 30);
      expect(person._name).toBeUndefined();
      expect(person._age).toBeUndefined();
    });
  });

  describe('createBankAccount()', () => {
    it('should track balance', () => {
      const account = createBankAccount('Alice', 1000);
      expect(account.getBalance()).toBe(1000);
      account.deposit(500);
      expect(account.getBalance()).toBe(1500);
    });

    it('should prevent overdraft', () => {
      const account = createBankAccount('Alice', 100);
      expect(() => account.withdraw(200)).toThrow('Insufficient funds');
    });

    it('should transfer between accounts', () => {
      const alice = createBankAccount('Alice', 1000);
      const bob = createBankAccount('Bob', 500);

      alice.transfer(bob, 300);

      expect(alice.getBalance()).toBe(700);
      expect(bob.getBalance()).toBe(800);
    });

    it('should track statement', () => {
      const account = createBankAccount('Alice', 1000);
      account.deposit(100);
      account.withdraw(50);

      const statement = account.getStatement();
      expect(statement.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('createStateMachine()', () => {
    const trafficLightConfig = {
      initial: 'red',
      states: {
        red: { on: { TIMER: 'green' } },
        green: { on: { TIMER: 'yellow' } },
        yellow: { on: { TIMER: 'red' } }
      }
    };

    it('should start at initial state', () => {
      const machine = createStateMachine(trafficLightConfig);
      expect(machine.getState()).toBe('red');
    });

    it('should transition on valid action', () => {
      const machine = createStateMachine(trafficLightConfig);
      machine.send('TIMER');
      expect(machine.getState()).toBe('green');
    });

    it('should throw on invalid action', () => {
      const machine = createStateMachine(trafficLightConfig);
      expect(() => machine.send('INVALID')).toThrow();
    });

    it('should check if action is possible', () => {
      const machine = createStateMachine(trafficLightConfig);
      expect(machine.can('TIMER')).toBe(true);
      expect(machine.can('INVALID')).toBe(false);
    });

    it('should track history', () => {
      const machine = createStateMachine(trafficLightConfig);
      machine.send('TIMER');
      machine.send('TIMER');

      const history = machine.getHistory();
      expect(history.length).toBe(3);
    });
  });

  describe('createEventEmitter()', () => {
    it('should emit events', () => {
      const emitter = createEventEmitter();
      const handler = vi.fn();

      emitter.on('test', handler);
      emitter.emit('test', 'data');

      expect(handler).toHaveBeenCalledWith('data');
    });

    it('should remove listeners', () => {
      const emitter = createEventEmitter();
      const handler = vi.fn();

      emitter.on('test', handler);
      emitter.off('test', handler);
      emitter.emit('test');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should support once', () => {
      const emitter = createEventEmitter();
      const handler = vi.fn();

      emitter.once('test', handler);
      emitter.emit('test');
      emitter.emit('test');

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCache()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should store and retrieve values', () => {
      const cache = createCache();
      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
    });

    it('should respect maxSize', () => {
      const cache = createCache({ maxSize: 2 });

      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });

    it('should expire entries after TTL', () => {
      const cache = createCache({ ttlMs: 1000 });

      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');

      vi.advanceTimersByTime(1001);
      expect(cache.get('key')).toBeUndefined();
    });

    it('should call onEvict', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 1, onEvict });

      cache.set('a', 1);
      cache.set('b', 2);

      expect(onEvict).toHaveBeenCalledWith('a', 1);
    });
  });
});
