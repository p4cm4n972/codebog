import { describe, it, expect, vi } from 'vitest';
import {
  createValidator,
  createObservable,
  createReadOnly,
  createNegativeArray,
  createPrivate,
  createCached,
  withVirtualProperties,
  createAutoVivifying
} from './index.js';

describe('Ex18 - Proxy & Reflect', () => {
  describe('createValidator()', () => {
    it('should accept valid values', () => {
      const schema = {
        age: (val) => typeof val === 'number' && val >= 0
      };
      const user = createValidator({}, schema);

      user.age = 25;
      expect(user.age).toBe(25);
    });

    it('should reject invalid values', () => {
      const schema = {
        age: (val) => typeof val === 'number' && val >= 0
      };
      const user = createValidator({}, schema);

      expect(() => { user.age = -5; }).toThrow();
      expect(() => { user.age = 'invalid'; }).toThrow();
    });

    it('should allow properties without rules', () => {
      const schema = {
        age: (val) => typeof val === 'number'
      };
      const user = createValidator({}, schema);

      user.name = 'Alice';
      expect(user.name).toBe('Alice');
    });
  });

  describe('createObservable()', () => {
    it('should notify on set', () => {
      const callback = vi.fn();
      const state = createObservable({ count: 0 }, callback);

      state.count = 1;

      expect(callback).toHaveBeenCalledWith('count', 1, 0);
    });

    it('should notify on delete', () => {
      const callback = vi.fn();
      const state = createObservable({ name: 'test' }, callback);

      delete state.name;

      expect(callback).toHaveBeenCalledWith('name', undefined, 'test', 'delete');
    });
  });

  describe('createReadOnly()', () => {
    it('should allow reading', () => {
      const config = createReadOnly({ apiUrl: 'https://api.com' });
      expect(config.apiUrl).toBe('https://api.com');
    });

    it('should prevent modification', () => {
      const config = createReadOnly({ value: 1 });
      expect(() => { config.value = 2; }).toThrow();
    });

    it('should prevent deletion', () => {
      const config = createReadOnly({ value: 1 });
      expect(() => { delete config.value; }).toThrow();
    });

    it('should prevent defineProperty', () => {
      const config = createReadOnly({ value: 1 });
      expect(() => {
        Object.defineProperty(config, 'new', { value: 2 });
      }).toThrow();
    });
  });

  describe('createNegativeArray()', () => {
    it('should access positive indices normally', () => {
      const arr = createNegativeArray([1, 2, 3, 4, 5]);
      expect(arr[0]).toBe(1);
      expect(arr[2]).toBe(3);
    });

    it('should access negative indices from end', () => {
      const arr = createNegativeArray([1, 2, 3, 4, 5]);
      expect(arr[-1]).toBe(5);
      expect(arr[-2]).toBe(4);
      expect(arr[-5]).toBe(1);
    });

    it('should allow setting with negative indices', () => {
      const arr = createNegativeArray([1, 2, 3]);
      arr[-1] = 10;
      expect(arr[2]).toBe(10);
    });

    it('should preserve array methods', () => {
      const arr = createNegativeArray([1, 2, 3]);
      arr.push(4);
      expect(arr[-1]).toBe(4);
    });
  });

  describe('createPrivate()', () => {
    it('should hide properties starting with _', () => {
      const user = createPrivate({
        name: 'Alice',
        _password: 'secret'
      });

      expect(user.name).toBe('Alice');
      expect(() => user._password).toThrow();
    });

    it('should prevent setting private properties', () => {
      const user = createPrivate({ _secret: 'hidden' });
      expect(() => { user._secret = 'new'; }).toThrow();
    });

    it('should hide private from in operator', () => {
      const user = createPrivate({ name: 'Alice', _secret: 'hidden' });
      expect('name' in user).toBe(true);
      expect('_secret' in user).toBe(false);
    });

    it('should hide private from Object.keys', () => {
      const user = createPrivate({ name: 'Alice', _secret: 'hidden' });
      expect(Object.keys(user)).toEqual(['name']);
    });
  });

  describe('createCached()', () => {
    it('should cache function results', () => {
      let callCount = 0;
      const fn = (n) => {
        callCount++;
        return n * 2;
      };
      const cached = createCached(fn);

      expect(cached(5)).toBe(10);
      expect(cached(5)).toBe(10);
      expect(callCount).toBe(1);
    });

    it('should cache different arguments separately', () => {
      let callCount = 0;
      const fn = (n) => {
        callCount++;
        return n * 2;
      };
      const cached = createCached(fn);

      cached(5);
      cached(10);
      cached(5);

      expect(callCount).toBe(2);
    });
  });

  describe('withVirtualProperties()', () => {
    it('should add computed properties', () => {
      const person = withVirtualProperties(
        { firstName: 'John', lastName: 'Doe' },
        {
          fullName() {
            return `${this.firstName} ${this.lastName}`;
          }
        }
      );

      expect(person.fullName).toBe('John Doe');
    });

    it('should include virtual properties in ownKeys', () => {
      const obj = withVirtualProperties(
        { a: 1 },
        { b() { return 2; } }
      );

      expect(Object.keys(obj)).toContain('b');
    });
  });

  describe('createAutoVivifying()', () => {
    it('should auto-create nested objects', () => {
      const data = createAutoVivifying();

      data.user.profile.settings.theme = 'dark';

      expect(data.user.profile.settings.theme).toBe('dark');
    });

    it('should allow deep nesting', () => {
      const data = createAutoVivifying();

      data.a.b.c.d.e.f = 'deep';

      expect(data.a.b.c.d.e.f).toBe('deep');
    });
  });
});
