import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Loader2 } from 'lucide-react'
import { useRandomPokemon } from '../hooks/usePokemonData'
import PokemonCard from '../components/common/PokemonCard'

/**
 * Random Pokemon generator page
 */
const RandomPokemon: React.FC = () => {
  const [triggerRandom, setTriggerRandom] = useState(0)
  const { data: pokemon, isLoading, error } = useRandomPokemon(triggerRandom)

  const handleGenerateRandom = () => {
    setTriggerRandom(prev => prev + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold pokemon-font text-gray-900 dark:text-gray-100 mb-4">
          Random Pokémon Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Discover new Pokémon with our random generator!
        </p>
        
        <button
          onClick={handleGenerateRandom}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Shuffle className="h-5 w-5" />
          )}
          {isLoading ? 'Generating...' : 'Generate Random Pokémon'}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-8">
          Failed to generate random Pokémon. Please try again.
        </div>
      )}

      {pokemon && (
        <motion.div
          key={pokemon.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <PokemonCard pokemon={pokemon} />
        </motion.div>
      )}
    </motion.div>
  )
}

export default RandomPokemon
