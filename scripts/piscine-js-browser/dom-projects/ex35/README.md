# Ex35 - Color Picker

## Objectif
Créer un sélecteur de couleur interactif avec Canvas.

## Fonctionnalités requises

1. **Palette de couleurs** - Gradient HSL sur canvas
2. **Slider de teinte** - Barre de sélection de teinte
3. **Affichage de la couleur** - Preview + codes (HEX, RGB, HSL)
4. **Pipette** - Clic sur la palette pour sélectionner
5. **Input manuel** - Saisie directe du code couleur

## Conversions de couleurs

```javascript
// HSL vers RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255)
  ];
}

// RGB vers HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// HEX vers RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}
```

## Dessiner la palette avec gradients (plus performant)

```javascript
function drawColorPaletteGradient(ctx, width, height, hue) {
  // Gradient blanc vers couleur
  const colorGrad = ctx.createLinearGradient(0, 0, width, 0);
  colorGrad.addColorStop(0, '#fff');
  colorGrad.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
  ctx.fillStyle = colorGrad;
  ctx.fillRect(0, 0, width, height);

  // Gradient transparent vers noir
  const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
  blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
  blackGrad.addColorStop(1, '#000');
  ctx.fillStyle = blackGrad;
  ctx.fillRect(0, 0, width, height);
}
```

## Récupérer une couleur de pixel

```javascript
function getColorAt(ctx, x, y) {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2]
  };
}
```
