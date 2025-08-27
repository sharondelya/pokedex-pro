import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Ruler, 
  Scale, 
  Star, 
  Zap,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react'
import ImageWithLoader from '../components/common/ImageWithLoader'
import { useCompletePokemonData } from '../hooks/usePokemonData'
import { usePokemon } from '../contexts/PokemonContext'
import { formatPokemonName, getPokemonSprite, calculateStatsTotal } from '../services/pokemonApi'
import { getTypeTailwindClass, getTypeEffectiveness } from '../utils/typeColors'
import { TypeName } from '../types/pokemon'

/**
 * Detailed Pokemon view with comprehensive information
 */
const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { 
    isFavorite, 
    addFavorite, 
    removeFavorite, 
    addToTeam, 
    addToRecent,
    state 
  } = usePokemon()
  
  const { data, isLoading, error } = useCompletePokemonData(id || '', !!id)
  
  const pokemon = data?.pokemon
  const species = data?.species
  const evolutionChain = data?.evolutionChain
  
  const isFav = pokemon ? isFavorite(pokemon.id) : false

  // Add to recently viewed when component mounts
  useEffect(() => {
    if (pokemon) {
      addToRecent({
        id: pokemon.id,
        name: pokemon.name,
        url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
        sprite: getPokemonSprite(pokemon, state.showShinySprites),
        types: pokemon.types.map(t => t.type.name as TypeName)
      })
    }
  }, [pokemon?.id, state.showShinySprites]) // Only depend on pokemon ID and shiny state

  const handleFavoriteToggle = () => {
    if (!pokemon) return
    
    if (isFav) {
      removeFavorite(pokemon.id)
    } else {
      addFavorite(pokemon.id)
    }
  }

  const handleAddToTeam = () => {
    if (!pokemon) return
    
    const teamPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      sprite: getPokemonSprite(pokemon, state.showShinySprites),
      types: pokemon.types.map(t => t.type.name as TypeName),
      level: 50,
      moves: pokemon.moves.slice(0, 4).map(m => m.move.name),
      nickname: formatPokemonName(pokemon.name)
    }
    
    addToTeam(teamPokemon)
  }

  const getStatColor = (value: number): string => {
    if (value >= 150) return 'bg-red-500'
    if (value >= 120) return 'bg-orange-500'
    if (value >= 90) return 'bg-yellow-500'
    if (value >= 60) return 'bg-green-500'
    if (value >= 30) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  const getFlavorText = () => {
    if (!species?.flavor_text_entries) return ''
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    )
    
    return englishEntry?.flavor_text.replace(/\f/g, ' ') || ''
  }

  const extractIdFromUrl = (url: string): number => {
    const matches = url.match(/\/(\d+)\/$/)
    return matches ? parseInt(matches[1]) : 0
  }

  const renderEvolutionChain = (chain: any): JSX.Element[] => {
    const evolutionSteps: JSX.Element[] = []
    
    const processChain = (currentChain: any, level: number = 0) => {
      const pokemonId = extractIdFromUrl(currentChain.species.url)
      const pokemonName = currentChain.species.name
      
      // Add current Pokemon
      evolutionSteps.push(
        <div key={`${pokemonName}-${level}`} className="flex flex-col items-center">
          <Link
            to={`/pokemon/${pokemonId}`}
            className="group flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
              alt={pokemonName}
              className="w-20 h-20 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium capitalize mt-2 text-center">
              {pokemonName.replace('-', ' ')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              #{pokemonId.toString().padStart(3, '0')}
            </span>
          </Link>
        </div>
      )
      
      // Add evolution arrows and process next evolutions
      if (currentChain.evolves_to && currentChain.evolves_to.length > 0) {
        currentChain.evolves_to.forEach((evolution: any, index: number) => {
          // Add arrow
          evolutionSteps.push(
            <div key={`arrow-${level}-${index}`} className="flex flex-col items-center justify-center px-4">
              <div className="text-2xl text-blue-500">→</div>
              {evolution.evolution_details && evolution.evolution_details[0] && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                  {evolution.evolution_details[0].min_level && (
                    <div>Lv. {evolution.evolution_details[0].min_level}</div>
                  )}
                  {evolution.evolution_details[0].item && (
                    <div className="capitalize">
                      {evolution.evolution_details[0].item.name.replace('-', ' ')}
                    </div>
                  )}
                  {evolution.evolution_details[0].trigger && 
                   evolution.evolution_details[0].trigger.name !== 'level-up' && (
                    <div className="capitalize">
                      {evolution.evolution_details[0].trigger.name.replace('-', ' ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
          
          // Process next evolution
          processChain(evolution, level + 1)
        })
      }
    }
    
    processChain(chain)
    return evolutionSteps
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading Pokémon details...
        </span>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pokémon Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The Pokémon you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Link to="/pokemon" className="btn-primary">
          Back to Pokédex
        </Link>
      </div>
    )
  }

  const statsTotal = calculateStatsTotal(pokemon)

  return (
    <div className="space-y-8 pb-8">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link
          to="/pokemon"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pokédex
        </Link>
      </div>

      {/* Main Pokemon Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Pokemon Image */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center relative">
            {state.showShinySprites && (
              <Sparkles className="absolute top-4 right-4 h-6 w-6 text-yellow-500" />
            )}
            
            <ImageWithLoader
              src={getPokemonSprite(pokemon, state.showShinySprites)}
              alt={pokemon.name}
              className="w-64 h-64 mx-auto animate-float"
              fallbackSrc="/placeholder-pokemon.png"
            />
            
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                #{pokemon.id.toString().padStart(3, '0')}
              </div>
              <h1 className="text-3xl font-bold pokemon-font text-gray-900 dark:text-gray-100">
                {formatPokemonName(pokemon.name)}
              </h1>
            </div>
          </div>

          {/* Types and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-center gap-2 mb-6">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`pokemon-type-badge text-lg px-4 py-2 ${getTypeTailwindClass(type.type.name)}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFav
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                {isFav ? 'Favorited' : 'Add to Favorites'}
              </button>

              <button
                onClick={handleAddToTeam}
                disabled={state.team.length >= 6}
                className="flex items-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Users className="h-4 w-4" />
                Add to Team
              </button>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Physical Attributes
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Ruler className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Height</div>
                  <div className="font-semibold">{pokemon.height / 10}m</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Weight</div>
                  <div className="font-semibold">{pokemon.weight / 10}kg</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Stats and Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Base Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Base Stats
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Star className="h-4 w-4" />
                Total: {statsTotal}
              </div>
            </div>

            <div className="space-y-3">
              {pokemon.stats.map((stat) => {
                const statName = stat.stat.name.replace('-', ' ')
                const percentage = (stat.base_stat / 255) * 100

                return (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium">
                        {statName === 'special attack' ? 'Sp. Atk' :
                         statName === 'special defense' ? 'Sp. Def' :
                         statName}
                      </span>
                      <span className="font-semibold">{stat.base_stat}</span>
                    </div>
                    <div className="stat-bar h-2">
                      <div
                        className={`stat-fill h-full rounded-full ${getStatColor(stat.base_stat)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Abilities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Abilities
            </h3>
            
            <div className="space-y-2">
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability.ability.name}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    ability.is_hidden
                      ? 'bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {ability.is_hidden && <Zap className="h-4 w-4 text-purple-500" />}
                  <span className="font-medium capitalize">
                    {ability.ability.name.replace('-', ' ')}
                  </span>
                  {ability.is_hidden && (
                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {getFlavorText() && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {getFlavorText()}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Evolution Chain */}
      {evolutionChain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Evolution Chain
          </h3>
          
          <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4">
            {renderEvolutionChain(evolutionChain.chain)}
          </div>
        </motion.div>
      )}

      {/* Moves */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Moves
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {pokemon.moves.slice(0, 50).map((move) => (
            <div
              key={move.move.name}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div className="font-medium capitalize text-sm">
                {move.move.name.replace('-', ' ')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {(() => {
                  const levelLearned = move.version_group_details.find(detail => 
                    detail.level_learned_at > 0
                  )?.level_learned_at
                  
                  if (levelLearned) {
                    return `Level ${levelLearned}`
                  }
                  
                  const learnMethod = move.version_group_details[0]?.move_learn_method?.name
                  if (learnMethod === 'machine') return 'TM/TR'
                  if (learnMethod === 'egg') return 'Egg Move'
                  if (learnMethod === 'tutor') return 'Move Tutor'
                  if (learnMethod === 'level-up') return 'Level 1'
                  
                  return 'Special'
                })()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Type Effectiveness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Type Effectiveness
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
              Weak to (2x damage)
            </h4>
            <div className="space-y-1">
              {/* This would calculate type effectiveness */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Effectiveness calculation coming soon...
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
              Resistant to (0.5x damage)
            </h4>
            <div className="space-y-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Effectiveness calculation coming soon...
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-600 dark:text-gray-400 mb-2">
              Immune to (0x damage)
            </h4>
            <div className="space-y-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Effectiveness calculation coming soon...
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PokemonDetail
