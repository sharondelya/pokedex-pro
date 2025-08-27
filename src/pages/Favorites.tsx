import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, Users } from 'lucide-react'
import { usePokemon } from '../contexts/PokemonContext'
import { useMultiplePokemon } from '../hooks/usePokemonData'
import PokemonCard from '../components/common/PokemonCard'

/**
 * Favorites page displaying user's favorite Pokemon
 */
const Favorites: React.FC = () => {
  const { state, removeFavorite, clearTeam } = usePokemon()
  const { data: favoritesPokemon, isLoading } = useMultiplePokemon(state.favorites)

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      state.favorites.forEach(id => removeFavorite(id))
    }
  }

  if (state.favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          No Favorites Yet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Start exploring Pokémon and add them to your favorites by clicking the heart icon on any Pokémon card.
        </p>
        <a
          href="/pokemon"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Explore Pokémon
        </a>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold pokemon-font gradient-text mb-4">
            Favorite Pokémon
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your collection of favorite Pokémon. These are the ones that caught your eye!
          </p>
        </div>

        {/* Stats and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
            <span className="text-2xl font-bold text-red-500">{state.favorites.length}</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">Favorites</span>
          </div>
        </div>

        {state.favorites.length > 0 && (
          <button
            onClick={handleClearFavorites}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
        </div>

        {/* Favorites Grid */}
      {isLoading ? (
        <div className="pokemon-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
            >
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pokemon-grid">
          {favoritesPokemon?.map((pokemon, index) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              index={index}
              showStats={true}
            />
          ))}
        </div>
      )}
      </div>
    </motion.div>
  )
}

export default Favorites
