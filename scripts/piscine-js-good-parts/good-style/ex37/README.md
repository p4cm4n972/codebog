# Ex37 - Final Project

## Objectif
Appliquer toutes les bonnes pratiques dans un mini-projet complet.

## Le projet: Todo List Manager

Créer un gestionnaire de tâches en appliquant:

1. **Clean Code** - Noms explicites, fonctions courtes
2. **Error Handling** - Pattern Result, validation
3. **Defensive Programming** - Assertions, valeurs par défaut
4. **Immutabilité** - Ne pas muter les données
5. **Composition** - Fonctions pures, composition

## Fonctionnalités

- Créer une tâche
- Marquer comme complète
- Filtrer (toutes, actives, complétées)
- Rechercher par texte
- Statistiques

## Structure attendue

```javascript
const todoManager = createTodoManager();

// Ajouter
const result = todoManager.add({ title: 'Learn JS' });
// { success: true, todo: { id, title, completed, createdAt } }

// Compléter
todoManager.toggle(id);

// Filtrer
todoManager.filter('active');  // todos non complétés
todoManager.search('JS');      // todos contenant 'JS'

// Stats
todoManager.stats();
// { total: 10, completed: 3, active: 7, completionRate: 0.3 }
```
