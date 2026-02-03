import { describe, it, expect } from 'vitest';
import {
  createNamespace,
  createNestedNamespace,
  createModule,
  createSingleton,
  registerService,
  createContainer,
  freezeNamespace,
  sealNamespace
} from './index.js';

describe('Ex10 - Global Abatement', () => {
  describe('createNamespace()', () => {
    it('should create namespace on parent', () => {
      const parent = {};
      createNamespace('utils', parent);

      expect(parent.utils).toBeDefined();
      expect(typeof parent.utils).toBe('object');
    });

    it('should return parent', () => {
      const parent = {};
      const result = createNamespace('app', parent);

      expect(result).toBe(parent);
    });
  });

  describe('createNestedNamespace()', () => {
    it('should create nested structure', () => {
      const root = {};
      createNestedNamespace('app.utils.dom', root);

      expect(root.app).toBeDefined();
      expect(root.app.utils).toBeDefined();
      expect(root.app.utils.dom).toBeDefined();
    });

    it('should return deepest namespace', () => {
      const root = {};
      const result = createNestedNamespace('a.b.c', root);

      expect(result).toBe(root.a.b.c);
    });

    it('should not overwrite existing', () => {
      const root = { app: { existing: true } };
      createNestedNamespace('app.utils', root);

      expect(root.app.existing).toBe(true);
      expect(root.app.utils).toBeDefined();
    });
  });

  describe('createModule()', () => {
    it('should create module with private state', () => {
      const module = createModule(privateState => {
        privateState.count = 0;

        return {
          increment() {
            privateState.count++;
          },
          getCount() {
            return privateState.count;
          }
        };
      });

      expect(module.getCount()).toBe(0);
      module.increment();
      expect(module.getCount()).toBe(1);
    });
  });

  describe('createSingleton()', () => {
    it('should return same instance', () => {
      let callCount = 0;
      const getInstance = createSingleton(() => {
        callCount++;
        return { id: Math.random() };
      });

      const a = getInstance();
      const b = getInstance();

      expect(a).toBe(b);
      expect(callCount).toBe(1);
    });
  });

  describe('registerService()', () => {
    it('should add service to container', () => {
      const container = {};
      const service = { name: 'logger' };

      registerService(container, 'logger', service);

      expect(container.logger).toBe(service);
    });
  });

  describe('createContainer()', () => {
    it('should register and get services', () => {
      const container = createContainer();

      container.register('config', () => ({ env: 'test' }));
      const config = container.get('config');

      expect(config.env).toBe('test');
    });

    it('should cache instances', () => {
      const container = createContainer();
      let count = 0;

      container.register('counter', () => {
        count++;
        return { value: count };
      });

      const a = container.get('counter');
      const b = container.get('counter');

      expect(a).toBe(b);
      expect(count).toBe(1);
    });
  });

  describe('freezeNamespace()', () => {
    it('should prevent modifications', () => {
      const obj = freezeNamespace({ a: 1 });

      expect(() => {
        obj.a = 2;
      }).toThrow();

      expect(() => {
        obj.b = 3;
      }).toThrow();
    });
  });

  describe('sealNamespace()', () => {
    it('should prevent new properties', () => {
      const obj = sealNamespace({ a: 1 });

      expect(() => {
        obj.b = 2;
      }).toThrow();
    });

    it('should allow modification of existing', () => {
      const obj = sealNamespace({ a: 1 });
      obj.a = 2;

      expect(obj.a).toBe(2);
    });
  });
});
