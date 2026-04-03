# Ex29 - Images & Transformations

## Objectif
Manipuler des images et appliquer des transformations.

## Dessiner une image

```javascript
const img = new Image();
img.onload = () => {
  // Image complète
  ctx.drawImage(img, x, y);

  // Image redimensionnée
  ctx.drawImage(img, x, y, width, height);

  // Portion d'image (sprite)
  ctx.drawImage(
    img,
    sourceX, sourceY, sourceWidth, sourceHeight,  // Source
    destX, destY, destWidth, destHeight           // Destination
  );
};
img.src = 'image.png';
```

## Transformations

```javascript
// Translation (déplacer l'origine)
ctx.translate(x, y);

// Rotation (en radians, autour de l'origine)
ctx.rotate(angle);

// Échelle
ctx.scale(scaleX, scaleY);

// Réinitialiser les transformations
ctx.setTransform(1, 0, 0, 1, 0, 0);
```

## Sauvegarder/Restaurer l'état

```javascript
ctx.save();      // Sauvegarder l'état actuel

// Appliquer des transformations...
ctx.translate(100, 100);
ctx.rotate(Math.PI / 4);

// Dessiner...
ctx.fillRect(-25, -25, 50, 50);

ctx.restore();   // Restaurer l'état précédent
```

## Rotation autour d'un point

```javascript
function drawRotatedRect(ctx, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);  // Centre
  ctx.rotate(angle);
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}
```

## Flip / Mirror

```javascript
// Flip horizontal
ctx.scale(-1, 1);
ctx.drawImage(img, -img.width, 0);

// Flip vertical
ctx.scale(1, -1);
ctx.drawImage(img, 0, -img.height);
```
