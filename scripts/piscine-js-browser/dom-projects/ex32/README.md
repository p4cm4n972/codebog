# Ex32 - Todo List

## Objectif
Créer une application Todo List complète avec persistance.

## Fonctionnalités requises

1. **Ajouter une tâche** - Input + bouton ou Enter
2. **Marquer comme complétée** - Toggle checkbox
3. **Supprimer une tâche** - Bouton supprimer
4. **Filtrer** - Toutes, Actives, Complétées
5. **Persister** - Sauvegarder dans localStorage

## Structure suggérée

```javascript
// État
const state = {
  todos: [],  // [{ id, text, completed }]
  filter: 'all'  // 'all', 'active', 'completed'
};

// Actions
function addTodo(text) { ... }
function toggleTodo(id) { ... }
function deleteTodo(id) { ... }
function setFilter(filter) { ... }

// Rendu
function render() { ... }

// Persistance
function saveTodos() { ... }
function loadTodos() { ... }
```

## Bonnes pratiques

```javascript
// Générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Event delegation pour les boutons
list.addEventListener('click', (e) => {
  const todoItem = e.target.closest('.todo-item');
  if (!todoItem) return;

  const id = todoItem.dataset.id;

  if (e.target.matches('.delete-btn')) {
    deleteTodo(id);
  } else if (e.target.matches('.toggle-btn')) {
    toggleTodo(id);
  }
});
```

## Tests à implémenter

- Ajouter une tâche crée un nouvel élément
- Marquer une tâche change son état
- Supprimer une tâche la retire de la liste
- Les filtres affichent les bonnes tâches
- Les données persistent après rechargement
