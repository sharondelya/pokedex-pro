import axios from 'axios'
import { 
  Pokemon, 
  PokemonSpecies, 
  EvolutionChain, 
  Move, 
  PaginationInfo, 
  PokemonListItem,
  TypeName 
} from '../types/pokemon'

/**
 * Pokemon API service using PokeAPI v2
 * Includes caching, error handling, and optimized data fetching
 */

const BASE_URL = 'https://pokeapi.co/api/v2'

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simple in-memory cache to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Generic cache wrapper for API calls
 */
async function cachedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data
  }
  
  try {
    const data = await requestFn()
    cache.set(key, { data, timestamp: now })
    return data
  } catch (error) {
    // If we have stale cache data, return it on error
    if (cached) {
      console.warn(`API request failed, returning stale cache for ${key}`)
      return cached.data
    }
    throw error
  }
}

/**
 * Fetch a single Pokemon by ID or name
 */
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const cacheKey = `pokemon-${idOrName}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get<Pokemon>(`/pokemon/${idOrName}`)
    return response.data
  })
}

/**
 * Fetch Pokemon species data (includes flavor text, evolution chain, etc.)
 */
export async function fetchPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  const cacheKey = `species-${idOrName}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get<PokemonSpecies>(`/pokemon-species/${idOrName}`)
    return response.data
  })
}

/**
 * Fetch evolution chain data
 */
export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
  const cacheKey = `evolution-${id}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get<EvolutionChain>(`/evolution-chain/${id}`)
    return response.data
  })
}

/**
 * Fetch move data
 */
export async function fetchMove(idOrName: string | number): Promise<Move> {
  const cacheKey = `move-${idOrName}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get<Move>(`/move/${idOrName}`)
    return response.data
  })
}

/**
 * Fetch paginated list of Pokemon
 */
export async function fetchPokemonList(
  offset: number = 0, 
  limit: number = 20
): Promise<PaginationInfo> {
  const cacheKey = `pokemon-list-${offset}-${limit}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get<PaginationInfo>(`/pokemon?offset=${offset}&limit=${limit}`)
    
    // Enhance the results with additional data
    const enhancedResults = await Promise.all(
      response.data.results.map(async (pokemon) => {
        try {
          const id = extractIdFromUrl(pokemon.url)
          const pokemonData = await fetchPokemon(id)
          
          return {
            ...pokemon,
            id,
            sprite: pokemonData.sprites.other?.['official-artwork']?.front_default || 
                   pokemonData.sprites.front_default,
            types: pokemonData.types.map(t => t.type.name as TypeName),
          }
        } catch (error) {
          console.warn(`Failed to fetch data for ${pokemon.name}:`, error)
          return {
            ...pokemon,
            id: extractIdFromUrl(pokemon.url),
          }
        }
      })
    )
    
    return {
      ...response.data,
      results: enhancedResults,
    }
  })
}

/**
 * Search Pokemon by name (fuzzy search)
 */
export async function searchPokemon(query: string, limit: number = 20): Promise<PokemonListItem[]> {
  const cacheKey = `search-${query.toLowerCase()}-${limit}`
  
  return cachedRequest(cacheKey, async () => {
    // For now, we'll fetch a larger list and filter client-side
    // In a production app, you might want to use a dedicated search service
    const allPokemon = await fetchPokemonList(0, 1000)
    
    const filtered = allPokemon.results
      .filter(pokemon => 
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
    
    return filtered
  })
}

/**
 * Fetch Pokemon by type
 */
export async function fetchPokemonByType(type: TypeName): Promise<PokemonListItem[]> {
  const cacheKey = `type-${type}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get(`/type/${type}`)
    
    const pokemonList = response.data.pokemon.map((p: any) => ({
      id: extractIdFromUrl(p.pokemon.url),
      name: p.pokemon.name,
      url: p.pokemon.url,
    }))
    
    // Sort by ID and limit to reasonable number
    return pokemonList
      .sort((a: PokemonListItem, b: PokemonListItem) => a.id - b.id)
      .slice(0, 100)
  })
}

