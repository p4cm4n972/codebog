# 🎯 Piscine JS - Plan YDKJS

> **Philosophie**: Comprendre JavaScript en profondeur, pas résoudre des algorithmes.
> **Basé sur**: You Don't Know JS (YDKJS) de Kyle Simpson

---

## 📊 Vue d'Ensemble

| # | Monde | Exercices | Thème YDKJS |
|---|-------|-----------|-------------|
| 0 | **Welcome Valley** | 10 | **Get Started** |
| 1 | Primitives Lab | 8 | Types & Grammar |
| 2 | Scope Tower | 7 | Scope & Closures |
| 3 | Closures Cave | 8 | Scope & Closures |
| 4 | This Dojo | 7 | Objects & Classes |
| 5 | Prototype Chain | 8 | Objects & Classes |
| 6 | Async River | 8 | Sync & Async |
| 7 | ES.Next Summit | 6 | ES.Next & Beyond |
| **Total** | | **62** | |

---

## 🧪 Format des Exercices

Chaque exercice suit le pattern **"Prédis et Comprends"** :

```
exXX/
├── README.md      # Contexte YDKJS + questions
├── index.js       # Fonctions à compléter (retourner le résultat prédit)
└── test.js        # Validation des réponses
```

**Types d'exercices** :
- 🔮 **Prédiction** : Que retourne ce code ?
- 🔧 **Implémentation** : Crée une fonction qui démontre le concept
- 🐛 **Debug** : Trouve et explique le bug
- 📝 **Explication** : Retourne une string expliquant le comportement

---

## 🏡 Monde 0 : Welcome Valley (10 exercices)

> **Thème YDKJS** : Get Started
> **Objectif** : Découvrir JavaScript et ses fondamentaux - le point d'entrée pour tout apprenant

### ex00 - Hello JavaScript
**Concepts** : Console, premiers pas, syntaxe de base
**Difficulté** : ⭐

```javascript
// Bienvenue dans JavaScript !
// Complète les fonctions pour qu'elles retournent les bonnes valeurs

export function helloWorld() {
  // Retourne la string "Hello, World!"
  return ___;
}

export function addNumbers() {
  // Retourne la somme de 40 + 2
  return ___;
}

export function concatenate() {
  // Retourne "Hello" + " " + "JavaScript"
  return ___;
}

export function whatIsThis() {
  // Que retourne typeof "hello" ?
  return ___;
}
```

**Réponses attendues** :
- `helloWorld` → `"Hello, World!"`
- `addNumbers` → `42`
- `concatenate` → `"Hello JavaScript"`
- `whatIsThis` → `"string"`

---

### ex01 - Variables & Constants
**Concepts** : `let`, `const`, `var`, déclaration vs assignation
**Difficulté** : ⭐

```javascript
export function varTest() {
  // var peut être redéclaré
  var x = 1;
  var x = 2;
  return x;
}

export function letTest() {
  // let peut être réassigné mais pas redéclaré
  let y = 1;
  y = 2;
  return y;
}

export function constTest() {
  // const ne peut pas être réassigné
  const z = 42;
  // z = 100; // Erreur !
  return z;
}

export function constObject() {
  // const empêche la réassignation, pas la mutation
  const obj = { name: "Alice" };
  obj.name = "Bob";
  return obj.name;
}

export function namingConventions() {
  // Conventions de nommage en JS
  const firstName = "camelCase pour les variables";
  const CONSTANT_VALUE = "SCREAMING_SNAKE_CASE pour les constantes";
  return [firstName.includes("camelCase"), CONSTANT_VALUE.includes("SNAKE")];
}
```

