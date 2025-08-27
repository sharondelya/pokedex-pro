import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, X, BarChart3 } from 'lucide-react'
import { useSearchPokemon } from '../hooks/usePokemonData'
import { fetchPokemon } from '../services/pokemonApi'
import { formatPokemonName, getPokemonSprite, calculateStatsTotal } from '../services/pokemonApi'
import { getTypeTailwindClass } from '../utils/typeColors'
import { Pokemon } from '../types/pokemon'

/**
 * Pokemon comparison tool
 */
const Compare: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<(Pokemon | null)[]>(Array(4).fill(null))
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  const { data: searchResults } = useSearchPokemon(searchQuery, searchQuery.length > 0)

  const addPokemon = async (pokemonId: number) => {
    console.log('addPokemon called with ID:', pokemonId, 'activeSlot:', activeSlot)
    
    if (activeSlot === null || selectedPokemon.filter(p => p !== null).length >= 4) {
      console.log('Early return - filled slots:', selectedPokemon.filter(p => p !== null).length, 'activeSlot:', activeSlot)
      return
    }
    
    try {
      console.log('Fetching Pokemon data for ID:', pokemonId)
      // Use the existing API service instead of raw fetch
      const pokemonData = await fetchPokemon(pokemonId)
      console.log('Pokemon data fetched:', pokemonData.name)
      
      // Create a new array with the Pokemon added at the correct slot
      const newSelectedPokemon = [...selectedPokemon]
      newSelectedPokemon[activeSlot] = pokemonData
      
      console.log('Setting Pokemon in slot', activeSlot, ':', pokemonData.name)
      setSelectedPokemon(newSelectedPokemon)
      setActiveSlot(null)
      setSearchQuery('')
    } catch (error) {
      console.error('Failed to add Pokemon:', error)
    }
  }

  const removePokemon = (index: number) => {
    const newSelectedPokemon = [...selectedPokemon]
    newSelectedPokemon[index] = null
    setSelectedPokemon(newSelectedPokemon)
  }

  const getStatComparison = (statName: string) => {
    const validPokemon = selectedPokemon.filter((p): p is Pokemon => p !== null)
    if (validPokemon.length < 2) return []
    
    const stats = validPokemon.map(pokemon => {
      const stat = pokemon.stats.find(s => s.stat.name === statName)
      return stat ? stat.base_stat : 0
    })
    
    const maxStat = Math.max(...stats)
    
    return stats.map(stat => ({
      value: stat,
      percentage: maxStat > 0 ? (stat / maxStat) * 100 : 0,
      isHighest: stat === maxStat
    }))
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold pokemon-font gradient-text mb-4">
          Pokémon Comparison
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Compare up to 4 Pokémon side by side. Analyze their stats, types, and abilities to make informed decisions.
        </p>
      </div>

      {/* Pokemon Selection Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => {
          const pokemon = selectedPokemon[index]
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 min-h-96 relative overflow-hidden"
            >
              {pokemon ? (
                <div className="text-center relative z-10">
                  <button
                    onClick={() => removePokemon(index)}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 absolute -top-8 -right-8"></div>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 absolute -bottom-6 -left-6"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <img
                      src={getPokemonSprite(pokemon)}
                      alt={pokemon.name}
                      className="w-28 h-28 mx-auto mb-4 drop-shadow-lg"
                    />
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {formatPokemonName(pokemon.name)}
                    </h3>
                    
                    <div className="flex justify-center gap-1 mb-4">
                      {pokemon.types.map((type) => (
                        <span
                          key={type.type.name}
                          className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${getTypeTailwindClass(type.type.name)}`}
                        >
                          {type.type.name.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    
                    {/* Pokemon Details */}
                    <div className="space-y-3 text-sm">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Base Stats Total</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {calculateStatsTotal(pokemon)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-inner">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Height</div>
                          <div className="font-semibold">{(pokemon.height / 10).toFixed(1)}m</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-inner">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Weight</div>
                          <div className="font-semibold">{(pokemon.weight / 10).toFixed(1)}kg</div>
                        </div>
                      </div>
                      
                      {/* Top Stats */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-2">Highest Stats</div>
                        <div className="space-y-1">
                          {pokemon.stats
                            .sort((a, b) => b.base_stat - a.base_stat)
                            .slice(0, 2)
                            .map((stat) => (
                              <div key={stat.stat.name} className="flex justify-between items-center">
                                <span className="text-xs capitalize">{stat.stat.name.replace('-', ' ')}</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">{stat.base_stat}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      {/* Abilities */}
                      {pokemon.abilities && pokemon.abilities.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                          <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-2">Abilities</div>
                          <div className="space-y-1">
                            {pokemon.abilities.slice(0, 2).map((ability) => (
                              <div key={ability.ability.name} className="text-xs">
                                <span className="font-medium capitalize">
                                  {ability.ability.name.replace('-', ' ')}
                                </span>
                                {ability.is_hidden && (
                                  <span className="ml-1 text-purple-500 dark:text-purple-400">(Hidden)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  {activeSlot === index ? (
                    <div className="w-full">
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search Pokémon..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          autoFocus
                        />
                      </div>
                      
                      {searchResults && searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {searchResults.slice(0, 5).map((result) => (
                            <button
                              key={result.id}
                              onClick={() => addPokemon(result.id)}
                              className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={result.sprite || '/placeholder-pokemon.png'}
                                  alt={result.name}
                                  className="w-8 h-8"
                                />
                                <span className="text-sm font-medium">
                                  {formatPokemonName(result.name)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <button
                        onClick={() => setActiveSlot(null)}
                        className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveSlot(index)}
                      className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <Plus className="h-12 w-12 mb-2" />
                      <span className="text-sm">Add Pokémon</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Comparison Results */}
      {selectedPokemon.filter(p => p !== null).length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          {/* Stats Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Base Stats Comparison
            </h3>
            
            <div className="space-y-4">
              {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((statName) => {
                const comparisons = getStatComparison(statName)
                const validPokemon = selectedPokemon.filter(p => p !== null)
                
                return (
                  <div key={statName}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium capitalize">
                        {statName.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${validPokemon.length}, 1fr)` }}>
                      {comparisons.map((comparison, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-semibold mb-1">
                            {comparison.value}
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                comparison.isHighest ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${comparison.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Type Matchups */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Type Matchups
            </h3>
            
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedPokemon.filter(p => p !== null).length}, 1fr)` }}>
              {selectedPokemon.filter((p): p is Pokemon => p !== null).map((pokemon, index) => (
                <div key={index} className="text-center">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {formatPokemonName(pokemon.name)}
                  </h4>
                  <div className="space-y-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`block text-xs px-3 py-2 rounded-full font-semibold ${getTypeTailwindClass(type.type.name)}`}
                      >
                        {type.type.name.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mt-8">
            <h3 className="text-lg font-semibold mb-4">Comparison Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {(() => {
                const validPokemon = selectedPokemon.filter((p): p is Pokemon => p !== null)
                const highestBST = validPokemon.reduce((prev, current) => 
                  calculateStatsTotal(current) > calculateStatsTotal(prev) ? current : prev
                )
                const mostTypes = validPokemon.reduce((prev, current) => 
                  current.types.length > prev.types.length ? current : prev
                )
                return (
                  <>
                    <div>
                      <strong>Highest BST:</strong> {formatPokemonName(highestBST.name)} ({calculateStatsTotal(highestBST)})
                    </div>
                    <div>
                      <strong>Most Types:</strong> {formatPokemonName(mostTypes.name)} ({mostTypes.types.length} types)
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {selectedPokemon.filter(p => p !== null).length === 0 && (
        <div className="text-center py-20">
          <BarChart3 className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Start Comparing Pokémon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Add at least 2 Pokémon to see detailed comparisons of their stats, types, and abilities.
          </p>
        </div>
      )}
    </div>
  )
}

export default Compare
