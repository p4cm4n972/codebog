# Ex00 - Call Stack

## Objectif
Comprendre l'exécution synchrone et la pile d'appels (call stack).

## Contexte
JavaScript est single-threaded : il ne peut exécuter qu'une seule chose à la fois. La **call stack** (pile d'appels) garde trace des fonctions en cours d'exécution. Quand une fonction est appelée, elle est empilée. Quand elle retourne, elle est dépilée.

## Instructions

### `stack1()` - Ordre d'exécution basique
```javascript
const result = [];

function first() {
  result.push("first start");
  second();
  result.push("first end");
}

function second() {
  result.push("second");
}

result.push("main start");
first();
result.push("main end");

return result;
```

### `stack2()` - Récursion et call stack
```javascript
const result = [];

function recursive(n) {
  if (n <= 0) return;
  result.push(n);
  recursive(n - 1);
  result.push(`done ${n}`);
}

recursive(3);
return result;
```

## Indice
- Le code synchrone s'exécute ligne par ligne
- Une fonction appelée doit terminer avant que l'appelant continue
- La récursion empile les appels, puis les dépile en ordre inverse (LIFO)

## Concepts
- Call stack (pile d'appels)
- Synchronous execution
- LIFO (Last In First Out)
- Stack frames
