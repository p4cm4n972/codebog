# Ex12 - Invocation Patterns

## Objectif
Comprendre les 4 patterns d'invocation et leur effet sur `this`.

## 1. Method Invocation

```javascript
const obj = {
  name: 'Alice',
  greet() {
    return `Hello, ${this.name}`;  // this = obj
  }
};
obj.greet();  // 'Hello, Alice'
```

## 2. Function Invocation

```javascript
function greet() {
  return this;  // this = undefined (strict) ou global
}
greet();
```

## 3. Constructor Invocation

```javascript
function Person(name) {
  this.name = name;  // this = nouvel objet
}
const alice = new Person('Alice');
```

## 4. Apply/Call/Bind Invocation

```javascript
function greet() {
  return `Hello, ${this.name}`;
}

const context = { name: 'Alice' };

greet.call(context);           // 'Hello, Alice'
greet.apply(context);          // 'Hello, Alice'
const bound = greet.bind(context);
bound();                       // 'Hello, Alice'
```

## call vs apply

```javascript
fn.call(context, arg1, arg2);   // Arguments séparés
fn.apply(context, [arg1, arg2]); // Arguments en tableau
```
