import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, Loader2, AlertCircle } from 'lucide-react'
import { usePokemonList, useSearchPokemon } from '../hooks/usePokemonData'
import { usePokemon } from '../contexts/PokemonContext'
import PokemonCard from '../components/common/PokemonCard'
import { TypeName } from '../types/pokemon'
import { getTypeTailwindClass } from '../utils/typeColors'

/**
 * Pokemon list page with search, filtering, and infinite scroll
 */
const PokemonList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<TypeName[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const { addToSearchHistory, addToRecent } = usePokemon()
  
  // Use search when query exists, otherwise use paginated list
  const { 
    data: searchResults, 
    isLoading: isSearching,
    error: searchError 
  } = useSearchPokemon(searchQuery, searchQuery.length > 0)
  
  const {
    data: pokemonPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingList,
    error: listError
  } = usePokemonList(20)

  const allTypes: TypeName[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]

  // Combine and filter Pokemon data
  const pokemonData = useMemo(() => {
    let pokemon = searchQuery 
      ? searchResults || []
      : pokemonPages?.pages.flatMap(page => page.results) || []

    // Filter by selected types
    if (selectedTypes.length > 0) {
      pokemon = pokemon.filter(p => 
        p.types && p.types.some(type => selectedTypes.includes(type))
      )
    }

    return pokemon
  }, [searchQuery, searchResults, pokemonPages, selectedTypes])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      addToSearchHistory(query)
    }
  }

  const toggleTypeFilter = (type: TypeName) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSearchQuery('')
  }

  const isLoading = isSearching || isLoadingList
  const error = searchError || listError

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold pokemon-font gradient-text mb-4">
          Pokédex
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover and explore all Pokémon with advanced search and filtering capabilities.
          Click on any Pokémon to view detailed information.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input pl-10"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 ${
                selectedTypes.length > 0 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {selectedTypes.length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {selectedTypes.length}
                </span>
              )}
            </button>

            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`filter-chip ${
                    selectedTypes.includes(type)
                      ? 'filter-chip-active'
                      : 'filter-chip-inactive'
                  } ${getTypeTailwindClass(type)}`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {(selectedTypes.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Results */}
      <div className="min-h-96">
        {isLoading && pokemonData.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading Pokémon...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
            <span className="text-red-600 dark:text-red-400">
              Failed to load Pokémon. Please try again.
            </span>
          </div>
        ) : pokemonData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Pokémon found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'Search results' : 'All Pokémon'}: {pokemonData.length} found
              </p>
            </div>

            {/* Pokemon Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'pokemon-grid'
                : 'space-y-4'
            }>
              {pokemonData.map((pokemon, index) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  index={index}
                  showStats={viewMode === 'list'}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>

            {/* Load More Button */}
            {!searchQuery && hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Pokémon'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PokemonList
