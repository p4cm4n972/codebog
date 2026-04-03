# Ex05 - Binding Priority

## Objectif
Comprendre l'ordre de priorité des règles de binding `this`.

## Contexte
Quand plusieurs règles de binding pourraient s'appliquer, JavaScript suit un ordre de priorité strict :

**new > explicit (bind) > implicit > default**

## Instructions

### `priority1()` - new vs implicit
```javascript
function Person(name) {
  this.name = name;
}
const obj = {
  name: "obj",
  Person: Person
};
const p = new obj.Person("Alice");
return p.name;
```

### `priority2()` - bind vs implicit
```javascript
function greet() {
  return `Hello, ${this.name}`;
}
const obj = { name: "obj" };
const other = { name: "other" };
const bound = greet.bind(other);
obj.greet = bound;
return obj.greet();
```

### `priority3()` - new vs bind
```javascript
function Person(name) {
  this.name = name;
}
const bound = Person.bind({ name: "bound" });
const p = new bound("Alice");
return p.name;
```

### `priority4()` - explicit vs implicit
```javascript
function greet() {
  return `Hello, ${this.name}`;
}
const obj = {
  name: "obj",
  greet: greet
};
return obj.greet.call({ name: "call" });
```

## Indice
- `new` ignore le binding de `bind()`
- `bind` ignore le contexte d'appel (implicit)
- `call/apply` ont priorité sur implicit
- Default s'applique seulement si aucune autre règle ne match

## Concepts
- Binding priority chain
- new binding override
- Hard binding (bind)
- Rule precedence
