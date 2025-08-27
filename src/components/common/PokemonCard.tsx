import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star, Sparkles } from 'lucide-react'
import { PokemonListItem } from '../../types/pokemon'
import { getTypeTailwindClass } from '../../utils/typeColors'
import { usePokemon } from '../../contexts/PokemonContext'
import ImageWithLoader from './ImageWithLoader'
import { formatPokemonName, getPokemonSprite } from '../../services/pokemonApi'

interface PokemonCardProps {
  pokemon: any | PokemonListItem
  index?: number
  showStats?: boolean
  compact?: boolean
}

/**
 * Reusable Pokemon card component with animations and interactive features
 */
const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  index = 0, 
  showStats = false, 
  compact = false 
}) => {
  const { isFavorite, addFavorite, removeFavorite, state } = usePokemon()
  const isFullPokemon = 'sprites' in pokemon
  const isFav = isFavorite(pokemon.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFav) {
      removeFavorite(pokemon.id)
    } else {
      addFavorite(pokemon.id)
    }
  }

  const sprite = isFullPokemon 
    ? getPokemonSprite(pokemon, state.showShinySprites)
    : (pokemon as PokemonListItem).sprite || '/placeholder-pokemon.png'

  const types = isFullPokemon 
    ? pokemon.types.map(t => t.type.name)
    : (pokemon as PokemonListItem).types || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <Link
        to={`/pokemon/${pokemon.id}`}
        className={`block pokemon-card overflow-hidden ${
          compact ? 'p-3' : 'p-6'
        } h-full relative`}
      >
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 ${
            isFav 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Shiny Indicator */}
        {state.showShinySprites && (
          <div className="absolute top-2 left-2 z-10">
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
          </div>
        )}

        {/* Pokemon Image */}
        <div className="relative mb-4">
          <img
            src={sprite}
            alt={pokemon.name}
            className={`mx-auto object-contain transition-transform duration-300 group-hover:scale-110 ${
              compact ? 'w-20 h-20' : 'w-32 h-32'
            }`}
            loading="lazy"
          />
          
          {/* Pokemon ID Badge */}
          <div className="absolute bottom-0 right-0 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="text-center">
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-2 ${
            compact ? 'text-sm' : 'text-lg'
          }`}>
            {formatPokemonName(pokemon.name)}
          </h3>

          {/* Types */}
          {types.length > 0 && (
            <div className="flex justify-center gap-1 mb-3 flex-wrap">
              {types.map((type) => (
                <span
                  key={type}
                  className={`pokemon-type-badge text-xs ${getTypeTailwindClass(type)} ${
                    compact ? 'px-2 py-0.5' : 'px-3 py-1'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          )}

          {/* Stats (for full Pokemon data) */}
          {showStats && isFullPokemon && !compact && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-600 dark:text-gray-400">
                  Height: {pokemon.height / 10}m
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Weight: {pokemon.weight / 10}kg
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Star className="h-3 w-3" />
                <span>
                  {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)} BST
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  )
}

export default PokemonCard
