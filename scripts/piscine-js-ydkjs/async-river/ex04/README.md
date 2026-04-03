# Ex04 - Promise Chaining

## Objectif
Maîtriser le chaînage de Promises avec then/catch/finally.

## Contexte
Les méthodes `then`, `catch` et `finally` retournent toujours une nouvelle Promise, permettant de les chaîner. La valeur retournée par un callback devient la valeur de résolution de la Promise suivante.

## Instructions

### `chain1()` - Chaînage simple
```javascript
return Promise.resolve(1)
  .then(x => x + 1)
  .then(x => x * 2)
  .then(x => x + 3);
```

### `chain2()` - Erreur et catch
```javascript
return Promise.resolve(1)
  .then(x => {
    throw new Error("oops");
  })
  .then(x => x * 2)
  .catch(e => "caught")
  .then(x => x + " and continued");
```

### `chain3()` - finally ne modifie pas la valeur
```javascript
const result = [];

await Promise.resolve()
  .then(() => result.push("then 1"))
  .then(() => result.push("then 2"))
  .finally(() => result.push("finally"))
  .then(() => result.push("then 3"));

return result;
```

### `chain4()` - Erreur dans catch
```javascript
return Promise.reject("error")
  .catch(e => {
    throw new Error("new error");
  })
  .catch(e => e.message);
```

## Indice
- `.then()` passe à l'étape suivante en cas de succès
- `.catch()` intercepte les erreurs et permet de continuer
- `.finally()` s'exécute toujours mais ne modifie pas la valeur
- Une erreur dans `.catch()` peut être attrapée par un `.catch()` suivant

## Concepts
- Promise chaining
- Error recovery
- finally behavior
- Chain continuation
