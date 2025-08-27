import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Users, 
  Zap,
  Star,
  Search
} from 'lucide-react'
import { usePokemon } from '../contexts/PokemonContext'
import { useSearchPokemon } from '../hooks/usePokemonData'
import { formatPokemonName, fetchPokemon } from '../services/pokemonApi'
import { getTypeTailwindClass } from '../utils/typeColors'
import { TeamPokemon, TypeName } from '../types/pokemon'

/**
 * Team Builder page for creating and managing Pokemon teams
 */
const TeamBuilder: React.FC = () => {
  const { state, removeFromTeam, updateTeamPokemon, clearTeam, addToTeam } = usePokemon()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<TeamPokemon>>({})
  
  const { data: searchResults } = useSearchPokemon(searchQuery, searchQuery.length > 0)

  const handleEditPokemon = (index: number) => {
    setEditingIndex(index)
    setEditForm(state.team[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      updateTeamPokemon(editingIndex, editForm as TeamPokemon)
      setEditingIndex(null)
      setEditForm({})
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditForm({})
  }

  const calculateTeamStats = () => {
    if (state.team.length === 0) return null

    const typeCount: Record<string, number> = {}
    let totalLevel = 0

    state.team.forEach(pokemon => {
      totalLevel += pokemon.level
      pokemon.types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1
      })
    })

    return {
      averageLevel: Math.round(totalLevel / state.team.length),
      typeDistribution: typeCount,
      teamSize: state.team.length
    }
  }

  const teamStats = calculateTeamStats()

  const handleAddPokemonToTeam = async (pokemon: any) => {
    if (state.team.length >= 6) return
    
    try {
      // Fetch full Pokemon data to get moves
      const fullPokemonData = await fetchPokemon(pokemon.id)
      
      // Get first 4 moves from the Pokemon's moveset
      const availableMoves = fullPokemonData.moves.slice(0, 20) // First 20 moves
      const selectedMoves: string[] = []
      while (selectedMoves.length < 4 && availableMoves.length > 0) {
        const randomMove = availableMoves.splice(Math.floor(Math.random() * availableMoves.length), 1)[0]
        selectedMoves.push(randomMove.move.name)
      }
      
      // Create a team Pokemon object with moves
      const teamPokemon: TeamPokemon = {
        id: fullPokemonData.id,
        name: fullPokemonData.name,
        sprite: fullPokemonData.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fullPokemonData.id}.png`,
        types: fullPokemonData.types.map((type: any) => type.type.name),
        level: 50,
        moves: selectedMoves,
        nickname: formatPokemonName(fullPokemonData.name)
      }
      
      addToTeam(teamPokemon)
      setSearchQuery('') // Clear search after adding
    } catch (error) {
      console.error('Error adding Pokemon to team:', error)
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold pokemon-font gradient-text mb-4">
          Team Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Build your perfect Pokémon team! Add up to 6 Pokémon and customize their levels, 
          moves, and nicknames for battle.
        </p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {state.team.length}/6
          </div>
          <div className="text-gray-600 dark:text-gray-400">Team Members</div>
        </div>

        {teamStats && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {teamStats.averageLevel}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Average Level</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
                Type Coverage
              </h3>
              <div className="flex flex-wrap gap-1 justify-center">
                {Object.entries(teamStats.typeDistribution).map(([type, count]) => (
                  <span
                    key={type}
                    className={`text-xs px-2 py-1 rounded-full ${getTypeTailwindClass(type as TypeName)}`}
                  >
                    {type} ({count})
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Team Actions */}
      {state.team.length > 0 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={clearTeam}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear Team
          </button>
        </div>
      )}

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team Slots */}
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = state.team[index]
          const isEditing = editingIndex === index

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-h-80"
            >
              {pokemon ? (
                <div className="h-full flex flex-col">
                  {isEditing ? (
                    /* Edit Form */
                    <div className="space-y-4">
                      <div className="text-center">
                        <img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="w-20 h-20 mx-auto mb-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Nickname</label>
                        <input
                          type="text"
                          value={editForm.nickname || ''}
                          onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Level</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={editForm.level || 50}
                          onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Pokemon Display */
                    <>
                      <div className="text-center mb-4">
                        <img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="w-24 h-24 mx-auto mb-2"
                        />
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {pokemon.nickname || formatPokemonName(pokemon.name)}
                        </h3>
                        {pokemon.nickname && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ({formatPokemonName(pokemon.name)})
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center gap-1 mb-4">
                        {pokemon.types.map((type) => (
                          <span
                            key={type}
                            className={`text-xs px-2 py-1 rounded-full ${getTypeTailwindClass(type)}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Level {pokemon.level}
                        </div>
                      </div>

                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleEditPokemon(index)}
                          className="flex-1 flex items-center justify-center gap-2 btn-secondary"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => removeFromTeam(index)}
                          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Empty Slot */
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Plus className="h-12 w-12 mb-2" />
                  <p className="text-sm">Empty Slot</p>
                  <p className="text-xs">Add a Pokémon</p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add Pokemon Section */}
      {state.team.length < 6 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Add Pokémon to Team
          </h3>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Pokémon to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
              {searchResults.slice(0, 12).map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handleAddPokemonToTeam(pokemon)}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <img
                    src={pokemon.sprite || '/placeholder-pokemon.png'}
                    alt={pokemon.name}
                    className="w-16 h-16 mx-auto mb-2"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {formatPokemonName(pokemon.name)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Battle Readiness */}
      {state.team.length === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <Zap className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Team Complete!</h3>
          <p className="mb-4 opacity-90">
            Your team is ready for battle. Take them to the Battle Simulator to test their strength!
          </p>
          <button
            onClick={() => navigate('/battle')}
            className="inline-block bg-white text-green-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go to Battle Simulator
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default TeamBuilder
