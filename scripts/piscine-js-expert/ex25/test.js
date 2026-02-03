import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  reactive,
  effect,
  computed,
  ref,
  h,
  render,
  diff,
  patch,
  createComponent,
  mount
} from './index.js';

describe('Ex25 - Mini Framework Réactif', () => {
  describe('reactive()', () => {
    it('should make object reactive', () => {
      const state = reactive({ count: 0 });
      expect(state.count).toBe(0);
      state.count = 1;
      expect(state.count).toBe(1);
    });

    it('should trigger effects on change', () => {
      const state = reactive({ count: 0 });
      let effectCount = 0;

      effect(() => {
        effectCount++;
        state.count;
      });

      expect(effectCount).toBe(1);

      state.count = 1;
      expect(effectCount).toBe(2);
    });
  });

  describe('effect()', () => {
    it('should run immediately', () => {
      const fn = vi.fn();
      effect(fn);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should track dependencies', () => {
      const state = reactive({ a: 1, b: 2 });
      const fn = vi.fn(() => state.a);

      effect(fn);
      expect(fn).toHaveBeenCalledTimes(1);

      state.a = 10;
      expect(fn).toHaveBeenCalledTimes(2);

      state.b = 20;
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('computed()', () => {
    it('should compute value', () => {
      const state = reactive({ count: 1 });
      const double = computed(() => state.count * 2);

      expect(double.value).toBe(2);
    });

    it('should cache until dependency changes', () => {
      let computeCount = 0;
      const state = reactive({ count: 1 });
      const double = computed(() => {
        computeCount++;
        return state.count * 2;
      });

      double.value;
      double.value;
      expect(computeCount).toBe(1);

      state.count = 2;
      expect(double.value).toBe(4);
      expect(computeCount).toBe(2);
    });
  });

  describe('ref()', () => {
    it('should wrap value', () => {
      const count = ref(0);
      expect(count.value).toBe(0);
      count.value = 1;
      expect(count.value).toBe(1);
    });

    it('should be reactive', () => {
      const count = ref(0);
      let effectRan = 0;

      effect(() => {
        effectRan++;
        count.value;
      });

      expect(effectRan).toBe(1);
      count.value = 1;
      expect(effectRan).toBe(2);
    });
  });

  describe('h()', () => {
    it('should create vnode', () => {
      const vnode = h('div', { class: 'container' }, []);

      expect(vnode.tag).toBe('div');
      expect(vnode.props.class).toBe('container');
      expect(vnode.children).toEqual([]);
    });

    it('should handle nested vnodes', () => {
      const vnode = h('div', {}, [
        h('span', {}, ['Hello']),
        h('span', {}, ['World'])
      ]);

      expect(vnode.children).toHaveLength(2);
      expect(vnode.children[0].tag).toBe('span');
    });
  });

  describe('render()', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
    });

    it('should render simple element', () => {
      const vnode = h('div', { id: 'test' }, []);
      const el = render(vnode);

      expect(el.tagName).toBe('DIV');
      expect(el.id).toBe('test');
    });

    it('should render text children', () => {
      const vnode = h('p', {}, ['Hello World']);
      const el = render(vnode);

      expect(el.textContent).toBe('Hello World');
    });

    it('should render nested elements', () => {
      const vnode = h('div', {}, [
        h('span', {}, ['Child'])
      ]);
      const el = render(vnode);

      expect(el.children).toHaveLength(1);
      expect(el.children[0].tagName).toBe('SPAN');
    });
  });

  describe('diff()', () => {
    it('should detect attribute changes', () => {
      const oldNode = h('div', { class: 'old' }, []);
      const newNode = h('div', { class: 'new' }, []);

      const patches = diff(oldNode, newNode);

      expect(patches).toContainEqual(
        expect.objectContaining({ type: 'ATTR', key: 'class', value: 'new' })
      );
    });

    it('should detect added children', () => {
      const oldNode = h('div', {}, []);
      const newNode = h('div', {}, [h('span', {}, [])]);

      const patches = diff(oldNode, newNode);

      expect(patches.some(p => p.type === 'ADD')).toBe(true);
    });

    it('should detect removed children', () => {
      const oldNode = h('div', {}, [h('span', {}, [])]);
      const newNode = h('div', {}, []);

      const patches = diff(oldNode, newNode);

      expect(patches.some(p => p.type === 'REMOVE')).toBe(true);
    });
  });

  describe('createComponent()', () => {
    it('should create component with setup', () => {
      const Counter = createComponent({
        setup() {
          const count = ref(0);
          const increment = () => count.value++;
          return { count, increment };
        },
        render() {
          return h('button', { onClick: this.increment }, [
            `Count: ${this.count.value}`
          ]);
        }
      });

      expect(Counter.count.value).toBe(0);
      Counter.increment();
      expect(Counter.count.value).toBe(1);
    });
  });

  describe('mount()', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    it('should mount component to DOM', () => {
      const App = createComponent({
        setup() {
          return {};
        },
        render() {
          return h('div', { id: 'app' }, ['Hello']);
        }
      });

      mount(App, container);

      expect(container.querySelector('#app')).not.toBeNull();
      expect(container.textContent).toContain('Hello');
    });

    it('should return unmount function', () => {
      const App = createComponent({
        setup() { return {}; },
        render() { return h('div', {}, []); }
      });

      const { unmount } = mount(App, container);
      unmount();

      expect(container.innerHTML).toBe('');
    });
  });
});
