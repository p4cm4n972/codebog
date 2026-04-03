# Ex28 - Paths & Text

## Objectif
Dessiner des chemins complexes et du texte.

## Chemins (Paths)

```javascript
ctx.beginPath();        // Commencer un nouveau chemin
ctx.moveTo(x, y);       // Déplacer le curseur
ctx.lineTo(x, y);       // Ligne vers
ctx.closePath();        // Fermer le chemin (retour au début)
ctx.stroke();           // Dessiner le contour
ctx.fill();             // Remplir
```

## Formes avec chemins

```javascript
// Triangle
ctx.beginPath();
ctx.moveTo(100, 50);
ctx.lineTo(150, 150);
ctx.lineTo(50, 150);
ctx.closePath();
ctx.fill();

// Polygone régulier
function drawPolygon(ctx, x, y, radius, sides) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}
```

## Courbes

```javascript
// Arc
ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

// Courbe quadratique (1 point de contrôle)
ctx.quadraticCurveTo(cpX, cpY, endX, endY);

// Courbe de Bézier (2 points de contrôle)
ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
```

## Texte

```javascript
// Style de texte
ctx.font = '24px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';      // start, end, left, right, center
ctx.textBaseline = 'middle';   // top, hanging, middle, alphabetic, bottom

// Dessiner du texte
ctx.fillText('Hello', x, y);
ctx.strokeText('Hello', x, y);

// Mesurer le texte
const metrics = ctx.measureText('Hello');
const width = metrics.width;
```
