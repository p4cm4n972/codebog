/**
 * Ex33 - Weather App
 * Créer une application météo utilisant une API
 */

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Recherche les coordonnées d'une ville
 * @param {string} cityName - Nom de la ville
 * @returns {Promise<Object>} { name, latitude, longitude, country }
 */
export async function geocodeCity(cityName) {
  void cityName;
  void GEOCODING_API;
  // TODO: Fetch geocoding API
  return undefined;
}

/**
 * Récupère la météo pour des coordonnées
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Données météo
 */
export async function fetchWeather(latitude, longitude) {
  void latitude;
  void longitude;
  void WEATHER_API;
  // TODO: Fetch weather API
  return undefined;
}

/**
 * Récupère la météo pour une ville
 * @param {string} cityName - Nom de la ville
 * @returns {Promise<Object>} { city, weather }
 */
export async function getWeatherByCity(cityName) {
  void cityName;
  // TODO: geocodeCity + fetchWeather
  return undefined;
}

/**
 * Récupère la position géographique actuelle
 * @returns {Promise<Object>} { latitude, longitude }
 */
export function getCurrentPosition() {
  // TODO: navigator.geolocation.getCurrentPosition avec Promise
  return undefined;
}

/**
 * Interprète le code météo WMO
 * @param {number} code - Code météo WMO
 * @returns {Object} { description, icon }
 */
export function interpretWeatherCode(code) {
  void code;
  // TODO: Mapper les codes vers des descriptions
  return undefined;
}

/**
 * Formate la température
 * @param {number} temp - Température
 * @param {string} unit - 'celsius' ou 'fahrenheit'
 * @returns {string} Température formatée
 */
export function formatTemperature(temp, unit = 'celsius') {
  void temp;
  void unit;
  // TODO: Formatter avec unité
  return undefined;
}

/**
 * Crée l'élément d'affichage météo
 * @param {Object} data - { city, weather }
 * @returns {HTMLElement} Élément d'affichage
 */
export function createWeatherDisplay(data) {
  void data;
  // TODO: Créer le DOM pour afficher la météo
  return undefined;
}

/**
 * Crée un état de chargement
 * @returns {HTMLElement} Élément de loading
 */
export function createLoadingState() {
  // TODO: Spinner ou texte de chargement
  return undefined;
}

/**
 * Crée un affichage d'erreur
 * @param {string} message - Message d'erreur
 * @returns {HTMLElement} Élément d'erreur
 */
export function createErrorDisplay(message) {
  void message;
  // TODO: Élément avec message d'erreur
  return undefined;
}

/**
 * Initialise l'application météo
 * @param {HTMLElement} rootElement - Élément racine
 * @returns {Object} { searchByCity, useGeolocation }
 */
export function initWeatherApp(rootElement) {
  void rootElement;
  // TODO: Initialiser l'app complète
  return undefined;
}
