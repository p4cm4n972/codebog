# Ex34 - Timer & Stopwatch

## Objectif
Créer un chronomètre et un minuteur.

## Fonctionnalités Stopwatch

1. **Start** - Démarrer le chronomètre
2. **Pause** - Mettre en pause
3. **Reset** - Réinitialiser
4. **Lap** - Enregistrer un temps intermédiaire

## Fonctionnalités Timer

1. **Set time** - Définir une durée
2. **Start** - Démarrer le compte à rebours
3. **Pause** - Mettre en pause
4. **Reset** - Réinitialiser
5. **Alert** - Notification quand terminé

## Affichage du temps

```javascript
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}
```

## Précision du timing

```javascript
// Utiliser Date.now() pour la précision
let startTime;
let elapsed = 0;
let intervalId;

function start() {
  startTime = Date.now() - elapsed;
  intervalId = setInterval(update, 10);
}

function update() {
  elapsed = Date.now() - startTime;
  display.textContent = formatTime(elapsed);
}

function pause() {
  clearInterval(intervalId);
}

function reset() {
  pause();
  elapsed = 0;
  display.textContent = formatTime(0);
}
```

## Pattern avec requestAnimationFrame

```javascript
function startAnimationLoop() {
  function tick() {
    elapsed = Date.now() - startTime;
    display.textContent = formatTime(elapsed);
    animationId = requestAnimationFrame(tick);
  }
  animationId = requestAnimationFrame(tick);
}
```
