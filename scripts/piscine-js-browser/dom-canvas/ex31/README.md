# Ex31 - Interactive Canvas

## Objectif
Rendre le canvas interactif avec les événements souris.

## Position de la souris sur le canvas

```javascript
function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', (e) => {
  const pos = getMousePos(canvas, e);
  console.log(pos.x, pos.y);
});
```

## Détecter un clic sur une forme

```javascript
// Pour un cercle
function isPointInCircle(px, py, cx, cy, radius) {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radius * radius;
}

// Pour un rectangle
function isPointInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
```

## Drag and Drop

```javascript
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let selectedObject = null;

canvas.addEventListener('mousedown', (e) => {
  const pos = getMousePos(canvas, e);
  const obj = findObjectAt(pos.x, pos.y);

  if (obj) {
    isDragging = true;
    selectedObject = obj;
    dragOffset.x = pos.x - obj.x;
    dragOffset.y = pos.y - obj.y;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedObject) {
    const pos = getMousePos(canvas, e);
    selectedObject.x = pos.x - dragOffset.x;
    selectedObject.y = pos.y - dragOffset.y;
    redraw();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  selectedObject = null;
});
```

## Dessin libre

```javascript
let isDrawing = false;
let lastPos = null;

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  lastPos = getMousePos(canvas, e);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const pos = getMousePos(canvas, e);
  ctx.beginPath();
  ctx.moveTo(lastPos.x, lastPos.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  lastPos = pos;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
```
