import { describe, it, expect, vi } from 'vitest';
import { Person, Rectangle, BankAccount, EventEmitter, LinkedList } from './index.js';

describe('Ex15 - ES6+ Classes & Private Fields', () => {
  describe('Person class', () => {
    it('should create a person with name and age', () => {
      const alice = new Person('Alice', 30);
      expect(alice.name).toBe('Alice');
      expect(alice.age).toBe(30);
    });

    it('should have unique id', () => {
      const p1 = new Person('A', 20);
      const p2 = new Person('B', 25);
      expect(p1.id).not.toBe(p2.id);
    });

    it('should validate name', () => {
      const person = new Person('Alice', 30);
      expect(() => { person.name = ''; }).toThrow();
    });

    it('should validate age', () => {
      const person = new Person('Alice', 30);
      expect(() => { person.age = -5; }).toThrow();
      expect(() => { person.age = 200; }).toThrow();
    });

    it('should celebrate birthday', () => {
      const person = new Person('Alice', 30);
      person.celebrateBirthday();
      expect(person.age).toBe(31);
    });

    it('should greet', () => {
      const person = new Person('Alice', 30);
      expect(person.greet()).toContain('Alice');
    });

    it('should create anonymous person', () => {
      const anon = Person.createAnonymous();
      expect(anon.name).toBe('Anonymous');
    });

    it('should track total created', () => {
      const before = Person.totalCreated;
      new Person('Test', 20);
      expect(Person.totalCreated).toBe(before + 1);
    });
  });

  describe('Rectangle class', () => {
    it('should calculate area', () => {
      const rect = new Rectangle(4, 5);
      expect(rect.area).toBe(20);
    });

    it('should calculate perimeter', () => {
      const rect = new Rectangle(4, 5);
      expect(rect.perimeter).toBe(18);
    });

    it('should detect square', () => {
      const rect = new Rectangle(4, 5);
      const square = new Rectangle(5, 5);

      expect(rect.isSquare).toBe(false);
      expect(square.isSquare).toBe(true);
    });

    it('should create from square', () => {
      const square = Rectangle.fromSquare(5);
      expect(square.width).toBe(5);
      expect(square.height).toBe(5);
      expect(square.isSquare).toBe(true);
    });

    it('should scale', () => {
      const rect = new Rectangle(2, 3);
      const scaled = rect.scale(2);
      expect(scaled.width).toBe(4);
      expect(scaled.height).toBe(6);
    });

    it('should have toString', () => {
      const rect = new Rectangle(4, 5);
      expect(rect.toString()).toContain('4');
      expect(rect.toString()).toContain('5');
    });
  });

  describe('BankAccount class', () => {
    it('should track balance', () => {
      const account = new BankAccount('Alice', 1000);
      expect(account.balance).toBe(1000);
    });

    it('should not allow direct balance modification', () => {
      const account = new BankAccount('Alice', 1000);
      expect(() => { account.balance = 9999; }).toThrow();
    });

    it('should deposit', () => {
      const account = new BankAccount('Alice', 1000);
      account.deposit(500);
      expect(account.balance).toBe(1500);
    });

    it('should withdraw', () => {
      const account = new BankAccount('Alice', 1000);
      account.withdraw(300);
      expect(account.balance).toBe(700);
    });

    it('should prevent overdraft', () => {
      const account = new BankAccount('Alice', 100);
      expect(() => account.withdraw(200)).toThrow('Insufficient');
    });

    it('should transfer', () => {
      const alice = new BankAccount('Alice', 1000);
      const bob = new BankAccount('Bob', 500);

      alice.transfer(bob, 300);

      expect(alice.balance).toBe(700);
      expect(bob.balance).toBe(800);
    });

    it('should track transaction history', () => {
      const account = new BankAccount('Alice', 1000);
      account.deposit(100);
      account.withdraw(50);

      const history = account.transactionHistory;
      expect(history.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('EventEmitter class', () => {
    it('should register and emit events', () => {
      const emitter = new EventEmitter();
      const handler = vi.fn();

      emitter.on('test', handler);
      emitter.emit('test', 'arg1', 'arg2');

      expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should remove listeners', () => {
      const emitter = new EventEmitter();
      const handler = vi.fn();

      emitter.on('test', handler);
      emitter.off('test', handler);
      emitter.emit('test');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should support once', () => {
      const emitter = new EventEmitter();
      const handler = vi.fn();

      emitter.once('test', handler);
      emitter.emit('test');
      emitter.emit('test');

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should count listeners', () => {
      const emitter = new EventEmitter();

      emitter.on('test', () => {});
      emitter.on('test', () => {});

      expect(emitter.listenerCount('test')).toBe(2);
    });

    it('should remove all listeners', () => {
      const emitter = new EventEmitter();

      emitter.on('test', () => {});
      emitter.on('test', () => {});
      emitter.removeAllListeners('test');

      expect(emitter.listenerCount('test')).toBe(0);
    });

    it('should allow method chaining', () => {
      const emitter = new EventEmitter();

      const result = emitter
        .on('a', () => {})
        .on('b', () => {})
        .once('c', () => {});

      expect(result).toBe(emitter);
    });
  });

  describe('LinkedList class', () => {
    it('should add items', () => {
      const list = new LinkedList();
      list.add(1).add(2).add(3);
      expect(list.size).toBe(3);
    });

    it('should be iterable', () => {
      const list = new LinkedList();
      list.add(1).add(2).add(3);
      expect([...list]).toEqual([1, 2, 3]);
    });

    it('should convert to array', () => {
      const list = new LinkedList();
      list.add(1).add(2);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it('should remove items', () => {
      const list = new LinkedList();
      list.add(1).add(2).add(3);
      list.remove(2);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it('should find items', () => {
      const list = new LinkedList();
      list.add({ id: 1 }).add({ id: 2 }).add({ id: 3 });
      const found = list.find(item => item.id === 2);
      expect(found).toEqual({ id: 2 });
    });

    it('should add to beginning', () => {
      const list = new LinkedList();
      list.add(2).add(3);
      list.addFirst(1);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should create from iterable', () => {
      const list = LinkedList.from([1, 2, 3]);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should report isEmpty', () => {
      const list = new LinkedList();
      expect(list.isEmpty).toBe(true);
      list.add(1);
      expect(list.isEmpty).toBe(false);
    });
  });
});
