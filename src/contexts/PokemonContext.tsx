import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { TeamPokemon, PokemonListItem, TypeName } from '../types/pokemon'

interface PokemonState {
  favorites: number[]
  team: TeamPokemon[]
  recentlyViewed: PokemonListItem[]
  searchHistory: string[]
  typeFilters: TypeName[]
  showShinySprites: boolean
  dailyPokemon: PokemonListItem | null
}

type PokemonAction =
  | { type: 'ADD_FAVORITE'; payload: number }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'ADD_TO_TEAM'; payload: TeamPokemon }
  | { type: 'REMOVE_FROM_TEAM'; payload: number }
  | { type: 'UPDATE_TEAM_POKEMON'; payload: { index: number; pokemon: TeamPokemon } }
  | { type: 'CLEAR_TEAM' }
  | { type: 'ADD_TO_RECENT'; payload: PokemonListItem }
  | { type: 'ADD_TO_SEARCH_HISTORY'; payload: string }
  | { type: 'SET_TYPE_FILTERS'; payload: TypeName[] }
  | { type: 'TOGGLE_SHINY_SPRITES' }
  | { type: 'SET_DAILY_POKEMON'; payload: PokemonListItem }
  | { type: 'LOAD_STATE'; payload: Partial<PokemonState> }

const initialState: PokemonState = {
  favorites: [],
  team: [],
  recentlyViewed: [],
  searchHistory: [],
  typeFilters: [],
  showShinySprites: false,
  dailyPokemon: null,
}

function pokemonReducer(state: PokemonState, action: PokemonAction): PokemonState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.favorites.includes(action.payload)) return state
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      }

    case 'ADD_TO_TEAM':
      if (state.team.length >= 6) return state
      return {
        ...state,
        team: [...state.team, action.payload],
      }

    case 'REMOVE_FROM_TEAM':
      return {
        ...state,
        team: state.team.filter((_, index) => index !== action.payload),
      }

    case 'UPDATE_TEAM_POKEMON':
      return {
        ...state,
        team: state.team.map((pokemon, index) =>
          index === action.payload.index ? action.payload.pokemon : pokemon
        ),
      }

    case 'CLEAR_TEAM':
      return {
        ...state,
        team: [],
      }

    case 'ADD_TO_RECENT':
      const filtered = state.recentlyViewed.filter(p => p.id !== action.payload.id)
      return {
        ...state,
        recentlyViewed: [action.payload, ...filtered].slice(0, 10),
      }

    case 'ADD_TO_SEARCH_HISTORY':
      if (state.searchHistory.includes(action.payload)) return state
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory].slice(0, 20),
      }

    case 'SET_TYPE_FILTERS':
      return {
        ...state,
        typeFilters: action.payload,
      }

    case 'TOGGLE_SHINY_SPRITES':
      return {
        ...state,
        showShinySprites: !state.showShinySprites,
      }

    case 'SET_DAILY_POKEMON':
      return {
        ...state,
        dailyPokemon: action.payload,
      }

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}

interface PokemonContextType {
  state: PokemonState
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  addToTeam: (pokemon: TeamPokemon) => void
  removeFromTeam: (index: number) => void
  updateTeamPokemon: (index: number, pokemon: TeamPokemon) => void
  clearTeam: () => void
  addToRecent: (pokemon: PokemonListItem) => void
  addToSearchHistory: (query: string) => void
  setTypeFilters: (types: TypeName[]) => void
  toggleShinySprites: () => void
  setDailyPokemon: (pokemon: PokemonListItem) => void
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

/**
 * Pokemon context provider that manages global Pokemon-related state
 * Includes favorites, team builder, recently viewed, search history, and preferences
 * Persists data to localStorage for user convenience
 */
export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pokemonReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('pokemonAppState')
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: 'LOAD_STATE', payload: parsedState })
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('pokemonAppState', JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save state to localStorage:', error)
    }
  }, [state])

  // Generate daily Pokemon if not set or if it's a new day
  useEffect(() => {
    const today = new Date().toDateString()
    const lastDailyDate = localStorage.getItem('lastDailyPokemonDate')
    
    if (!state.dailyPokemon || lastDailyDate !== today) {
      // Generate a random Pokemon ID (1-1010 for all Pokemon including newer generations)
      const randomId = Math.floor(Math.random() * 1010) + 1
      const dailyPokemon: PokemonListItem = {
        id: randomId,
        name: `pokemon-${randomId}`,
        url: `https://pokeapi.co/api/v2/pokemon/${randomId}/`,
      }
      
      dispatch({ type: 'SET_DAILY_POKEMON', payload: dailyPokemon })
      localStorage.setItem('lastDailyPokemonDate', today)
    }
  }, [state.dailyPokemon])

  const addFavorite = useCallback((id: number) => {
    dispatch({ type: 'ADD_FAVORITE', payload: id })
  }, [])

  const removeFavorite = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id })
  }, [])

  const isFavorite = useCallback((id: number) => {
    return state.favorites.includes(id)
  }, [state.favorites])

  const addToTeam = useCallback((pokemon: TeamPokemon) => {
    dispatch({ type: 'ADD_TO_TEAM', payload: pokemon })
  }, [])

  const removeFromTeam = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FROM_TEAM', payload: index })
  }, [])

  const updateTeamPokemon = useCallback((index: number, pokemon: TeamPokemon) => {
    dispatch({ type: 'UPDATE_TEAM_POKEMON', payload: { index, pokemon } })
  }, [])

  const clearTeam = useCallback(() => {
    dispatch({ type: 'CLEAR_TEAM' })
  }, [])

  const addToRecent = useCallback((pokemon: PokemonListItem) => {
    dispatch({ type: 'ADD_TO_RECENT', payload: pokemon })
  }, [])

  const addToSearchHistory = useCallback((query: string) => {
    if (query.trim()) {
      dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: query.trim() })
    }
  }, [])

  const setTypeFilters = useCallback((types: TypeName[]) => {
    dispatch({ type: 'SET_TYPE_FILTERS', payload: types })
  }, [])

  const toggleShinySprites = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHINY_SPRITES' })
  }, [])

  const setDailyPokemon = (pokemon: PokemonListItem) => {
    dispatch({ type: 'SET_DAILY_POKEMON', payload: pokemon })
  }

  return (
    <PokemonContext.Provider
      value={{
        state,
        addFavorite,
        removeFavorite,
        isFavorite,
        addToTeam,
        removeFromTeam,
        updateTeamPokemon,
        clearTeam,
        addToRecent,
        addToSearchHistory,
        setTypeFilters,
        toggleShinySprites,
        setDailyPokemon,
      }}
    >
      {children}
    </PokemonContext.Provider>
  )
}

export function usePokemon() {
  const context = useContext(PokemonContext)
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider')
  }
  return context
}
