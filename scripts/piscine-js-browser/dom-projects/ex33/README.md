# Ex33 - Weather App

## Objectif
Créer une application météo utilisant une API.

## Fonctionnalités requises

1. **Recherche par ville** - Input + bouton
2. **Affichage météo** - Température, conditions, icône
3. **Géolocalisation** - Position actuelle
4. **Gestion des erreurs** - Ville non trouvée, pas de connexion
5. **Loading state** - Indicateur de chargement

## API suggérée

Utiliser une API météo gratuite comme Open-Meteo (pas de clé requise):
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true
```

Ou pour la géocodage:
```
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```

## Structure suggérée

```javascript
// État
const state = {
  city: '',
  weather: null,
  loading: false,
  error: null
};

// Actions
async function searchCity(cityName) { ... }
async function useGeolocation() { ... }

// Rendu
function renderWeather(weather) { ... }
function renderError(error) { ... }
function renderLoading() { ... }
```

## Bonnes pratiques

```javascript
// Géolocalisation
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
  },
  (error) => {
    handleError('Géolocalisation refusée');
  }
);

// Debounce pour la recherche
let timeoutId;
input.addEventListener('input', (e) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => searchCity(e.target.value), 500);
});
```
