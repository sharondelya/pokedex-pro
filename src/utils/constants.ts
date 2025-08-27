/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  name: 'PokéDex Pro',
  version: '1.0.0',
  description: 'Ultimate Pokémon Encyclopedia',
  author: 'sharondelya',
  repository: 'https://github.com/sharondelya/pokedex-pro'
}

export const API_CONFIG = {
  baseUrl: 'https://pokeapi.co/api/v2',
  timeout: 10000,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 2 * 60 * 1000   // 2 minutes
}

export const POKEMON_LIMITS = {
  maxTeamSize: 6,
  maxFavorites: 100,
  maxRecentlyViewed: 10,
  maxSearchHistory: 20,
  maxCompareSlots: 4
}

export const GENERATIONS = [
  { id: 1, name: 'Generation I', range: [1, 151], region: 'Kanto' },
  { id: 2, name: 'Generation II', range: [152, 251], region: 'Johto' },
  { id: 3, name: 'Generation III', range: [252, 386], region: 'Hoenn' },
  { id: 4, name: 'Generation IV', range: [387, 493], region: 'Sinnoh' },
  { id: 5, name: 'Generation V', range: [494, 649], region: 'Unova' },
  { id: 6, name: 'Generation VI', range: [650, 721], region: 'Kalos' },
  { id: 7, name: 'Generation VII', range: [722, 809], region: 'Alola' },
  { id: 8, name: 'Generation VIII', range: [810, 905], region: 'Galar' },
  { id: 9, name: 'Generation IX', range: [906, 1010], region: 'Paldea' }
]

export const STAT_NAMES = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed': 'Speed'
}

export const MOVE_LEARN_METHODS = {
  'level-up': 'Level Up',
  'machine': 'TM/TR',
  'tutor': 'Move Tutor',
  'egg': 'Egg Move',
  'stadium-surfing-pikachu': 'Special',
  'light-ball-egg': 'Special Egg',
  'colosseum-purification': 'Purification',
  'xd-shadow': 'Shadow',
  'xd-purification': 'Purification'
}

export const DAMAGE_CLASSES = {
  'physical': { name: 'Physical', color: 'text-red-600', icon: '💪' },
  'special': { name: 'Special', color: 'text-blue-600', icon: '✨' },
  'status': { name: 'Status', color: 'text-gray-600', icon: '🔄' }
}

export const POKEMON_HABITATS = [
  'cave', 'forest', 'grassland', 'mountain', 'rare', 'rough-terrain',
  'sea', 'urban', 'waters-edge'
]

export const EGG_GROUPS = [
  'monster', 'water1', 'bug', 'flying', 'field', 'fairy', 'grass',
  'human-like', 'water3', 'mineral', 'amorphous', 'water2', 'ditto',
  'dragon', 'undiscovered'
]
