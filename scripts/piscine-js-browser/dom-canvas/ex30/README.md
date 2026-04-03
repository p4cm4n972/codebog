# Ex30 - Animation

## Objectif
Créer des animations fluides avec requestAnimationFrame.

## requestAnimationFrame

```javascript
function animate() {
  // Effacer
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mettre à jour et dessiner
  update();
  draw();

  // Boucle
  requestAnimationFrame(animate);
}

// Démarrer
requestAnimationFrame(animate);
```

## Avec delta time (frame-rate indépendant)

```javascript
let lastTime = 0;

function animate(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000; // En secondes
  lastTime = currentTime;

  update(deltaTime);
  draw();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

## Exemple: Balle qui rebondit

```javascript
const ball = {
  x: 100,
  y: 100,
  vx: 200,  // pixels par seconde
  vy: 150,
  radius: 20
};

function update(dt) {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  // Rebond sur les bords
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.vx *= -1;
  }
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy *= -1;
  }
}

function draw() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}
```

## Arrêter l'animation

```javascript
let animationId;

function start() {
  animationId = requestAnimationFrame(animate);
}

function stop() {
  cancelAnimationFrame(animationId);
}
```

## FPS Counter

```javascript
let frameCount = 0;
let lastFpsTime = 0;
let fps = 0;

function animate(currentTime) {
  frameCount++;

  if (currentTime - lastFpsTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsTime = currentTime;
  }

  // Afficher FPS
  ctx.fillText(`FPS: ${fps}`, 10, 20);

  requestAnimationFrame(animate);
}
```
