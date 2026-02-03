import { describe, it, expect, vi } from 'vitest';
import {
  Singleton,
  Database,
  createUser,
  createUIFactory,
  createObservable,
  validators,
  createValidator,
  withLogging,
  withTiming,
  readonly
} from './index.js';

describe('Ex16 - Design Patterns OOP', () => {
  describe('Singleton (IIFE)', () => {
    it('should return same instance', () => {
      const s1 = Singleton.getInstance();
      const s2 = Singleton.getInstance();
      expect(s1).toBe(s2);
    });

    it('should share state between calls', () => {
      const s1 = Singleton.getInstance();
      s1.add('item');
      const s2 = Singleton.getInstance();
      expect(s2.getAll()).toContain('item');
    });
  });

  describe('Database Singleton (Class)', () => {
    it('should return same instance', () => {
      const db1 = new Database();
      const db2 = new Database();
      expect(db1).toBe(db2);
    });

    it('should share connection', () => {
      const db1 = new Database();
      db1.connect('postgres://localhost');
      const db2 = new Database();
      expect(db2.isConnected()).toBe(true);
    });
  });

  describe('Factory - createUser()', () => {
    it('should create admin with all permissions', () => {
      const admin = createUser('admin', { name: 'Alice' });
      expect(admin.role).toBe('admin');
      expect(admin.permissions).toContain('delete');
    });

    it('should create editor with read/write', () => {
      const editor = createUser('editor', { name: 'Bob' });
      expect(editor.role).toBe('editor');
      expect(editor.permissions).toContain('write');
      expect(editor.permissions).not.toContain('delete');
    });

    it('should create viewer with read only', () => {
      const viewer = createUser('viewer', { name: 'Charlie' });
      expect(viewer.role).toBe('viewer');
      expect(viewer.permissions).toEqual(['read']);
    });

    it('should throw on unknown type', () => {
      expect(() => createUser('superuser', {})).toThrow();
    });
  });

  describe('Abstract Factory - createUIFactory()', () => {
    it('should create dark theme components', () => {
      const darkUI = createUIFactory('dark');
      const button = darkUI.createButton('Click');
      expect(button.bg).toBe('#333');
      expect(button.color).toBe('#fff');
    });

    it('should create light theme components', () => {
      const lightUI = createUIFactory('light');
      const button = lightUI.createButton('Click');
      expect(button.bg).toBe('#fff');
      expect(button.color).toBe('#333');
    });
  });

  describe('Observer - createObservable()', () => {
    it('should notify subscribers on change', () => {
      const callback = vi.fn();
      const counter = createObservable(0);

      counter.subscribe(callback);
      counter.value = 1;

      expect(callback).toHaveBeenCalledWith(1, 0);
    });

    it('should allow unsubscribe', () => {
      const callback = vi.fn();
      const counter = createObservable(0);

      const unsubscribe = counter.subscribe(callback);
      unsubscribe();
      counter.value = 1;

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Strategy - validators', () => {
    it('should validate required', () => {
      expect(validators.required('value')).toBe(true);
      expect(validators.required('')).toBe(false);
      expect(validators.required(null)).toBe(false);
    });

    it('should validate email', () => {
      expect(validators.email('test@example.com')).toBe(true);
      expect(validators.email('invalid')).toBe(false);
    });

    it('should validate minLength', () => {
      const min5 = validators.minLength(5);
      expect(min5('hello')).toBe(true);
      expect(min5('hi')).toBe(false);
    });
  });

  describe('Strategy - createValidator()', () => {
    it('should validate with multiple rules', () => {
      const emailValidator = createValidator({
        required: validators.required,
        email: validators.email
      });

      expect(emailValidator('test@example.com')).toEqual({
        valid: true,
        errors: []
      });

      expect(emailValidator('invalid')).toEqual({
        valid: false,
        errors: ['email']
      });

      expect(emailValidator('')).toEqual({
        valid: false,
        errors: expect.arrayContaining(['required'])
      });
    });
  });

  describe('Decorator - withLogging()', () => {
    it('should log calls and return result', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const add = (a, b) => a + b;
      const loggedAdd = withLogging(add);

      const result = loggedAdd(2, 3);

      expect(result).toBe(5);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Decorator - withTiming()', () => {
    it('should measure execution time', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const slowFn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) sum += i;
        return sum;
      };
      const timedFn = withTiming(slowFn);

      timedFn();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('took')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Decorator - readonly()', () => {
    it('should prevent modifications', () => {
      const config = readonly({ apiUrl: 'https://api.example.com' });

      expect(config.apiUrl).toBe('https://api.example.com');
      expect(() => { config.apiUrl = 'other'; }).toThrow();
    });

    it('should prevent deletions', () => {
      const config = readonly({ key: 'value' });
      expect(() => { delete config.key; }).toThrow();
    });
  });
});
