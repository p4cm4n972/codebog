import { describe, it, expect } from 'vitest';
import {
  inherit,
  Animal,
  Dog,
  Labrador,
  getPrototypeChain,
  deepClone,
  mixin,
  createObject
} from './index.js';

describe('Ex14 - Prototype Chain & Inheritance', () => {
  describe('inherit()', () => {
    it('should establish prototype chain', () => {
      function Parent() {}
      Parent.prototype.parentMethod = function() { return 'parent'; };

      function Child() {}
      inherit(Child, Parent);

      const child = new Child();
      expect(child.parentMethod()).toBe('parent');
    });

    it('should preserve constructor', () => {
      function Parent() {}
      function Child() {}
      inherit(Child, Parent);

      expect(Child.prototype.constructor).toBe(Child);
    });
  });

  describe('Animal -> Dog -> Labrador hierarchy', () => {
    it('should create Dog with Animal methods', () => {
      const rex = new Dog('Rex', 'German Shepherd');

      expect(rex.name).toBe('Rex');
      expect(rex.breed).toBe('German Shepherd');
      expect(rex.eat('kibble')).toBe('Rex eats kibble');
    });

    it('should override speak in Dog', () => {
      const rex = new Dog('Rex', 'German Shepherd');
      expect(rex.speak()).toContain('Woof');
    });

    it('should have fetch method on Dog', () => {
      const rex = new Dog('Rex', 'German Shepherd');
      expect(rex.fetch()).toContain('fetch');
    });

    it('should create Labrador with all inherited methods', () => {
      const buddy = new Labrador('Buddy', 'golden');

      expect(buddy.name).toBe('Buddy');
      expect(buddy.color).toBe('golden');
      expect(buddy.breed).toBe('Labrador');
      expect(buddy.eat('treats')).toContain('eats');
      expect(buddy.speak()).toContain('Woof');
    });

    it('should have swim method on Labrador', () => {
      const buddy = new Labrador('Buddy', 'golden');
      expect(buddy.swim()).toContain('swim');
    });

    it('should pass instanceof checks', () => {
      const buddy = new Labrador('Buddy', 'golden');

      expect(buddy instanceof Labrador).toBe(true);
      expect(buddy instanceof Dog).toBe(true);
      expect(buddy instanceof Animal).toBe(true);
      expect(buddy instanceof Object).toBe(true);
    });
  });

  describe('getPrototypeChain()', () => {
    it('should return chain ending with null', () => {
      const obj = { a: 1 };
      const chain = getPrototypeChain(obj);

      expect(chain[chain.length - 1]).toBe(null);
      expect(chain[0]).toBe(Object.prototype);
    });

    it('should return full chain for inherited objects', () => {
      const buddy = new Labrador('Buddy', 'golden');
      const chain = getPrototypeChain(buddy);

      expect(chain).toContain(Labrador.prototype);
      expect(chain).toContain(Dog.prototype);
      expect(chain).toContain(Animal.prototype);
      expect(chain).toContain(Object.prototype);
      expect(chain[chain.length - 1]).toBe(null);
    });
  });

  describe('deepClone()', () => {
    it('should clone simple objects', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should preserve prototype chain', () => {
      const original = new Dog('Rex', 'German Shepherd');
      const cloned = deepClone(original);

      expect(cloned instanceof Dog).toBe(true);
      expect(cloned.speak()).toContain('Woof');
    });

    it('should handle arrays', () => {
      const original = { arr: [1, 2, { nested: true }] };
      const cloned = deepClone(original);

      cloned.arr[2].nested = false;
      expect(original.arr[2].nested).toBe(true);
    });
  });

  describe('mixin()', () => {
    it('should copy methods from sources', () => {
      const target = {};
      const source1 = { method1: () => 'one' };
      const source2 = { method2: () => 'two' };

      mixin(target, source1, source2);

      expect(target.method1()).toBe('one');
      expect(target.method2()).toBe('two');
    });

    it('should work with prototypes', () => {
      const canSwim = { swim: function() { return `${this.name} swims`; } };
      const canFly = { fly: function() { return `${this.name} flies`; } };

      function Duck(name) { this.name = name; }
      mixin(Duck.prototype, canSwim, canFly);

      const donald = new Duck('Donald');
      expect(donald.swim()).toBe('Donald swims');
      expect(donald.fly()).toBe('Donald flies');
    });
  });

  describe('createObject()', () => {
    it('should create object with specified prototype', () => {
      const proto = { greet: function() { return `Hello, ${this.name}`; } };
      const obj = createObject(proto, { name: 'John' });

      expect(obj.greet()).toBe('Hello, John');
      expect(Object.getPrototypeOf(obj)).toBe(proto);
    });

    it('should have own properties', () => {
      const proto = { shared: true };
      const obj = createObject(proto, { own: 'value' });

      expect(obj.hasOwnProperty('own')).toBe(true);
      expect(obj.hasOwnProperty('shared')).toBe(false);
    });
  });
});
