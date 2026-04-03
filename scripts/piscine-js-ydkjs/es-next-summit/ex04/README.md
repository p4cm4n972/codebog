# Ex04 - Proxy & Reflect

## Objectif
Intercepter les opérations sur les objets avec Proxy.

## Contexte
`Proxy` permet de créer un objet qui intercepte les opérations fondamentales (lecture, écriture, appel, etc.). `Reflect` fournit les comportements par défaut de ces opérations.

## Instructions

### `proxy1()` - Trap get avec valeur par défaut
```javascript
const target = { a: 1, b: 2 };
const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : "default";
  }
};
const proxy = new Proxy(target, handler);
return [proxy.a, proxy.c];
```

### `proxy2()` - Trap set avec validation
```javascript
const target = { count: 0 };
const handler = {
  set(target, prop, value) {
    if (prop === "count" && typeof value !== "number") {
      throw new TypeError("count must be a number");
    }
    target[prop] = value;
    return true;
  }
};
const proxy = new Proxy(target, handler);
proxy.count = 5;
try {
  proxy.count = "invalid";
  return "no error";
} catch (e) {
  return [proxy.count, "TypeError"];
}
```

### `proxy3()` - Cacher des propriétés
```javascript
const target = { secret: "hidden", public: "visible" };
const handler = {
  get(target, prop) {
    if (prop === "secret") return undefined;
    return Reflect.get(target, prop);
  },
  has(target, prop) {
    if (prop === "secret") return false;
    return Reflect.has(target, prop);
  }
};
const proxy = new Proxy(target, handler);
return [proxy.secret, proxy.public, "secret" in proxy];
```

### `proxy4()` - Trap apply (fonctions)
```javascript
const calls = [];
const handler = {
  apply(target, thisArg, args) {
    calls.push(args);
    return Reflect.apply(target, thisArg, args);
  }
};

const sum = (a, b) => a + b;
const proxy = new Proxy(sum, handler);

const r1 = proxy(1, 2);
const r2 = proxy(3, 4);

return [r1, r2, calls];
```

## Indice
- Un handler définit des "traps" pour intercepter les opérations
- `Reflect` reproduit le comportement par défaut
- `get`, `set`, `has`, `apply` sont les traps les plus courants
- Les Proxies sont transparents (semblent être l'objet original)

## Concepts
- Proxy traps
- Reflect API
- Property interception
- Function interception