/**
 * Fetch random Pokemon
 */
export async function fetchRandomPokemon(): Promise<Pokemon> {
  const randomId = Math.floor(Math.random() * 1010) + 1
  return fetchPokemon(randomId)
}

/**
 * Fetch multiple Pokemon by IDs (for favorites, team, etc.)
 */
export async function fetchMultiplePokemon(ids: number[]): Promise<Pokemon[]> {
  const promises = ids.map(id => fetchPokemon(id))
  const results = await Promise.allSettled(promises)
  
  return results
    .filter((result): result is PromiseFulfilledResult<Pokemon> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value)
}

/**
 * Fetch Pokemon with complete data (Pokemon + Species + Evolution)
 */
export async function fetchCompleteePokemonData(idOrName: string | number) {
  const pokemon = await fetchPokemon(idOrName)
  const species = await fetchPokemonSpecies(idOrName)
  
  let evolutionChain = null
  try {
    const evolutionId = extractIdFromUrl(species.evolution_chain.url)
    evolutionChain = await fetchEvolutionChain(evolutionId)
  } catch (error) {
    console.warn('Failed to fetch evolution chain:', error)
  }
  
  return {
    pokemon,
    species,
    evolutionChain,
  }
}

/**
 * Get type effectiveness data
 */
export async function fetchTypeEffectiveness(type: TypeName) {
  const cacheKey = `type-effectiveness-${type}`
  
  return cachedRequest(cacheKey, async () => {
    const response = await api.get(`/type/${type}`)
    return {
      doubleDamageTo: response.data.damage_relations.double_damage_to,
      halfDamageTo: response.data.damage_relations.half_damage_to,
      noDamageTo: response.data.damage_relations.no_damage_to,
      doubleDamageFrom: response.data.damage_relations.double_damage_from,
      halfDamageFrom: response.data.damage_relations.half_damage_from,
      noDamageFrom: response.data.damage_relations.no_damage_from,
    }
  })
}

/**
 * Utility function to extract ID from PokeAPI URL
 */
function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/$/)
  return matches ? parseInt(matches[1], 10) : 0
}

/**
 * Get Pokemon generation based on ID
 */
export function getPokemonGeneration(id: number): number {
  if (id <= 151) return 1
  if (id <= 251) return 2
  if (id <= 386) return 3
  if (id <= 493) return 4
  if (id <= 649) return 5
  if (id <= 721) return 6
  if (id <= 809) return 7
  if (id <= 905) return 8
  return 9
}

/**
 * Format Pokemon name for display
 */
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get Pokemon sprite URL with fallbacks
 */
export function getPokemonSprite(pokemon: Pokemon, shiny: boolean = false): string {
  const sprites = pokemon.sprites
  
  if (shiny) {
    return sprites.other?.['official-artwork']?.front_shiny ||
           sprites.front_shiny ||
           sprites.other?.['official-artwork']?.front_default ||
           sprites.front_default ||
           '/placeholder-pokemon.png'
  }
  
  return sprites.other?.['official-artwork']?.front_default ||
         sprites.front_default ||
         '/placeholder-pokemon.png'
}

/**
 * Calculate Pokemon stats total
 */
export function calculateStatsTotal(pokemon: Pokemon): number {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
}

/**
 * Get stat color based on value
 */
export function getStatColor(value: number): string {
  if (value >= 150) return 'bg-red-500'
  if (value >= 120) return 'bg-orange-500'
  if (value >= 90) return 'bg-yellow-500'
  if (value >= 60) return 'bg-green-500'
  if (value >= 30) return 'bg-blue-500'
  return 'bg-gray-500'
}

/**
 * Error handler for API requests
 */
export function handleApiError(error: any): string {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        return 'Pokemon not found'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return 'An error occurred while fetching data'
    }
  } else if (error.request) {
    return 'Network error. Please check your connection.'
  } else {
    return 'An unexpected error occurred'
  }
}
