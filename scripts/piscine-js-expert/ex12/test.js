import { describe, it, expect } from 'vitest';
import {
  createScope,
  analyzeScopes,
  findFreeVariables,
  createSandbox,
  demonstrateShadowing,
  demonstrateTDZ
} from './index.js';

describe('Ex12 - Scope Chain & Lexical Environment', () => {
  describe('createScope()', () => {
    it('should declare variables', () => {
      const scope = createScope();
      scope.declare('x', 10);
      expect(scope.lookup('x')).toBe(10);
    });

    it('should throw on duplicate declaration', () => {
      const scope = createScope();
      scope.declare('x', 10);
      expect(() => scope.declare('x', 20)).toThrow();
    });

    it('should assign to existing variables', () => {
      const scope = createScope();
      scope.declare('x', 10);
      scope.assign('x', 20);
      expect(scope.lookup('x')).toBe(20);
    });

    it('should throw on assignment to undeclared variable', () => {
      const scope = createScope();
      expect(() => scope.assign('x', 10)).toThrow();
    });

    it('should lookup in parent scope', () => {
      const parent = createScope();
      parent.declare('x', 10);

      const child = parent.createChild();
      expect(child.lookup('x')).toBe(10);
    });

    it('should shadow parent variables', () => {
      const parent = createScope();
      parent.declare('x', 10);

      const child = parent.createChild();
      child.declare('x', 100);

      expect(child.lookup('x')).toBe(100);
      expect(parent.lookup('x')).toBe(10);
    });

    it('should assign to parent scope variable', () => {
      const parent = createScope();
      parent.declare('x', 10);

      const child = parent.createChild();
      child.assign('x', 20);

      expect(parent.lookup('x')).toBe(20);
    });
  });

  describe('analyzeScopes()', () => {
    it('should identify global variables', () => {
      const code = `
        let x = 1;
        const y = 2;
        var z = 3;
      `;
      const result = analyzeScopes(code);
      expect(result.global).toContain('x');
      expect(result.global).toContain('y');
      expect(result.global).toContain('z');
    });

    it('should identify function scopes', () => {
      const code = `
        function foo() {
          let a = 1;
        }
      `;
      const result = analyzeScopes(code);
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('foo');
      expect(result.functions[0].vars).toContain('a');
    });
  });

  describe('findFreeVariables()', () => {
    it('should find free variables', () => {
      const x = 10;
      const fn = function() {
        return x + y;
      };
      void x;

      const freeVars = findFreeVariables(fn);
      expect(freeVars).toContain('x');
      expect(freeVars).toContain('y');
    });

    it('should not include local variables', () => {
      const fn = function() {
        const local = 1;
        return local;
      };

      const freeVars = findFreeVariables(fn);
      expect(freeVars).not.toContain('local');
    });
  });

  describe('createSandbox()', () => {
    it('should allow access to specified globals', () => {
      const sandbox = createSandbox(['Math']);
      const result = sandbox('Math.sqrt(16)');
      expect(result).toBe(4);
    });

    it('should block access to non-allowed globals', () => {
      const sandbox = createSandbox([]);
      expect(() => sandbox('console.log("hi")')).toThrow();
    });
  });

  describe('demonstrateShadowing()', () => {
    it('should show different values for outer and inner scope', () => {
      const result = demonstrateShadowing();
      expect(result.outer).not.toBe(result.inner);
    });
  });

  describe('demonstrateTDZ()', () => {
    it('should show TDZ error type', () => {
      const result = demonstrateTDZ();
      expect(result.errorType).toBe('ReferenceError');
      expect(result.afterDeclaration).toBeDefined();
    });
  });
});
