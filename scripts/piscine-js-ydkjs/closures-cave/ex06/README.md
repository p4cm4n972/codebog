# Ex06 - Partial Application

## Objectif
Fixer certains arguments d'une fonction via partial application.

## Contexte
La partial application permet de créer une nouvelle fonction en "pré-remplissant" certains arguments. C'est utile pour créer des fonctions spécialisées à partir de fonctions génériques.

## Instructions

### `partial(fn, ...fixedArgs)`
Implémente la partial application.

```javascript
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}
```

### `testPartial()`
```javascript
const greet = (greeting, punctuation, name) => {
  return `${greeting}, ${name}${punctuation}`;
};

const sayHello = partial(greet, "Hello", "!");
const sayHi = partial(greet, "Hi");

return [
  sayHello("Alice"),     // "Hello, Alice!"
  sayHi("?", "Bob")      // "Hi, Bob?"
];
```

### `partialWithPlaceholder(fn, ...args)` (Bonus)
Partial application avec placeholder pour sauter des arguments.

### `testPartialPlaceholder()`
```javascript
const _ = partialWithPlaceholder._;
const greet = (a, b, c) => `${a}-${b}-${c}`;
const fn = partialWithPlaceholder(greet, _, "middle", _);
return fn("first", "last");  // "first-middle-last"
```

## Indice
- Les `fixedArgs` sont capturés par la closure
- Les `remainingArgs` sont passés à l'appel
- Le placeholder (`_`) est un Symbol unique

## Concepts
- Partial application
- Function specialization
- Closure over arguments
- Placeholder pattern
