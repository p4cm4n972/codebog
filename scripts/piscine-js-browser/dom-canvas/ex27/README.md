# Ex27 - Canvas Basics

## Objectif
Comprendre les bases du dessin avec Canvas 2D.

## Créer un canvas

```javascript
// HTML: <canvas id="canvas" width="400" height="300"></canvas>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ou créer dynamiquement
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);
```

## Dessiner des rectangles

```javascript
// Rectangle plein
ctx.fillStyle = 'blue';
ctx.fillRect(x, y, width, height);

// Rectangle contour
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.strokeRect(x, y, width, height);

// Effacer un rectangle
ctx.clearRect(x, y, width, height);
```

## Dessiner des cercles

```javascript
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.fillStyle = 'green';
ctx.fill();

// Ou juste le contour
ctx.stroke();
```

## Couleurs et styles

```javascript
// Couleurs
ctx.fillStyle = 'red';
ctx.fillStyle = '#FF0000';
ctx.fillStyle = 'rgb(255, 0, 0)';
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

// Styles de ligne
ctx.lineWidth = 5;
ctx.lineCap = 'round';     // butt, round, square
ctx.lineJoin = 'round';    // miter, round, bevel
```

## Effacer le canvas

```javascript
// Effacer tout
ctx.clearRect(0, 0, canvas.width, canvas.height);
```
