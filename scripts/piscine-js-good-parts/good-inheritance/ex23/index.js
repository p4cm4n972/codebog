/**
 * Ex23 - Class Syntax
 * Classes ES6 (sucre syntaxique)
 */

/**
 * Classe Shape de base
 * Propriétés: name
 * Méthodes: describe() retourne `A ${this.name}`
 */
export class Shape {
  // TODO: constructor et describe()
}

/**
 * Classe Rectangle héritant de Shape
 * Propriétés: width, height
 * Méthodes: area(), perimeter()
 */
export class Rectangle extends Shape {
  // TODO: constructor avec super(), area(), perimeter()
}

/**
 * Classe Circle avec getters
 * Propriété privée: _radius
 * Getters: radius, diameter, area
 * Setter: radius (doit être > 0)
 */
export class Circle extends Shape {
  // TODO: Implémenter avec get/set
}

/**
 * Classe Counter avec méthodes statiques
 * Static: instances (compte les instances créées)
 * Static: create() factory method
 * Instance: value, increment(), decrement()
 */
export class Counter {
  // TODO: static instances, static create()
}

/**
 * Classe Stack (pile LIFO)
 * Méthodes: push(item), pop(), peek(), isEmpty(), size
 * Utiliser un champ privé #items
 */
export class Stack {
  // TODO: Implémenter avec #items privé
}

/**
 * Classe EventEmitter
 * Méthodes: on(event, handler), off(event, handler), emit(event, data)
 */
export class EventEmitter {
  // TODO: Gérer les listeners
}

/**
 * Classe Observable avec Symbol.iterator
 * Méthodes: add(item), [Symbol.iterator]()
 */
export class ObservableList {
  // TODO: Rendre itérable avec for...of
}
