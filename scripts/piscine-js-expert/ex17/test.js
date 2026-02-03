import { describe, it, expect } from 'vitest';
import {
  mixin,
  canFly,
  canSwim,
  withPosition,
  withHealth,
  withInventory,
  createPlayer,
  createEntity,
  compose,
  createMixinFactory
} from './index.js';

describe('Ex17 - Mixins & Composition', () => {
  describe('mixin()', () => {
    it('should copy methods from source to target', () => {
      const target = {};
      mixin(target, { method1: () => 'one' });
      expect(target.method1()).toBe('one');
    });

    it('should copy from multiple sources', () => {
      const target = {};
      mixin(target, { a: 1 }, { b: 2 }, { c: 3 });
      expect(target).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should work with prototypes', () => {
      function Duck(name) { this.name = name; }
      mixin(Duck.prototype, canFly, canSwim);

      const donald = new Duck('Donald');
      expect(donald.fly()).toBe('Donald is flying');
      expect(donald.swim()).toBe('Donald is swimming');
    });
  });

  describe('canFly mixin', () => {
    it('should add fly and land methods', () => {
      const bird = { name: 'Eagle' };
      mixin(bird, canFly);

      expect(bird.fly()).toBe('Eagle is flying');
      expect(bird.land()).toBe('Eagle landed');
    });
  });

  describe('canSwim mixin', () => {
    it('should add swim and dive methods', () => {
      const fish = { name: 'Nemo' };
      mixin(fish, canSwim);

      expect(fish.swim()).toBe('Nemo is swimming');
      expect(fish.dive()).toBe('Nemo dived');
    });
  });

  describe('withPosition()', () => {
    it('should provide position methods', () => {
      const state = { x: 0, y: 0 };
      const pos = withPosition(state);

      expect(pos.getPosition()).toEqual({ x: 0, y: 0 });

      pos.setPosition(10, 20);
      expect(pos.getPosition()).toEqual({ x: 10, y: 20 });
    });
  });

  describe('withHealth()', () => {
    it('should provide health methods', () => {
      const state = { health: 100 };
      const health = withHealth(state);

      expect(health.getHealth()).toBe(100);

      health.damage(25);
      expect(health.getHealth()).toBe(75);

      health.heal(10);
      expect(health.getHealth()).toBe(85);
    });
  });

  describe('withInventory()', () => {
    it('should provide inventory methods', () => {
      const state = { inventory: [] };
      const inv = withInventory(state);

      inv.addItem('sword');
      inv.addItem('shield');
      expect(inv.getInventory()).toEqual(['sword', 'shield']);

      inv.removeItem('sword');
      expect(inv.getInventory()).toEqual(['shield']);
    });
  });

  describe('createPlayer()', () => {
    it('should create player with all behaviors', () => {
      const player = createPlayer('Hero');

      expect(player.name).toBe('Hero');
      expect(player.getPosition()).toBeDefined();
      expect(player.getHealth()).toBe(100);
      expect(player.getInventory()).toEqual([]);
    });

    it('should allow using all methods', () => {
      const player = createPlayer('Hero');

      player.setPosition(5, 10);
      player.damage(20);
      player.addItem('potion');

      expect(player.getPosition()).toEqual({ x: 5, y: 10 });
      expect(player.getHealth()).toBe(80);
      expect(player.getInventory()).toContain('potion');
    });
  });

  describe('createEntity()', () => {
    it('should create player with inventory', () => {
      const player = createEntity('player', 'Hero');
      expect(player.getInventory).toBeDefined();
    });

    it('should create enemy with attack', () => {
      const enemy = createEntity('enemy', 'Goblin');
      expect(enemy.attack).toBeDefined();
    });

    it('should create npc with talk', () => {
      const npc = createEntity('npc', 'Bob');
      expect(npc.talk()).toContain('Bob');
    });
  });

  describe('compose()', () => {
    it('should compose multiple behaviors', () => {
      const state = { x: 0, y: 0, health: 100 };
      const composed = compose(withPosition, withHealth);
      const entity = composed(state);

      expect(entity.getPosition).toBeDefined();
      expect(entity.getHealth).toBeDefined();
    });
  });

  describe('createMixinFactory()', () => {
    it('should create entities with selected mixins', () => {
      const factory = createMixinFactory({
        position: withPosition,
        health: withHealth,
        inventory: withInventory
      });

      const entity = factory(['position', 'health'], {
        x: 0, y: 0, health: 100
      });

      expect(entity.getPosition).toBeDefined();
      expect(entity.getHealth).toBeDefined();
      expect(entity.getInventory).toBeUndefined();
    });
  });
});