**Réponses attendues** :
- `varTest` → `2`
- `letTest` → `2`
- `constTest` → `42`
- `constObject` → `"Bob"` (const n'empêche pas la mutation)
- `namingConventions` → `[true, true]`

---

### ex02 - Primitive Types
**Concepts** : Les 7 types primitifs de JS
**Difficulté** : ⭐

```javascript
// JavaScript a 7 types primitifs

export function stringType() {
  const greeting = "Hello";
  const template = `Value: ${42}`;
  return [typeof greeting, template];
}

export function numberType() {
  const integer = 42;
  const float = 3.14;
  const infinity = Infinity;
  const notANumber = NaN;
  // Tous sont de type "number" !
  return [typeof integer, typeof float, typeof notANumber];
}

export function booleanType() {
  const isTrue = true;
  const isFalse = false;
  return typeof isTrue;
}

export function nullAndUndefined() {
  let notAssigned;
  const intentionallyEmpty = null;
  return [typeof notAssigned, typeof intentionallyEmpty];
}

export function symbolType() {
  const sym = Symbol("description");
  return typeof sym;
}

export function bigIntType() {
  const big = 9007199254740991n;
  return typeof big;
}

// Liste tous les types primitifs
export function allPrimitives() {
  return [
    "string",
    "number",
    "boolean",
    "undefined",
    "null",      // Note: typeof null === "object" (bug historique)
    "symbol",
    "bigint"
  ];
}
```

**Réponses attendues** :
- `stringType` → `["string", "Value: 42"]`
- `numberType` → `["number", "number", "number"]`
- `booleanType` → `"boolean"`
- `nullAndUndefined` → `["undefined", "object"]` (typeof null est "object"!)
- `symbolType` → `"symbol"`
- `bigIntType` → `"bigint"`

---

### ex03 - Arrays Introduction
**Concepts** : Arrays, index, méthodes de base
**Difficulté** : ⭐

```javascript
export function createArray() {
  const fruits = ["apple", "banana", "cherry"];
  return fruits.length;
}

export function accessElements() {
  const colors = ["red", "green", "blue"];
  // Les index commencent à 0
  return [colors[0], colors[2], colors[10]];
}

export function modifyArray() {
  const numbers = [1, 2, 3];
  numbers.push(4);        // Ajoute à la fin
  numbers.unshift(0);     // Ajoute au début
  return numbers;
}

export function arrayMethods() {
  const arr = [1, 2, 3, 4, 5];
  const doubled = arr.map(x => x * 2);
  const evens = arr.filter(x => x % 2 === 0);
  const sum = arr.reduce((acc, x) => acc + x, 0);
  return [doubled, evens, sum];
}

export function spreadArray() {
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  const combined = [...arr1, ...arr2];
  return combined;
}
```

**Réponses attendues** :
- `createArray` → `3`
- `accessElements` → `["red", "blue", undefined]`
- `modifyArray` → `[0, 1, 2, 3, 4]`
- `arrayMethods` → `[[2,4,6,8,10], [2,4], 15]`
- `spreadArray` → `[1, 2, 3, 4]`

---

### ex04 - Objects Introduction
**Concepts** : Objets, propriétés, notation point/bracket
**Difficulté** : ⭐

```javascript
export function createObject() {
  const person = {
    name: "Alice",
    age: 30,
    city: "Paris"
  };
  return person.name;
}

export function accessProperty() {
  const car = { brand: "Tesla", model: "Model 3" };
  const key = "model";
  // Deux façons d'accéder
  return [car.brand, car[key]];
}

export function modifyObject() {
  const user = { name: "Bob" };
  user.age = 25;           // Ajouter une propriété
  user.name = "Robert";    // Modifier
  delete user.age;         // Supprimer
  return user;
}

export function objectShorthand() {
  const name = "Charlie";
  const age = 35;
  // Shorthand property names (ES6)
  const person = { name, age };
  return person;
}

export function nestedObject() {
  const company = {
    name: "TechCorp",
    address: {
      city: "Lyon",
      zip: "69000"
    }
  };
  return company.address.city;
}

export function objectMethods() {
  const obj = { a: 1, b: 2, c: 3 };
  return [
    Object.keys(obj),
    Object.values(obj),
    Object.entries(obj)
  ];
}
```

**Réponses attendues** :
- `createObject` → `"Alice"`
- `accessProperty` → `["Tesla", "Model 3"]`
- `modifyObject` → `{ name: "Robert" }`
- `objectShorthand` → `{ name: "Charlie", age: 35 }`
- `nestedObject` → `"Lyon"`
- `objectMethods` → `[["a","b","c"], [1,2,3], [["a",1],["b",2],["c",3]]]`

---

### ex05 - Functions Basics
**Concepts** : Déclaration, expression, arrow functions
**Difficulté** : ⭐

```javascript
// Trois façons de déclarer une fonction

// 1. Function Declaration
export function greet(name) {
  return `Hello, ${name}!`;
}

// 2. Function Expression
export const multiply = function(a, b) {
  return a * b;
};

// 3. Arrow Function (ES6)
export const divide = (a, b) => a / b;

// Arrow avec un seul paramètre (parenthèses optionnelles)
export const double = x => x * 2;

// Arrow avec corps de fonction
export const greetFormal = (name) => {
  const greeting = `Good morning, ${name}`;
  return greeting;
};

// Tests
export function testFunctions() {
  return [
    greet("Alice"),
    multiply(3, 4),
    divide(10, 2),
    double(21)
  ];
}

// Default parameters
export function greetWithDefault(name = "Guest") {
  return `Welcome, ${name}!`;
}

export function testDefaults() {
  return [greetWithDefault(), greetWithDefault("Bob")];
}
```

**Réponses attendues** :
- `testFunctions` → `["Hello, Alice!", 12, 5, 42]`
- `testDefaults` → `["Welcome, Guest!", "Welcome, Bob!"]`

---

### ex06 - Conditionals
**Concepts** : if/else, ternaire, switch, truthy/falsy
**Difficulté** : ⭐

```javascript
export function ifElse(age) {
  if (age >= 18) {
    return "adult";
  } else if (age >= 13) {
    return "teenager";
  } else {
    return "child";
  }
}

export function ternary(isLoggedIn) {
  // condition ? valueIfTrue : valueIfFalse
  return isLoggedIn ? "Welcome back!" : "Please log in";
}

export function switchCase(day) {
  switch (day) {
    case "monday":
    case "tuesday":
    case "wednesday":
    case "thursday":
    case "friday":
      return "weekday";
    case "saturday":
    case "sunday":
      return "weekend";
    default:
      return "unknown";
  }
}

// Truthy et Falsy
export function isTruthy(value) {
  if (value) {
    return true;
  }
  return false;
}

export function testTruthy() {
  return [
    isTruthy("hello"),  // string non-vide = truthy
    isTruthy(""),       // string vide = falsy
    isTruthy(42),       // number non-zéro = truthy
    isTruthy(0),        // zéro = falsy
    isTruthy([]),       // array vide = truthy (!)
    isTruthy(null)      // null = falsy
  ];
}

// Logical operators
export function logicalOps() {
  const a = true && "yes";   // Si true, retourne "yes"
  const b = false || "no";   // Si false, retourne "no"
  const c = null ?? "default"; // Nullish coalescing
  return [a, b, c];
}
```

**Réponses attendues** :
- `ifElse(25)` → `"adult"`
- `ifElse(15)` → `"teenager"`
- `ternary(true)` → `"Welcome back!"`
- `switchCase("monday")` → `"weekday"`
- `testTruthy` → `[true, false, true, false, true, false]`
- `logicalOps` → `["yes", "no", "default"]`

---

### ex07 - Loops
**Concepts** : for, while, for...of, for...in
**Difficulté** : ⭐

```javascript
export function forLoop() {
  let sum = 0;
  for (let i = 1; i <= 5; i++) {
    sum += i;
  }
  return sum; // 1+2+3+4+5
}

export function whileLoop() {
  let count = 0;
  let i = 0;
  while (i < 10) {
    count++;
    i += 2;
  }
  return count;
}

export function forOfLoop() {
  // for...of itère sur les VALEURS (arrays, strings)
  const fruits = ["apple", "banana", "cherry"];
  const result = [];
  for (const fruit of fruits) {
    result.push(fruit.toUpperCase());
  }
  return result;
}

export function forInLoop() {
  // for...in itère sur les CLÉS (objets)
  const person = { name: "Alice", age: 30 };
  const keys = [];
  for (const key in person) {
    keys.push(key);
  }
  return keys;
}

export function breakAndContinue() {
  const result = [];
  for (let i = 0; i < 10; i++) {
    if (i === 3) continue; // Saute 3
    if (i === 7) break;    // Arrête à 7
    result.push(i);
  }
  return result;
}

// Modern: forEach, map, filter
export function modernLoops() {
  const numbers = [1, 2, 3, 4, 5];

  // forEach - juste itérer (ne retourne rien)
  let sum = 0;
  numbers.forEach(n => sum += n);

  // map - transformer
  const doubled = numbers.map(n => n * 2);

  // filter - filtrer
  const evens = numbers.filter(n => n % 2 === 0);

  return [sum, doubled, evens];
}
```

**Réponses attendues** :
- `forLoop` → `15`
- `whileLoop` → `5`
- `forOfLoop` → `["APPLE", "BANANA", "CHERRY"]`
- `forInLoop` → `["name", "age"]`
- `breakAndContinue` → `[0, 1, 2, 4, 5, 6]`
- `modernLoops` → `[15, [2,4,6,8,10], [2,4]]`

---

### ex08 - Template Literals
**Concepts** : Backticks, interpolation, multiline strings
**Difficulté** : ⭐

```javascript
export function basicInterpolation() {
  const name = "Alice";
  const age = 30;
  // Les backticks permettent l'interpolation
  return `${name} is ${age} years old`;
}

export function expressionInterpolation() {
  const a = 5;
  const b = 3;
  // On peut mettre des expressions
  return `${a} + ${b} = ${a + b}`;
}

export function multilineString() {
  // Les template literals préservent les retours à la ligne
  const html = `
    <div>
      <h1>Title</h1>
    </div>
  `;
  return html.includes("\n");
}

export function nestedTemplates() {
  const items = ["apple", "banana", "cherry"];
  return `Items: ${items.map(i => `<li>${i}</li>`).join("")}`;
}

export function taggedTemplate() {
  // Les tagged templates sont des fonctions
  function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
      return result + str + (values[i] ? `**${values[i]}**` : "");
    }, "");
  }

  const name = "JavaScript";
  return highlight`I love ${name}!`;
}

// Comparer les trois types de strings
export function stringTypes() {
  const single = 'single quotes';
  const double = "double quotes";
  const template = `template literal`;

  // Seuls les template literals supportent l'interpolation
  const x = 42;
  return [
    'Value: ${x}',     // Littéral, pas d'interpolation
    `Value: ${x}`      // Interpolé
  ];
}
```

**Réponses attendues** :
- `basicInterpolation` → `"Alice is 30 years old"`
- `expressionInterpolation` → `"5 + 3 = 8"`
- `multilineString` → `true`
- `nestedTemplates` → `"Items: <li>apple</li><li>banana</li><li>cherry</li>"`
- `taggedTemplate` → `"I love **JavaScript**!"`
- `stringTypes` → `["Value: ${x}", "Value: 42"]`

---

### ex09 - Comparisons & Equality
**Concepts** : `==` vs `===`, comparaisons
**Difficulté** : ⭐⭐

```javascript
// Règle d'or: TOUJOURS utiliser === sauf cas très spécifique

export function strictEquality() {
  // === compare valeur ET type
  return [
    5 === 5,           // true
    5 === "5",         // false (types différents)
    null === undefined // false
  ];
}

export function looseEquality() {
  // == fait de la coercion (conversion de type)
  // À ÉVITER dans la plupart des cas
  return [
    5 == "5",          // true (string converti en number)
    null == undefined, // true (cas spécial)
    0 == false,        // true
    "" == false        // true
  ];
}

export function comparisonOperators() {
  return [
    5 > 3,     // true
    5 >= 5,    // true
    3 < 5,     // true
    3 <= 3,    // true
    5 !== "5"  // true (strict not equal)
  ];
}

export function stringComparison() {
  // Les strings sont comparées lexicographiquement
  return [
    "apple" < "banana",  // true (a < b)
    "10" < "9",          // true (comparaison de strings!)
    10 < 9               // false (comparaison de numbers)
  ];
}

export function objectComparison() {
  const obj1 = { a: 1 };
  const obj2 = { a: 1 };
  const obj3 = obj1;

  // Les objets sont comparés par référence, pas par valeur
  return [
    obj1 === obj2, // false (références différentes)
    obj1 === obj3  // true (même référence)
  ];
}

// Bonnes pratiques
export function bestPractice(value) {
  // Utiliser === pour la plupart des comparaisons
  if (value === null || value === undefined) {
    return "empty";
  }
  // Seul cas où == est acceptable: vérifier null/undefined ensemble
  // if (value == null) { } // équivalent à (value === null || value === undefined)
  return "has value";
}
```

**Réponses attendues** :
- `strictEquality` → `[true, false, false]`
- `looseEquality` → `[true, true, true, true]`
- `comparisonOperators` → `[true, true, true, true, true]`
- `stringComparison` → `[true, true, false]`
- `objectComparison` → `[false, true]`

---

## 🌍 Monde 1 : Primitives Lab (8 exercices)

> **Thème YDKJS** : Types & Grammar
> **Objectif** : Maîtriser les types primitifs et la coercion (conversion implicite)

### ex00 - Type Coercion Basics
**Concepts** : Coercion implicite, opérateur `+`
**Difficulté** : ⭐

```javascript
// Prédis le résultat de chaque expression

export function quiz1() {
  // [] + {}
  return ___;
}

export function quiz2() {
  // {} + []
  return ___;
}

export function quiz3() {
  // [] + []
  return ___;
}

export function quiz4() {
  // {} + {}
  return ___;
}

export function quiz5() {
  // "5" + 3
  return ___;
}

export function quiz6() {
  // "5" - 3
  return ___;
}
```

**Réponses attendues** :
- `quiz1` → `"[object Object]"` (array toString + object toString)
- `quiz2` → `0` (block vide + array converti en number)
- `quiz3` → `""` (deux strings vides concaténées)
- `quiz4` → `"[object Object][object Object]"`
- `quiz5` → `"53"` (string concat)
- `quiz6` → `2` (coercion to number)

---

### ex01 - Equality Operators
**Concepts** : `==` vs `===`, Abstract Equality Algorithm
**Difficulté** : ⭐⭐

```javascript
// Retourne true ou false pour chaque comparaison

export function eq1() {
  // null == undefined
  return ___;
}

export function eq2() {
  // null === undefined
  return ___;
}

export function eq3() {
  // NaN == NaN
  return ___;
}

export function eq4() {
  // [] == false
  return ___;
}

export function eq5() {
  // [] == ![]
  return ___;
}

export function eq6() {
  // "0" == false
  return ___;
}

export function eq7() {
  // " \t\n" == 0
  return ___;
}
```

**Réponses attendues** :
- `eq1` → `true` (spec: null/undefined sont égaux avec ==)
- `eq2` → `false` (types différents)
- `eq3` → `false` (NaN n'est égal à rien, même lui-même)
- `eq4` → `true` ([] → "" → 0, false → 0)
- `eq5` → `true` (![] → false, [] == false → true)
- `eq6` → `true` ("0" → 0, false → 0)
- `eq7` → `true` (whitespace string → 0)

---

### ex02 - NaN & Infinity
**Concepts** : `NaN`, `Infinity`, `isNaN` vs `Number.isNaN`
**Difficulté** : ⭐⭐

```javascript
export function nan1() {
  // typeof NaN
  return ___;
}

export function nan2() {
  // isNaN("hello")
  return ___;
}

export function nan3() {
  // Number.isNaN("hello")
  return ___;
}

export function nan4() {
  // NaN === NaN
  return ___;
}

export function nan5() {
  // Object.is(NaN, NaN)
  return ___;
}

export function inf1() {
  // 1 / 0
  return ___;
}

export function inf2() {
  // -1 / 0
  return ___;
}

export function inf3() {
  // Infinity - Infinity
  return ___;
}

export function inf4() {
  // 0 / 0
  return ___;
}
```

**Réponses attendues** :
- `nan1` → `"number"` (NaN est de type number!)
- `nan2` → `true` (isNaN coerce d'abord en number)
- `nan3` → `false` (Number.isNaN vérifie le type d'abord)
- `nan4` → `false`
- `nan5` → `true` (Object.is gère NaN correctement)
- `inf1` → `Infinity`
- `inf2` → `-Infinity`
- `inf3` → `NaN`
- `inf4` → `NaN`

---

### ex03 - Strings & Unicode
**Concepts** : UTF-16, surrogate pairs, codepoints
**Difficulté** : ⭐⭐⭐

```javascript
export function str1() {
  // "café".length
  return ___;
}

export function str2() {
  // "👨‍👩‍👧".length
  return ___;
}

export function str3() {
  // "👨‍👩‍👧".split("").length
  return ___;
}

export function str4() {
  // [...'👨‍👩‍👧'].length
  return ___;
}

export function str5() {
  // "é" === "é" (un seul char vs e + combining accent)
  const a = "é";       // \u00E9
  const b = "e\u0301"; // e + combining acute
  return a === b;
}

export function str6() {
  // "é".normalize() === "e\u0301".normalize()
  const a = "é".normalize();
  const b = "e\u0301".normalize();
  return a === b;
}
```

**Réponses attendues** :
- `str1` → `4`
- `str2` → `8` (emoji famille = plusieurs codepoints + ZWJ)
- `str3` → `8`
- `str4` → `5` (spread sépare par codepoint, pas par grapheme)
- `str5` → `false` (représentations différentes)
- `str6` → `true` (normalize unifie)

---

### ex04 - typeof Quirks
**Concepts** : Opérateur `typeof`, ses bizarreries historiques
**Difficulté** : ⭐

```javascript
export function type1() {
  return typeof undefined;
}

export function type2() {
  return typeof null;
}

export function type3() {
  return typeof function() {};
}

export function type4() {
  return typeof [];
}

export function type5() {
  return typeof Symbol("test");
}

export function type6() {
  return typeof 42n;
}

export function type7() {
  // Variable non déclarée
  return typeof undeclaredVariable;
}
```

**Réponses attendues** :
- `type1` → `"undefined"`
- `type2` → `"object"` (bug historique!)
- `type3` → `"function"` (sous-type spécial)
- `type4` → `"object"`
- `type5` → `"symbol"`
- `type6` → `"bigint"`
- `type7` → `"undefined"` (typeof ne throw pas sur undeclared)

---

### ex05 - Boxing & Unboxing
**Concepts** : Primitive wrappers, auto-boxing
**Difficulté** : ⭐⭐

```javascript
export function box1() {
  // "hello".toUpperCase() fonctionne, pourquoi ?
  // Retourne le type de l'objet temporaire créé
  const temp = Object("hello");
  return typeof temp;
}

export function box2() {
  const str = "hello";
  str.custom = "test";
  return str.custom;
}

export function box3() {
  const strObj = new String("hello");
  strObj.custom = "test";
  return strObj.custom;
}

export function box4() {
  return typeof new Number(42);
}

export function box5() {
  return new Number(42) === 42;
}

export function box6() {
  return new Number(42) == 42;
}
```

**Réponses attendues** :
- `box1` → `"object"`
- `box2` → `undefined` (propriété ajoutée sur objet temporaire, perdue)
- `box3` → `"test"` (objet persistant)
- `box4` → `"object"`
- `box5` → `false` (types différents)
- `box6` → `true` (coercion vers primitif)

---

### ex06 - Falsy Values
**Concepts** : Les 7 valeurs falsy, double negation
**Difficulté** : ⭐

```javascript
// Retourne true si la valeur est falsy, false sinon

export function isFalsy(value) {
  return !value;
}

// Liste les 7 valeurs falsy
export function getAllFalsyValues() {
  return [
    ___,
    ___,
    ___,
    ___,
    ___,
    ___,
    ___
  ];
}

// Questions bonus
export function falsy1() {
  return !![];
}

export function falsy2() {
  return !!"";
}

export function falsy3() {
  return !!"false";
}

export function falsy4() {
  return !!new Boolean(false);
}
```

**Réponses attendues** :
- `getAllFalsyValues` → `[false, 0, -0, 0n, "", null, undefined, NaN]` (8 en fait avec -0 et 0n)
- `falsy1` → `true` (array vide est truthy!)
- `falsy2` → `false`
- `falsy3` → `true` (string non-vide)
- `falsy4` → `true` (objet, donc truthy!)

---

### ex07 - BigInt & Symbols
**Concepts** : Nouveaux primitifs ES6+
**Difficulté** : ⭐⭐

```javascript
export function bigint1() {
  return typeof 42n;
}

export function bigint2() {
  // 42n === 42
  return 42n === 42;
}

export function bigint3() {
  // 42n == 42
  return 42n == 42;
}

export function bigint4() {
  // Peut-on mélanger BigInt et Number dans une opération ?
  try {
    return 42n + 1;
  } catch (e) {
    return "TypeError";
  }
}

export function symbol1() {
  return typeof Symbol("test");
}

export function symbol2() {
  return Symbol("test") === Symbol("test");
}

export function symbol3() {
  return Symbol.for("test") === Symbol.for("test");
}

export function symbol4() {
  const sym = Symbol("hidden");
  const obj = { [sym]: "secret", visible: "public" };
  return Object.keys(obj).length;
}
```

**Réponses attendues** :
- `bigint1` → `"bigint"`
- `bigint2` → `false` (types différents)
- `bigint3` → `true` (coercion)
- `bigint4` → `"TypeError"` (pas de mélange implicite)
- `symbol1` → `"symbol"`
- `symbol2` → `false` (chaque Symbol est unique)
- `symbol3` → `true` (Symbol.for utilise un registre global)
- `symbol4` → `1` (symbols non énumérables par Object.keys)

---

## 🏰 Monde 2 : Scope Tower (7 exercices)

> **Thème YDKJS** : Scope & Closures
> **Objectif** : Comprendre la résolution des variables et le hoisting

### ex00 - Lexical Scope
**Concepts** : Scope lexical, résolution de variables
**Difficulté** : ⭐

```javascript
export function scope1() {
  const x = 1;
  function inner() {
    return x;
  }
  return inner();
}

export function scope2() {
  const x = 1;
  function inner() {
    const x = 2;
    return x;
  }
  return inner();
}

export function scope3() {
  const x = 1;
  function inner() {
    const x = 2;
    function deeper() {
      return x;
    }
    return deeper();
  }
  return inner();
}

export function scope4() {
  const x = "outer";
  function inner(x) {
    return x;
  }
  return inner("param");
}
```

**Réponses attendues** :
- `scope1` → `1`
- `scope2` → `2` (shadowing)
- `scope3` → `2`
- `scope4` → `"param"` (paramètre shadow la variable externe)

---

### ex01 - Hoisting Deep Dive
**Concepts** : Hoisting de var, let, const, function
**Difficulté** : ⭐⭐

```javascript
export function hoist1() {
  console.log(x);
  var x = 5;
  return x;
}
// Que log console.log(x) ? Retourne "undefined" ou "5" ou "ReferenceError"

export function hoist1Answer() {
  return ___; // Ce que console.log affiche
}

export function hoist2() {
  return typeof foo;
  function foo() {}
}

export function hoist3() {
  return typeof bar;
  var bar = function() {};
}

export function hoist4() {
  try {
    console.log(x);
    let x = 5;
    return "no error";
  } catch (e) {
    return "ReferenceError";
  }
}

export function hoist5() {
  var x = 1;
  function inner() {
    console.log(x);
    var x = 2;
    return x;
  }
  return inner();
  // Que log le console.log dans inner ?
}

export function hoist5Answer() {
  return ___; // Ce que console.log affiche dans inner
}
```

**Réponses attendues** :
- `hoist1Answer` → `undefined` (var hoisted, mais pas l'assignation)
- `hoist2` → `"function"` (function hoisted entièrement)
- `hoist3` → `"undefined"` (var hoisted, pas la function expression)
- `hoist4` → `"ReferenceError"` (TDZ pour let)
- `hoist5Answer` → `undefined` (var x interne hoisted)

---

### ex02 - TDZ (Temporal Dead Zone)
**Concepts** : TDZ pour let/const, différence avec var
**Difficulté** : ⭐⭐

```javascript
export function tdz1() {
  try {
    x = 5;
    let x;
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }
}

export function tdz2() {
  try {
    const x = x;
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }
}

export function tdz3() {
  let x = 1;
  {
    try {
      console.log(x); // x du bloc interne
      let x = 2;
      return "ok";
    } catch (e) {
      return "ReferenceError";
    }
  }
}

export function tdz4() {
  // typeof sur variable non déclarée vs TDZ
  try {
    return typeof undeclared;
  } catch (e) {
    return "error";
  }
}

export function tdz5() {
  try {
    return typeof x;
    let x;
  } catch (e) {
    return "ReferenceError";
  }
}
```

**Réponses attendues** :
- `tdz1` → `"ReferenceError"` (assignation dans TDZ)
- `tdz2` → `"ReferenceError"` (auto-référence dans TDZ)
- `tdz3` → `"ReferenceError"` (let interne crée TDZ)
- `tdz4` → `"undefined"` (typeof sur undeclared = safe)
- `tdz5` → `"ReferenceError"` (typeof ne protège pas de TDZ)

---

### ex03 - Block Scope
**Concepts** : Scope de bloc pour let/const, for loops
**Difficulté** : ⭐⭐

```javascript
export function block1() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  return typeof x;
}

export function block2() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  try {
    return y;
  } catch (e) {
    return "ReferenceError";
  }
}

export function block3() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(() => i);
  }
  return funcs.map(f => f());
}

export function block4() {
  const funcs = [];
  for (let i = 0; i < 3; i++) {
    funcs.push(() => i);
  }
  return funcs.map(f => f());
}

export function block5() {
  try {
    for (const i = 0; i < 3; i++) {
      // const dans for...
    }
    return "ok";
  } catch (e) {
    return "TypeError";
  }
}
```

**Réponses attendues** :
- `block1` → `"number"` (var n'est pas block-scoped)
- `block2` → `"ReferenceError"` (let est block-scoped)
- `block3` → `[3, 3, 3]` (var partagé)
- `block4` → `[0, 1, 2]` (let rebind à chaque itération)
- `block5` → `"TypeError"` (const ne peut pas être réassigné)

---

### ex04 - Global Pollution
**Concepts** : Variables globales implicites, globalThis
**Difficulté** : ⭐⭐

```javascript
export function global1() {
  // En mode non-strict
  function sloppy() {
    x = 5; // pas de var/let/const
  }
  sloppy();
  return typeof globalThis.x;
}

export function global2() {
  "use strict";
  try {
    y = 5;
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }
}

export function global3() {
  var myVar = 1;
  return globalThis.myVar === myVar;
}

export function global4() {
  globalThis.myGlobal = 42;
  return myGlobal;
}

export function global5() {
  // Différence entre propriété globale et variable
  globalThis.test = 1;
  var test = 2;
  return [globalThis.test, test];
}
```

**Réponses attendues** :
- `global1` → `"number"` (global implicite en mode sloppy)
- `global2` → `"ReferenceError"` (strict mode interdit)
- `global3` → `false` (var dans function != propriété globale)
- `global4` → `42` (propriété globale accessible comme variable)
- `global5` → `[1, 2]` (var shadow la propriété globale)

---

### ex05 - Dynamic Scope Dangers (Legacy)
**Concepts** : Pourquoi certaines constructions legacy sont dangereuses
**Difficulté** : ⭐⭐⭐

> ⚠️ **AVERTISSEMENT SÉCURITÉ** : Cet exercice est purement éducatif.
> Les constructions montrées ici (dynamic code execution) ne doivent
> JAMAIS être utilisées en production car elles créent des failles de sécurité.

```javascript
// Cet exercice explique POURQUOI ces patterns sont dangereux
// et doivent être évités.

export function explainDynamicScopeDangers() {
  // Lister les dangers de l'exécution dynamique de code
  return [
    "Injection de code malveillant possible",
    "Modification imprévue du scope parent",
    "Performance dégradée (pas d'optimisation par le moteur)",
    "Code difficile à analyser et débugger",
    "Impossible à typer statiquement"
  ];
}

export function safeAlternatives() {
  // Alternatives sûres pour les cas d'usage courants
  return {
    "parser JSON": "JSON.parse()",
    "templates": "Template literals ou moteur de template",
    "configuration": "Objets/Maps avec clés prédéfinies",
    "dispatch dynamique": "Pattern Strategy avec Map de fonctions"
  };
}

// Exemple de pattern Strategy sûr (alternative au code dynamique)
export function safeDispatch() {
  const handlers = new Map([
    ["add", (a, b) => a + b],
    ["multiply", (a, b) => a * b],
    ["subtract", (a, b) => a - b]
  ]);

  function execute(operation, a, b) {
    const handler = handlers.get(operation);
    if (!handler) throw new Error(`Unknown operation: ${operation}`);
    return handler(a, b);
  }

  return execute("add", 5, 3); // 8
}
```

**Réponses attendues** :
- `explainDynamicScopeDangers` → liste des 5 dangers
- `safeAlternatives` → objet avec alternatives sûres
- `safeDispatch` → `8`

---

### ex06 - Scope Chain
**Concepts** : Chaîne de scope, résolution multi-niveaux
**Difficulté** : ⭐⭐

```javascript
const globalVar = "global";

export function chain1() {
  const level1 = "level1";

  function outer() {
    const level2 = "level2";

    function inner() {
      const level3 = "level3";
      return [globalVar, level1, level2, level3];
    }

    return inner();
  }

  return outer();
}

export function chain2() {
  const x = 1;

  function a() {
    const x = 2;
    return b();
  }

  function b() {
    return x; // Quel x ?
  }

  return a();
}

export function chain3() {
  function outer() {
    const secret = "hidden";

    return {
      getSecret: () => secret,
      setSecret: (val) => { /* impossible car const */ }
    };
  }

  const obj = outer();
  return obj.getSecret();
}
```

**Réponses attendues** :
- `chain1` → `["global", "level1", "level2", "level3"]`
- `chain2` → `1` (scope lexical, pas dynamique!)
- `chain3` → `"hidden"`

---

## 🕳️ Monde 3 : Closures Cave (8 exercices)

> **Thème YDKJS** : Scope & Closures (partie 2)
> **Objectif** : Maîtriser les closures et leurs applications

### ex00 - Closure Basics
**Concepts** : Définition d'une closure, environnement capturé
**Difficulté** : ⭐

```javascript
export function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

export function testClosure1() {
  const counter = createCounter();
  return [counter(), counter(), counter()];
}

export function testClosure2() {
  const c1 = createCounter();
  const c2 = createCounter();
  c1();
  c1();
  c2();
  return [c1(), c2()];
}

export function testClosure3() {
  function outer(x) {
    return function(y) {
      return x + y;
    };
  }
  const add5 = outer(5);
  const add10 = outer(10);
  return [add5(3), add10(3)];
}
```

**Réponses attendues** :
- `testClosure1` → `[1, 2, 3]`
- `testClosure2` → `[3, 2]` (closures indépendantes)
- `testClosure3` → `[8, 13]`

---

### ex01 - Loop Closure Trap
**Concepts** : Le piège classique de la closure dans une boucle
**Difficulté** : ⭐⭐

```javascript
export function loopTrap1() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(function() {
      return i;
    });
  }
  return funcs.map(f => f());
}

export function loopFixed1() {
  const funcs = [];
  for (let i = 0; i < 3; i++) {
    funcs.push(function() {
      return i;
    });
  }
  return funcs.map(f => f());
}

export function loopFixed2() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    (function(j) {
      funcs.push(function() {
        return j;
      });
    })(i);
  }
  return funcs.map(f => f());
}

export function loopTrap2() {
  const buttons = [];
  for (var i = 0; i < 3; i++) {
    buttons.push({
      index: i,
      click: function() {
        return this.index;
      }
    });
  }
  return buttons.map(b => b.click());
}
```

**Réponses attendues** :
- `loopTrap1` → `[3, 3, 3]`
- `loopFixed1` → `[0, 1, 2]`
- `loopFixed2` → `[0, 1, 2]`
- `loopTrap2` → `[0, 1, 2]` (this.index, pas closure sur i)

---

### ex02 - Module Pattern
**Concepts** : Créer des modules avec closures (pré-ES6)
**Difficulté** : ⭐⭐

```javascript
// Implémente un module pattern classique
export function createModule() {
  // Variable privée
  let privateData = 0;
  const privateSecret = "hidden";

  // Fonction privée
  function privateIncrement() {
    privateData++;
  }

  // API publique
  return {
    increment() {
      privateIncrement();
    },
    getCount() {
      return privateData;
    },
    // Note: pas d'accès à privateSecret
  };
}

export function testModule() {
  const mod = createModule();
  mod.increment();
  mod.increment();
  const count = mod.getCount();
  const secret = mod.privateSecret; // undefined
  const data = mod.privateData;     // undefined
  return [count, secret, data];
}
```

**Réponse attendue** :
- `testModule` → `[2, undefined, undefined]`

---

### ex03 - Private State
**Concepts** : Variables vraiment privées via closure
**Difficulté** : ⭐⭐

```javascript
// Implémente une "classe" avec état privé
export function createPerson(name, age) {
  // Ces variables sont privées
  let _name = name;
  let _age = age;

  return {
    getName() {
      return _name;
    },
    getAge() {
      return _age;
    },
    birthday() {
      _age++;
    },
    rename(newName) {
      if (typeof newName === "string" && newName.length > 0) {
        _name = newName;
      }
    }
  };
}

export function testPrivate() {
  const person = createPerson("Alice", 25);
  person.birthday();
  person._age = 100; // Tentative de modification directe
  person.rename("Bob");
  return [person.getName(), person.getAge()];
}
```

**Réponse attendue** :
- `testPrivate` → `["Bob", 26]` (pas 100, car _age est privé)

---

### ex04 - Factory Functions
**Concepts** : Créer des objets avec état via factories
**Difficulté** : ⭐⭐

```javascript
export function createStack() {
  const items = [];

  return {
    push(item) {
      items.push(item);
      return this;
    },
    pop() {
      return items.pop();
    },
    peek() {
      return items[items.length - 1];
    },
    size() {
      return items.length;
    },
    isEmpty() {
      return items.length === 0;
    }
  };
}

export function testStack() {
  const stack = createStack();
  stack.push(1).push(2).push(3);
  const popped = stack.pop();
  const peeked = stack.peek();
  const size = stack.size();

  // Tentative d'accès direct
  const directItems = stack.items;

  return [popped, peeked, size, directItems];
}
```

**Réponse attendue** :
- `testStack` → `[3, 2, 2, undefined]`

---

### ex05 - Memoization Manual
**Concepts** : Cache de résultats via closure
**Difficulté** : ⭐⭐⭐

```javascript
// Implémente une fonction de memoization simple
export function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

export function testMemoize() {
  let callCount = 0;

  const expensive = (n) => {
    callCount++;
    return n * 2;
  };

  const memoized = memoize(expensive);

  const r1 = memoized(5);
  const r2 = memoized(5);
  const r3 = memoized(10);
  const r4 = memoized(5);

  return [r1, r2, r3, r4, callCount];
}
```

**Réponse attendue** :
- `testMemoize` → `[10, 10, 20, 10, 2]` (seulement 2 appels réels)

---

### ex06 - Partial Application
**Concepts** : Fixer certains arguments d'une fonction
**Difficulté** : ⭐⭐⭐

```javascript
// Implémente partial application
export function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

export function testPartial() {
  const greet = (greeting, punctuation, name) => {
    return `${greeting}, ${name}${punctuation}`;
  };

  const sayHello = partial(greet, "Hello", "!");
  const sayHi = partial(greet, "Hi");

  return [
    sayHello("Alice"),
    sayHi("?", "Bob")
  ];
}

// Version avec placeholder
export function partialWithPlaceholder(fn, ...args) {
  const placeholder = partialWithPlaceholder._;

  return function(...supplied) {
    let suppliedIndex = 0;
    const combined = args.map(arg =>
      arg === placeholder ? supplied[suppliedIndex++] : arg
    );
    return fn(...combined, ...supplied.slice(suppliedIndex));
  };
}
partialWithPlaceholder._ = Symbol("placeholder");

export function testPartialPlaceholder() {
  const _ = partialWithPlaceholder._;
  const greet = (a, b, c) => `${a}-${b}-${c}`;

  const fn = partialWithPlaceholder(greet, _, "middle", _);
  return fn("first", "last");
}
```

**Réponses attendues** :
- `testPartial` → `["Hello, Alice!", "Hi, Bob?"]`
- `testPartialPlaceholder` → `"first-middle-last"`

---

### ex07 - Currying
**Concepts** : Transformer une fonction en chaîne de fonctions unaires
**Difficulté** : ⭐⭐⭐

```javascript
// Implémente le currying
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

export function testCurry() {
  const add3 = (a, b, c) => a + b + c;
  const curriedAdd = curry(add3);

  return [
    curriedAdd(1)(2)(3),
    curriedAdd(1, 2)(3),
    curriedAdd(1)(2, 3),
    curriedAdd(1, 2, 3)
  ];
}

// Différence curry vs partial
export function explainDifference() {
  // Partial: fixe des arguments spécifiques
  // Curry: transforme f(a,b,c) en f(a)(b)(c)
  return "curry transforms, partial fixes";
}
```

**Réponse attendue** :
- `testCurry` → `[6, 6, 6, 6]`

---

## ⚔️ Monde 4 : This Dojo (7 exercices)

> **Thème YDKJS** : Objects & Classes
> **Objectif** : Maîtriser le binding de `this`

### ex00 - Default Binding
**Concepts** : `this` en mode strict vs sloppy
**Difficulté** : ⭐

```javascript
export function default1() {
  function showThis() {
    return this;
  }
  return showThis() === globalThis;
}

export function default2() {
  "use strict";
  function showThis() {
    return this;
  }
  return showThis();
}

export function default3() {
  const arrow = () => this;
  return arrow() === globalThis;
}
```

**Réponses attendues** :
- `default1` → `true` (mode sloppy: this = globalThis)
- `default2` → `undefined` (strict mode: this = undefined)
- `default3` → `true` (arrow hérite du this lexical)

---

### ex01 - Implicit Binding
**Concepts** : `this` = objet avant le point
**Difficulté** : ⭐⭐

```javascript
export function implicit1() {
  const obj = {
    name: "obj",
    getName() {
      return this.name;
    }
  };
  return obj.getName();
}

export function implicit2() {
  const obj = {
    name: "obj",
    getName() {
      return this.name;
    }
  };
  const fn = obj.getName;
  return fn(); // Que retourne this.name ?
}

export function implicit3() {
  const obj = {
    name: "outer",
    inner: {
      name: "inner",
      getName() {
        return this.name;
      }
    }
  };
  return obj.inner.getName();
}

export function implicit4() {
  const obj = {
    name: "obj",
    getName() {
      return this.name;
    }
  };
  const other = { name: "other" };
  other.fn = obj.getName;
  return other.fn();
}
```

**Réponses attendues** :
- `implicit1` → `"obj"`
- `implicit2` → `undefined` (ou "" en browser: window.name)
- `implicit3` → `"inner"` (objet immédiat)
- `implicit4` → `"other"` (objet appelant)

---

### ex02 - Explicit Binding
**Concepts** : `call`, `apply`, `bind`
**Difficulté** : ⭐⭐

```javascript
export function explicit1() {
  function greet(greeting) {
    return `${greeting}, ${this.name}`;
  }
  const person = { name: "Alice" };
  return greet.call(person, "Hello");
}

export function explicit2() {
  function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
  const person = { name: "Bob" };
  return greet.apply(person, ["Hi", "!"]);
}

export function explicit3() {
  function greet() {
    return `Hello, ${this.name}`;
  }
  const person = { name: "Charlie" };
  const bound = greet.bind(person);
  const otherPerson = { name: "Dave" };
  return bound.call(otherPerson); // bind gagne
}

export function explicit4() {
  const obj = {
    name: "obj",
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const bound = obj.greet.bind({ name: "bound" });
  const reBound = bound.bind({ name: "rebound" });
  return reBound();
}
```

**Réponses attendues** :
- `explicit1` → `"Hello, Alice"`
- `explicit2` → `"Hi, Bob!"`
- `explicit3` → `"Hello, Charlie"` (bind ne peut pas être override)
- `explicit4` → `"Hello, bound"` (premier bind gagne)

---

### ex03 - new Binding
**Concepts** : `this` dans les constructeurs
**Difficulté** : ⭐⭐

```javascript
export function new1() {
  function Person(name) {
    this.name = name;
  }
  const p = new Person("Alice");
  return p.name;
}

export function new2() {
  function Person(name) {
    this.name = name;
    return { name: "Overridden" };
  }
  const p = new Person("Alice");
  return p.name;
}

export function new3() {
  function Person(name) {
    this.name = name;
    return 42; // retour primitif ignoré
  }
  const p = new Person("Alice");
  return p.name;
}

export function new4() {
  function Person(name) {
    this.name = name;
  }
  Person.prototype.greet = function() {
    return `Hello, ${this.name}`;
  };
  const p = new Person("Bob");
  return p.greet();
}
```

**Réponses attendues** :
- `new1` → `"Alice"`
- `new2` → `"Overridden"` (return object override)
- `new3` → `"Alice"` (return primitif ignoré)
- `new4` → `"Hello, Bob"`

---

### ex04 - Arrow Functions
**Concepts** : `this` lexical, pas de binding
**Difficulté** : ⭐⭐

```javascript
export function arrow1() {
  const obj = {
    name: "obj",
    regular() {
      return this.name;
    },
    arrow: () => this.name
  };
  return [obj.regular(), obj.arrow()];
}

export function arrow2() {
  const obj = {
    name: "obj",
    getGreeter() {
      return () => `Hello, ${this.name}`;
    }
  };
  const greeter = obj.getGreeter();
  return greeter();
}

export function arrow3() {
  const obj = {
    name: "obj",
    getGreeter() {
      return () => `Hello, ${this.name}`;
    }
  };
  const greeter = obj.getGreeter();
  return greeter.call({ name: "other" });
}

export function arrow4() {
  const obj = {
    name: "obj",
    nested: {
      name: "nested",
      getArrow() {
        return () => this.name;
      }
    }
  };
  return obj.nested.getArrow()();
}
```

**Réponses attendues** :
- `arrow1` → `["obj", undefined]` (arrow capture this de la création)
- `arrow2` → `"Hello, obj"` (arrow capture this de getGreeter)
- `arrow3` → `"Hello, obj"` (call n'affecte pas arrow)
- `arrow4` → `"nested"` (this de getArrow = nested)

---

### ex05 - Binding Priority
**Concepts** : new > explicit > implicit > default
**Difficulté** : ⭐⭐⭐

```javascript
export function priority1() {
  // new vs bind
  function Foo(name) {
    this.name = name;
  }
  const bound = Foo.bind({ name: "bound" });
  const instance = new bound("new");
  return instance.name;
}

export function priority2() {
  // explicit vs implicit
  const obj = {
    name: "implicit",
    getName() {
      return this.name;
    }
  };
  return obj.getName.call({ name: "explicit" });
}

export function priority3() {
  // Les 4 règles
  function identify() {
    return this.name;
  }

  const obj = { name: "obj", identify };
  const bound = identify.bind({ name: "bound" });

  return [
    identify(),              // default
    obj.identify(),          // implicit
    identify.call({ name: "explicit" }), // explicit
    new (identify.bind({ name: "bound" }))().name, // new
  ];
}
```

**Réponses attendues** :
- `priority1` → `"new"` (new gagne sur bind)
- `priority2` → `"explicit"` (call gagne sur implicit)
- `priority3` → `[undefined, "obj", "explicit", undefined]`

---

### ex06 - Lost this
**Concepts** : Perte de contexte dans les callbacks
**Difficulté** : ⭐⭐

```javascript
export function lost1() {
  const obj = {
    name: "obj",
    greet() {
      return `Hello, ${this.name}`;
    }
  };

  const fn = obj.greet;
  return fn();
}

export function lost2() {
  const obj = {
    name: "obj",
    greetLater() {
      setTimeout(function() {
        console.log(this.name);
      }, 0);
      // Que log setTimeout ?
      return "logged";
    }
  };
  // Réponse simulée
  return undefined; // this.name dans setTimeout
}

export function fixLost1() {
  const obj = {
    name: "obj",
    greetLater() {
      setTimeout(() => {
        return this.name;
      }, 0);
    }
  };
  // Arrow function fix
  return "obj";
}

export function fixLost2() {
  const obj = {
    name: "obj",
    greetLater() {
      const self = this;
      setTimeout(function() {
        return self.name;
      }, 0);
    }
  };
  // self/that pattern
  return "obj";
}

export function fixLost3() {
  const obj = {
    name: "obj",
    greetLater() {
      setTimeout(function() {
        return this.name;
      }.bind(this), 0);
    }
  };
  // bind fix
  return "obj";
}
```

**Réponses attendues** :
- `lost1` → `"Hello, undefined"`
- `lost2` → `undefined`
- `fixLost*` → `"obj"`

---

## 🔗 Monde 5 : Prototype Chain (8 exercices)

> **Thème YDKJS** : Objects & Classes (partie 2)
> **Objectif** : Comprendre [[Prototype]] et l'héritage prototypal

### ex00 - [[Prototype]] Link
**Concepts** : Le lien prototype interne
**Difficulté** : ⭐

```javascript
export function proto1() {
  const obj = {};
  return Object.getPrototypeOf(obj) === Object.prototype;
}

export function proto2() {
  const arr = [];
  return [
    Object.getPrototypeOf(arr) === Array.prototype,
    Object.getPrototypeOf(Array.prototype) === Object.prototype
  ];
}

export function proto3() {
  function Foo() {}
  const f = new Foo();
  return Object.getPrototypeOf(f) === Foo.prototype;
}

export function proto4() {
  const obj = Object.create(null);
  return Object.getPrototypeOf(obj);
}
```

**Réponses attendues** :
- `proto1` → `true`
- `proto2` → `[true, true]`
- `proto3` → `true`
- `proto4` → `null`

---

### ex01 - Property Lookup
**Concepts** : Remonter la chaîne pour trouver une propriété
**Difficulté** : ⭐⭐

```javascript
export function lookup1() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  return child.x;
}

export function lookup2() {
  const grandparent = { x: 1 };
  const parent = Object.create(grandparent);
  const child = Object.create(parent);
  return child.x;
}

export function lookup3() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  child.y = 2;
  return [child.x, child.y, parent.y];
}

export function lookup4() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  return [
    child.hasOwnProperty("x"),
    "x" in child
  ];
}
```

**Réponses attendues** :
- `lookup1` → `1`
- `lookup2` → `1`
- `lookup3` → `[1, 2, undefined]`
- `lookup4` → `[false, true]`

---

### ex02 - Shadowing
**Concepts** : Masquage de propriétés
**Difficulté** : ⭐⭐

```javascript
export function shadow1() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  child.x = 2;
  return [child.x, parent.x];
}

export function shadow2() {
  const parent = {
    get x() { return 1; }
  };
  const child = Object.create(parent);
  child.x = 2; // Que se passe-t-il ?
  return child.x;
}

export function shadow3() {
  const parent = {};
  Object.defineProperty(parent, "x", {
    value: 1,
    writable: false
  });
  const child = Object.create(parent);
  child.x = 2;
  return child.x;
}

export function shadow4() {
  "use strict";
  const parent = {};
  Object.defineProperty(parent, "x", {
    value: 1,
    writable: false
  });
  const child = Object.create(parent);
  try {
    child.x = 2;
    return "ok";
  } catch (e) {
    return "TypeError";
  }
}
```

**Réponses attendues** :
- `shadow1` → `[2, 1]`
- `shadow2` → `1` (setter absent, écriture silencieuse échoue)
- `shadow3` → `1` (writable:false hérité, mode sloppy ignore)
- `shadow4` → `"TypeError"` (strict mode)

---

### ex03 - Object.create
**Concepts** : Création avec prototype spécifique
**Difficulté** : ⭐⭐

```javascript
export function create1() {
  const proto = {
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const obj = Object.create(proto);
  obj.name = "Alice";
  return obj.greet();
}

export function create2() {
  const proto = { x: 1 };
  const obj = Object.create(proto, {
    y: { value: 2, writable: true, enumerable: true }
  });
  return [obj.x, obj.y];
}

export function create3() {
  // Simuler l'héritage classique
  const Animal = {
    speak() {
      return `${this.name} makes a sound`;
    }
  };

  const Dog = Object.create(Animal);
  Dog.bark = function() {
    return `${this.name} barks`;
  };

  const myDog = Object.create(Dog);
  myDog.name = "Rex";

  return [myDog.speak(), myDog.bark()];
}
```

**Réponses attendues** :
- `create1` → `"Hello, Alice"`
- `create2` → `[1, 2]`
- `create3` → `["Rex makes a sound", "Rex barks"]`

---

### ex04 - Constructor Functions
**Concepts** : `new` et `.prototype`
**Difficulté** : ⭐⭐

```javascript
export function constructor1() {
  function Dog(name) {
    this.name = name;
  }
  Dog.prototype.bark = function() {
    return `${this.name} says woof!`;
  };

  const d1 = new Dog("Rex");
  const d2 = new Dog("Max");

  return [
    d1.bark(),
    d1.bark === d2.bark
  ];
}

export function constructor2() {
  function Dog(name) {
    this.name = name;
  }

  Dog.prototype = {
    bark() {
      return "woof";
    }
  };

  const d = new Dog("Rex");
  return d.constructor === Dog;
}

export function constructor3() {
  function Dog(name) {
    this.name = name;
  }

  Dog.prototype = {
    constructor: Dog,
    bark() {
      return "woof";
    }
  };

  const d = new Dog("Rex");
  return d.constructor === Dog;
}
```

**Réponses attendues** :
- `constructor1` → `["Rex says woof!", true]`
- `constructor2` → `false` (prototype remplacé, constructor perdu)
- `constructor3` → `true` (constructor explicite)

---

### ex05 - Class Sugar
**Concepts** : `class` est du sucre syntaxique sur prototype
**Difficulté** : ⭐⭐⭐

```javascript
export function class1() {
  class Dog {
    constructor(name) {
      this.name = name;
    }
    bark() {
      return `${this.name} barks`;
    }
  }

  const d = new Dog("Rex");
  return [
    typeof Dog,
    Object.getPrototypeOf(d) === Dog.prototype
  ];
}

export function class2() {
  class Animal {
    speak() {
      return `${this.name} speaks`;
    }
  }

  class Dog extends Animal {
    constructor(name) {
      super();
      this.name = name;
    }
    bark() {
      return `${this.name} barks`;
    }
  }

  const d = new Dog("Rex");
  return [
    d.speak(),
    Object.getPrototypeOf(Dog.prototype) === Animal.prototype
  ];
}

export function class3() {
  // Classes ne sont pas hoisted
  try {
    const d = new Dog("Rex");
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }

  class Dog {
    constructor(name) {
      this.name = name;
    }
  }
}
```

**Réponses attendues** :
- `class1` → `["function", true]`
- `class2` → `["Rex speaks", true]`
- `class3` → `"ReferenceError"`

---

### ex06 - instanceof
**Concepts** : Comment `instanceof` fonctionne vraiment
**Difficulté** : ⭐⭐

```javascript
export function instance1() {
  function Dog() {}
  const d = new Dog();
  return [
    d instanceof Dog,
    d instanceof Object
  ];
}

export function instance2() {
  function Dog() {}
  const d = new Dog();

  // Changer le prototype après création
  Dog.prototype = {};

  return d instanceof Dog;
}

export function instance3() {
  function Dog() {}
  const d = new Dog();

  // instanceof vérifie la chaîne de prototype
  return [
    Dog.prototype.isPrototypeOf(d),
    Object.prototype.isPrototypeOf(d)
  ];
}

export function instance4() {
  // instanceof avec Object.create
  const proto = { bark() { return "woof"; } };
  const d = Object.create(proto);

  function Dog() {}
  Dog.prototype = proto;

  return d instanceof Dog;
}
```

**Réponses attendues** :
- `instance1` → `[true, true]`
- `instance2` → `false` (prototype changé après)
- `instance3` → `[true, true]`
- `instance4` → `true` (même prototype)

---

### ex07 - Mixins & Composition
**Concepts** : Alternatives à l'héritage classique
**Difficulté** : ⭐⭐⭐

```javascript
// Mixin pattern
export function mixin1() {
  const canWalk = {
    walk() {
      return `${this.name} walks`;
    }
  };

  const canSwim = {
    swim() {
      return `${this.name} swims`;
    }
  };

  function Duck(name) {
    this.name = name;
  }

  Object.assign(Duck.prototype, canWalk, canSwim);

  const d = new Duck("Donald");
  return [d.walk(), d.swim()];
}

// Object composition
export function compose1() {
  const createWalker = (state) => ({
    walk: () => `${state.name} walks`
  });

  const createSwimmer = (state) => ({
    swim: () => `${state.name} swims`
  });

  const createDuck = (name) => {
    const state = { name };
    return {
      ...createWalker(state),
      ...createSwimmer(state)
    };
  };

  const duck = createDuck("Donald");
  return [duck.walk(), duck.swim()];
}
```

**Réponses attendues** :
- `mixin1` → `["Donald walks", "Donald swims"]`
- `compose1` → `["Donald walks", "Donald swims"]`

---

## 🌊 Monde 6 : Async River (8 exercices)

> **Thème YDKJS** : Sync & Async
> **Objectif** : Comprendre l'event loop et les Promises

### ex00 - Call Stack
**Concepts** : Exécution synchrone, pile d'appels
**Difficulté** : ⭐

```javascript
export function stack1() {
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
}

export function stack2() {
  const result = [];

  function recursive(n) {
    if (n <= 0) return;
    result.push(n);
    recursive(n - 1);
    result.push(`done ${n}`);
  }

  recursive(3);
  return result;
}
```

**Réponses attendues** :
- `stack1` → `["main start", "first start", "second", "first end", "main end"]`
- `stack2` → `[3, 2, 1, "done 1", "done 2", "done 3"]`

---

### ex01 - Event Loop Basics
**Concepts** : setTimeout(fn, 0), macrotasks
**Difficulté** : ⭐⭐

```javascript
export async function loop1() {
  const result = [];

  result.push("1");

  setTimeout(() => result.push("2"), 0);

  result.push("3");

  await new Promise(r => setTimeout(r, 10));
  return result;
}

export async function loop2() {
  const result = [];

  setTimeout(() => result.push("a"), 0);
  setTimeout(() => result.push("b"), 0);
  setTimeout(() => result.push("c"), 0);

  result.push("sync");

  await new Promise(r => setTimeout(r, 10));
  return result;
}

export async function loop3() {
  const result = [];

  setTimeout(() => result.push("timeout 100"), 100);
  setTimeout(() => result.push("timeout 0"), 0);
  setTimeout(() => result.push("timeout 50"), 50);

  result.push("sync");

  await new Promise(r => setTimeout(r, 150));
  return result;
}
```

**Réponses attendues** :
- `loop1` → `["1", "3", "2"]`
- `loop2` → `["sync", "a", "b", "c"]`
- `loop3` → `["sync", "timeout 0", "timeout 50", "timeout 100"]`

---

### ex02 - Microtasks vs Macrotasks
**Concepts** : Promise.resolve vs setTimeout
**Difficulté** : ⭐⭐⭐

```javascript
export async function micro1() {
  const result = [];

  result.push("1");

  setTimeout(() => result.push("timeout"), 0);
  Promise.resolve().then(() => result.push("promise"));

  result.push("2");

  await new Promise(r => setTimeout(r, 10));
  return result;
}

export async function micro2() {
  const result = [];

  setTimeout(() => result.push("timeout 1"), 0);

  Promise.resolve()
    .then(() => result.push("promise 1"))
    .then(() => result.push("promise 2"));

  setTimeout(() => result.push("timeout 2"), 0);

  Promise.resolve().then(() => result.push("promise 3"));

  result.push("sync");

  await new Promise(r => setTimeout(r, 10));
  return result;
}

export async function micro3() {
  const result = [];

  async function async1() {
    result.push("async1 start");
    await async2();
    result.push("async1 end");
  }

  async function async2() {
    result.push("async2");
  }

  result.push("script start");

  setTimeout(() => result.push("timeout"), 0);

  async1();

  new Promise(resolve => {
    result.push("promise1");
    resolve();
  }).then(() => {
    result.push("promise2");
  });

  result.push("script end");

  await new Promise(r => setTimeout(r, 10));
  return result;
}
```

**Réponses attendues** :
- `micro1` → `["1", "2", "promise", "timeout"]`
- `micro2` → `["sync", "promise 1", "promise 3", "promise 2", "timeout 1", "timeout 2"]`
- `micro3` → `["script start", "async1 start", "async2", "promise1", "script end", "async1 end", "promise2", "timeout"]`

---

### ex03 - Promise States
**Concepts** : pending, fulfilled, rejected
**Difficulté** : ⭐

```javascript
export function state1() {
  const p = new Promise((resolve) => {
    // Ne jamais résoudre
  });
  // État ?
  return "pending";
}

export function state2() {
  const p = new Promise((resolve, reject) => {
    resolve("first");
    resolve("second");
    reject("error");
  });
  return p; // Que retourne-t-elle ?
}

export async function state3() {
  const p = new Promise((resolve, reject) => {
    resolve("first");
    resolve("second");
  });
  return await p;
}

export function state4() {
  return Promise.resolve(42);
}

export function state5() {
  return Promise.reject("error").catch(e => `caught: ${e}`);
}
```

**Réponses attendues** :
- `state1` → `"pending"`
- `state3` → `"first"` (seule la première résolution compte)
- `state4` retourne une Promise résolue avec 42
- `state5` retourne une Promise résolue avec `"caught: error"`

---

### ex04 - Promise Chaining
**Concepts** : then/catch/finally flow
**Difficulté** : ⭐⭐

```javascript
export async function chain1() {
  return Promise.resolve(1)
    .then(x => x + 1)
    .then(x => x * 2)
    .then(x => x + 3);
}

export async function chain2() {
  return Promise.resolve(1)
    .then(x => {
      throw new Error("oops");
    })
    .then(x => x * 2)
    .catch(e => "caught")
    .then(x => x + " and continued");
}

export async function chain3() {
  const result = [];

  await Promise.resolve()
    .then(() => result.push("then 1"))
    .then(() => result.push("then 2"))
    .finally(() => result.push("finally"))
    .then(() => result.push("then 3"));

  return result;
}

export async function chain4() {
  return Promise.reject("error")
    .catch(e => {
      throw new Error("new error");
    })
    .catch(e => e.message);
}
```

**Réponses attendues** :
- `chain1` → `7`
- `chain2` → `"caught and continued"`
- `chain3` → `["then 1", "then 2", "finally", "then 3"]`
- `chain4` → `"new error"`

---

### ex05 - Error Propagation
**Concepts** : try/catch avec async/await
**Difficulté** : ⭐⭐

```javascript
export async function error1() {
  try {
    await Promise.reject("error");
    return "no error";
  } catch (e) {
    return `caught: ${e}`;
  }
}

export async function error2() {
  const p = Promise.reject("error");

  try {
    const result = await p;
    return result;
  } catch (e) {
    return `caught: ${e}`;
  }
}

export async function error3() {
  async function failing() {
    throw new Error("oops");
  }

  try {
    await failing();
    return "ok";
  } catch (e) {
    return e.message;
  }
}

export async function error4() {
  async function outer() {
    async function inner() {
      throw new Error("inner error");
    }
    // Pas de try/catch ici
    await inner();
  }

  try {
    await outer();
    return "ok";
  } catch (e) {
    return e.message;
  }
}
```

**Réponses attendues** :
- `error1` → `"caught: error"`
- `error2` → `"caught: error"`
- `error3` → `"oops"`
- `error4` → `"inner error"` (erreur remonte)

---

### ex06 - Promise Combinators
**Concepts** : Promise.all, race, any, allSettled
**Difficulté** : ⭐⭐

```javascript
export async function all1() {
  return Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ]);
}

export async function all2() {
  try {
    return await Promise.all([
      Promise.resolve(1),
      Promise.reject("error"),
      Promise.resolve(3)
    ]);
  } catch (e) {
    return `caught: ${e}`;
  }
}

export async function race1() {
  return Promise.race([
    new Promise(r => setTimeout(() => r("slow"), 100)),
    new Promise(r => setTimeout(() => r("fast"), 10))
  ]);
}

export async function any1() {
  return Promise.any([
    Promise.reject("error 1"),
    Promise.resolve("success"),
    Promise.reject("error 2")
  ]);
}

export async function settled1() {
  return Promise.allSettled([
    Promise.resolve(1),
    Promise.reject("error"),
    Promise.resolve(3)
  ]);
}
```

**Réponses attendues** :
- `all1` → `[1, 2, 3]`
- `all2` → `"caught: error"`
- `race1` → `"fast"`
- `any1` → `"success"`
- `settled1` → `[{status:"fulfilled",value:1}, {status:"rejected",reason:"error"}, {status:"fulfilled",value:3}]`

---

### ex07 - Async Iteration
**Concepts** : for await...of, async generators
**Difficulté** : ⭐⭐⭐

```javascript
export async function asyncIter1() {
  const result = [];

  const asyncArray = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ];

  for await (const val of asyncArray) {
    result.push(val);
  }

  return result;
}

export async function asyncIter2() {
  async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
  }

  const result = [];
  for await (const val of asyncGenerator()) {
    result.push(val);
  }
  return result;
}

export async function asyncIter3() {
  async function* countdown(n) {
    while (n > 0) {
      yield n--;
      await new Promise(r => setTimeout(r, 10));
    }
  }

  const result = [];
  for await (const val of countdown(3)) {
    result.push(val);
  }
  return result;
}
```

**Réponses attendues** :
- `asyncIter1` → `[1, 2, 3]`
- `asyncIter2` → `[1, 2, 3]`
- `asyncIter3` → `[3, 2, 1]`

---

## 🚀 Monde 7 : ES.Next Summit (6 exercices)

> **Thème YDKJS** : ES.Next & Beyond
> **Objectif** : Maîtriser les fonctionnalités modernes de JavaScript

### ex00 - Destructuring Deep
**Concepts** : Nested, defaults, rest
**Difficulté** : ⭐⭐

```javascript
export function destruct1() {
  const { a, b } = { a: 1, b: 2, c: 3 };
  return [a, b];
}

export function destruct2() {
  const { a, b = 10 } = { a: 1 };
  return [a, b];
}

export function destruct3() {
  const { a: x, b: y } = { a: 1, b: 2 };
  return [x, y];
}

export function destruct4() {
  const { a: { b: { c } } } = { a: { b: { c: 42 } } };
  return c;
}

export function destruct5() {
  const [first, , third] = [1, 2, 3, 4];
  return [first, third];
}

export function destruct6() {
  const [head, ...tail] = [1, 2, 3, 4];
  return [head, tail];
}

export function destruct7() {
  const { a, ...rest } = { a: 1, b: 2, c: 3 };
  return [a, rest];
}

export function destruct8() {
  // Valeurs par défaut avec null vs undefined
  const { a = 1, b = 2 } = { a: undefined, b: null };
  return [a, b];
}
```

**Réponses attendues** :
- `destruct1` → `[1, 2]`
- `destruct2` → `[1, 10]`
- `destruct3` → `[1, 2]`
- `destruct4` → `42`
- `destruct5` → `[1, 3]`
- `destruct6` → `[1, [2, 3, 4]]`
- `destruct7` → `[1, {b: 2, c: 3}]`
- `destruct8` → `[1, null]` (default seulement pour undefined)

---

### ex01 - Spread & Rest
**Concepts** : Spread operator dans différents contextes
**Difficulté** : ⭐⭐

```javascript
export function spread1() {
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  return [...arr1, ...arr2];
}

export function spread2() {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { b: 3, c: 4 };
  return { ...obj1, ...obj2 };
}

export function spread3() {
  const str = "hello";
  return [...str];
}

export function spread4() {
  function sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
  }
  return sum(1, 2, 3, 4);
}

export function spread5() {
  // Shallow copy
  const original = { a: 1, nested: { b: 2 } };
  const copy = { ...original };
  copy.nested.b = 999;
  return original.nested.b;
}

export function spread6() {
  // Array vs iterable
  const obj = { length: 3, 0: "a", 1: "b", 2: "c" };
  try {
    return [...obj];
  } catch (e) {
    return "TypeError";
  }
}
```

**Réponses attendues** :
- `spread1` → `[1, 2, 3, 4]`
- `spread2` → `{a: 1, b: 3, c: 4}`
- `spread3` → `["h", "e", "l", "l", "o"]`
- `spread4` → `10`
- `spread5` → `999` (shallow copy!)
- `spread6` → `"TypeError"` (pas iterable)

---

### ex02 - Symbols
**Concepts** : Well-known symbols, Symbol.iterator
**Difficulté** : ⭐⭐⭐

```javascript
export function symbol1() {
  const sym = Symbol("description");
  return [typeof sym, sym.toString()];
}

export function symbol2() {
  const obj = {
    [Symbol.toStringTag]: "MyObject"
  };
  return Object.prototype.toString.call(obj);
}

export function symbol3() {
  const obj = {
    data: [1, 2, 3],
    [Symbol.iterator]() {
      let index = 0;
      const data = this.data;
      return {
        next() {
          if (index < data.length) {
            return { value: data[index++], done: false };
          }
          return { done: true };
        }
      };
    }
  };
  return [...obj];
}

export function symbol4() {
  const sym1 = Symbol.for("shared");
  const sym2 = Symbol.for("shared");
  const sym3 = Symbol("shared");
  return [sym1 === sym2, sym1 === sym3];
}

export function symbol5() {
  const sym = Symbol.for("test");
  return Symbol.keyFor(sym);
}
```

**Réponses attendues** :
- `symbol1` → `["symbol", "Symbol(description)"]`
- `symbol2` → `"[object MyObject]"`
- `symbol3` → `[1, 2, 3]`
- `symbol4` → `[true, false]`
- `symbol5` → `"test"`

---

### ex03 - Iterators & Generators
**Concepts** : Protocole d'itération, yield
**Difficulté** : ⭐⭐⭐

```javascript
export function gen1() {
  function* simple() {
    yield 1;
    yield 2;
    yield 3;
  }
  return [...simple()];
}

export function gen2() {
  function* withReturn() {
    yield 1;
    yield 2;
    return 3;
  }
  return [...withReturn()];
}

export function gen3() {
  function* range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }
  return [...range(5, 8)];
}

export function gen4() {
  function* delegating() {
    yield 1;
    yield* [2, 3];
    yield 4;
  }
  return [...delegating()];
}

export function gen5() {
  function* twoWay() {
    const x = yield "first";
    const y = yield x + " second";
    return y;
  }

  const gen = twoWay();
  const r1 = gen.next();
  const r2 = gen.next("received");
  const r3 = gen.next("final");

  return [r1.value, r2.value, r3.value];
}
```

**Réponses attendues** :
- `gen1` → `[1, 2, 3]`
- `gen2` → `[1, 2]` (return value pas inclus dans spread)
- `gen3` → `[5, 6, 7, 8]`
- `gen4` → `[1, 2, 3, 4]`
- `gen5` → `["first", "received second", "final"]`

---

### ex04 - Proxy & Reflect
**Concepts** : Intercepter les opérations sur les objets
**Difficulté** : ⭐⭐⭐

```javascript
export function proxy1() {
  const target = { a: 1, b: 2 };
  const handler = {
    get(target, prop) {
      return prop in target ? target[prop] : "default";
    }
  };
  const proxy = new Proxy(target, handler);
  return [proxy.a, proxy.c];
}

export function proxy2() {
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
}

export function proxy3() {
  const target = { secret: "hidden", public: "visible" };
  const handler = {
    get(target, prop) {
      if (prop === "secret") {
        return undefined;
      }
      return Reflect.get(target, prop);
    },
    has(target, prop) {
      if (prop === "secret") {
        return false;
      }
      return Reflect.has(target, prop);
    }
  };
  const proxy = new Proxy(target, handler);
  return [proxy.secret, proxy.public, "secret" in proxy];
}

export function proxy4() {
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
}
```

**Réponses attendues** :
- `proxy1` → `[1, "default"]`
- `proxy2` → `[5, "TypeError"]`
- `proxy3` → `[undefined, "visible", false]`
- `proxy4` → `[3, 7, [[1,2], [3,4]]]`

---

### ex05 - WeakMap & WeakSet
**Concepts** : Références faibles, garbage collection
**Difficulté** : ⭐⭐

```javascript
export function weak1() {
  const wm = new WeakMap();
  let obj = { name: "test" };
  wm.set(obj, "secret data");

  const result = wm.get(obj);
  return result;
}

export function weak2() {
  const wm = new WeakMap();
  try {
    wm.set("string key", "value");
    return "ok";
  } catch (e) {
    return "TypeError";
  }
}

export function weak3() {
  const wm = new WeakMap();
  const obj = { id: 1 };
  wm.set(obj, { privateData: "secret" });

  // WeakMap n'a pas .keys(), .values(), .entries()
  return [
    typeof wm.keys,
    typeof wm.values,
    typeof wm.entries
  ];
}

export function weak4() {
  // Use case: private data
  const privateData = new WeakMap();

  class Person {
    constructor(name, age) {
      privateData.set(this, { name, age });
    }
    getName() {
      return privateData.get(this).name;
    }
    getAge() {
      return privateData.get(this).age;
    }
  }

  const p = new Person("Alice", 30);
  return [p.getName(), p.getAge(), p.name];
}

export function weak5() {
  const ws = new WeakSet();
  const obj = { id: 1 };
  ws.add(obj);

  return [ws.has(obj), ws.has({ id: 1 })];
}
```

**Réponses attendues** :
- `weak1` → `"secret data"`
- `weak2` → `"TypeError"` (clés doivent être des objets)
- `weak3` → `["undefined", "undefined", "undefined"]`
- `weak4` → `["Alice", 30, undefined]`
- `weak5` → `[true, false]`

---

## 📊 Résumé

| Monde | Exercices | Concepts Clés |
|-------|-----------|---------------|
| **0. Welcome Valley** | **10** | **Variables, types, arrays, objects, functions, loops** |
| 1. Primitives Lab | 8 | Types, coercion, equality, typeof |
| 2. Scope Tower | 7 | Lexical scope, hoisting, TDZ, blocks |
| 3. Closures Cave | 8 | Closures, modules, memoization, currying |
| 4. This Dojo | 7 | this binding, call/apply/bind, arrows |
| 5. Prototype Chain | 8 | [[Prototype]], héritage, classes |
| 6. Async River | 8 | Event loop, Promises, async/await |
| 7. ES.Next Summit | 6 | Destructuring, symbols, proxies |
| **Total** | **62** | |

---

## 🎮 Progression Suggérée

```
                    ┌──────────────────┐
                    │   ES.Next Summit │
                    │   (6 exercices)  │
                    └────────▲─────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
┌────────┴────────┐                   ┌──────────┴────────┐
│  Async River    │                   │  Prototype Chain  │
│  (8 exercices)  │                   │   (8 exercices)   │
└────────▲────────┘                   └──────────▲────────┘
         │                                       │
         │                            ┌──────────┴────────┐
         │                            │    This Dojo      │
         │                            │   (7 exercices)   │
         │                            └──────────▲────────┘
         │                                       │
┌────────┴────────┐                   ┌──────────┴────────┐
│  Closures Cave  │◄──────────────────│   Scope Tower     │
│  (8 exercices)  │                   │   (7 exercices)   │
└────────▲────────┘                   └──────────▲────────┘
         │                                       │
         └───────────────────┬───────────────────┘
                             │
                   ┌─────────┴─────────┐
                   │  Primitives Lab   │
                   │   (8 exercices)   │
                   └─────────▲─────────┘
                             │
                   ┌─────────┴─────────┐
                   │  Welcome Valley   │
                   │  (10 exercices)   │
                   └───────────────────┘
                        🏁 START
```

**Pré-requis** :
- **Welcome Valley** → débloque Primitives Lab (point d'entrée obligatoire)
- Primitives Lab → débloque Scope Tower ET Closures Cave
- Scope Tower → débloque This Dojo
- Closures Cave → débloque Async River
- This Dojo → débloque Prototype Chain
- Prototype Chain + Async River → débloquent ES.Next Summit
