import { useQuery, useInfiniteQuery } from 'react-query'
import { 
  fetchPokemon, 
  fetchPokemonSpecies, 
  fetchEvolutionChain, 
  fetchPokemonList, 
  fetchCompleteePokemonData,
  fetchMultiplePokemon,
  fetchPokemonByType,
  searchPokemon,
  fetchRandomPokemon,
  handleApiError
} from '../services/pokemonApi'
import { TypeName } from '../types/pokemon'

/**
 * Custom hooks for Pokemon data fetching with React Query
 * Provides caching, loading states, and error handling
 */

/**
 * Hook to fetch a single Pokemon
 */
export function usePokemon(idOrName: string | number, enabled: boolean = true) {
  return useQuery(
    ['pokemon', idOrName],
    () => fetchPokemon(idOrName),
    {
      enabled: enabled && !!idOrName,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching Pokemon:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch Pokemon species data
 */
export function usePokemonSpecies(idOrName: string | number, enabled: boolean = true) {
  return useQuery(
    ['pokemon-species', idOrName],
    () => fetchPokemonSpecies(idOrName),
    {
      enabled: enabled && !!idOrName,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching Pokemon species:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch complete Pokemon data (Pokemon + Species + Evolution)
 */
export function useCompletePokemonData(idOrName: string | number, enabled: boolean = true) {
  return useQuery(
    ['complete-pokemon', idOrName],
    () => fetchCompleteePokemonData(idOrName),
    {
      enabled: enabled && !!idOrName,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching complete Pokemon data:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch Pokemon list with infinite scrolling
 */
export function usePokemonList(limit: number = 20) {
  return useInfiniteQuery(
    ['pokemon-list', limit],
    ({ pageParam = 0 }) => fetchPokemonList(pageParam, limit),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next) {
          const url = new URL(lastPage.next)
          return parseInt(url.searchParams.get('offset') || '0')
        }
        return undefined
      },
      staleTime: 10 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching Pokemon list:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to search Pokemon
 */
export function useSearchPokemon(query: string, enabled: boolean = true) {
  return useQuery(
    ['search-pokemon', query],
    () => searchPokemon(query),
    {
      enabled: enabled && query.length > 0,
      staleTime: 2 * 60 * 1000,
      onError: (error) => {
        console.error('Error searching Pokemon:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch Pokemon by type
 */
export function usePokemonByType(type: TypeName, enabled: boolean = true) {
  return useQuery(
    ['pokemon-by-type', type],
    () => fetchPokemonByType(type),
    {
      enabled: enabled && !!type,
      staleTime: 10 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching Pokemon by type:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch multiple Pokemon (for favorites, team, etc.)
 */
export function useMultiplePokemon(ids: number[], enabled: boolean = true) {
  return useQuery(
    ['multiple-pokemon', ids],
    () => fetchMultiplePokemon(ids),
    {
      enabled: enabled && ids.length > 0,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching multiple Pokemon:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch a random Pokemon
 */
export function useRandomPokemon(trigger: number) {
  return useQuery(
    ['random-pokemon', trigger],
    fetchRandomPokemon,
    {
      enabled: trigger > 0,
      staleTime: 0, // Don't cache random Pokemon
      cacheTime: 0,
      onError: (error) => {
        console.error('Error fetching random Pokemon:', handleApiError(error))
      },
    }
  )
}

/**
 * Hook to fetch evolution chain
 */
export function useEvolutionChain(id: number, enabled: boolean = true) {
  return useQuery(
    ['evolution-chain', id],
    () => fetchEvolutionChain(id),
    {
      enabled: enabled && !!id,
      staleTime: 10 * 60 * 1000,
      onError: (error) => {
        console.error('Error fetching evolution chain:', handleApiError(error))
      },
    }
  )
}
