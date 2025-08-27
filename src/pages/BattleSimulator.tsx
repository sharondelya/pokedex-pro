import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  RotateCcw, 
  Users, 
  Shield, 
  Trophy,
  ArrowRight,
  BarChart3,
  Swords
} from 'lucide-react'
import { usePokemon } from '../contexts/PokemonContext'
import { formatPokemonName, fetchPokemon } from '../services/pokemonApi'
import { TeamPokemon } from '../types/pokemon'

interface BattleLogEntry {
  type: 'player-move' | 'ai-move' | 'faint' | 'victory' | 'defeat' | 'info'
  message: string
  damage?: number
  timestamp: number
  id?: string
}

interface BattleState {
  playerTeam: TeamPokemon[]
  aiTeam: TeamPokemon[]
  currentPlayerPokemon: number
  currentAiPokemon: number
  playerHP: number[]
  aiHP: number[]
  turn: 'player' | 'ai'
  battleLog: BattleLogEntry[]
  battleStarted: boolean
  battleEnded: boolean
  winner: 'player' | 'ai' | null
}

/**
 * Battle Simulator with turn-based combat system
 */
const BattleSimulator: React.FC = () => {
  const { state } = usePokemon()
  const [battleMode, setBattleMode] = useState<'setup' | 'battle' | 'results'>('setup')
  const [toastMessages, setToastMessages] = useState<BattleLogEntry[]>([])
  const [battleState, setBattleState] = useState<BattleState>({
    playerTeam: [],
    aiTeam: [],
    currentPlayerPokemon: 0,
    currentAiPokemon: 0,
    playerHP: [],
    aiHP: [],
    turn: 'player',
    battleLog: [],
    battleStarted: false,
    battleEnded: false,
    winner: null
  })

  // Add new battle log entries as toast messages
  const addToastMessage = (logEntry: BattleLogEntry) => {
    // Create unique ID for each toast to avoid timestamp collisions
    const uniqueToast = {
      ...logEntry,
      id: `${logEntry.timestamp}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setToastMessages(prev => [...prev, uniqueToast])
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToastMessages(prev => prev.filter(msg => msg.id !== uniqueToast.id))
    }, 3000)
  }


  // Generate dynamic AI team
  const generateAITeam = async () => {
    const aiTeam: TeamPokemon[] = []
    const allPokemonIds = Array.from({length: 150}, (_, i) => i + 1) // Gen 1 Pokemon
    const selectedIds: number[] = []
    
    // Select 6 random Pokemon
    while (selectedIds.length < 6) {
      const randomId = allPokemonIds[Math.floor(Math.random() * allPokemonIds.length)]
      if (!selectedIds.includes(randomId)) {
        selectedIds.push(randomId)
      }
    }
    
    // Fetch Pokemon data for each selected ID
    for (const id of selectedIds) {
      try {
        const pokemonData = await fetchPokemon(id)
        
        // Get random moves from the Pokemon's moveset
        const availableMoves = pokemonData.moves.slice(0, 20) // First 20 moves
        const selectedMoves: string[] = []
        while (selectedMoves.length < 4 && availableMoves.length > 0) {
          const randomMove = availableMoves.splice(Math.floor(Math.random() * availableMoves.length), 1)[0]
          selectedMoves.push(randomMove.move.name)
        }
        
        aiTeam.push({
          id: pokemonData.id,
          name: pokemonData.name,
          level: 45 + Math.floor(Math.random() * 15),
          moves: selectedMoves,
          sprite: pokemonData.sprites.front_default || '/placeholder-pokemon.png',
          types: pokemonData.types.map(type => type.type.name)
        })
      } catch (error) {
        console.error(`Failed to fetch Pokemon ${id}:`, error)
      }
    }
    
    return aiTeam
  }

  const startBattle = async () => {
    if (state.team.length === 0) return
    
    const aiTeam = await generateAITeam()
    const playerHP = state.team.map(() => 100)
    const aiHP = aiTeam.map(() => 100)
    
    const startLog = {
      type: 'info' as const,
      message: 'Battle started!',
      timestamp: Date.now()
    }
    
    setBattleState({
      playerTeam: state.team,
      aiTeam,
      currentPlayerPokemon: 0,
      currentAiPokemon: 0,
      playerHP,
      aiHP,
      turn: 'player',
      battleLog: [startLog],
      battleStarted: true,
      battleEnded: false,
      winner: null
    })
    
    addToastMessage(startLog)
    setBattleMode('battle')
  }

  const executeMove = (moveIndex: number) => {
    if (battleState.turn !== 'player' || battleState.battleEnded) return
    
    const playerPokemon = battleState.playerTeam[battleState.currentPlayerPokemon]
    const aiPokemon = battleState.aiTeam[battleState.currentAiPokemon]
    const moveName = playerPokemon.moves[moveIndex] || `Move ${moveIndex + 1}`
    
    const playerDamage = Math.floor(Math.random() * 30) + 10
    const newAiHP = [...battleState.aiHP]
    newAiHP[battleState.currentAiPokemon] = Math.max(0, newAiHP[battleState.currentAiPokemon] - playerDamage)
    
    const playerMoveLog = {
      type: 'player-move' as const,
      message: `${formatPokemonName(playerPokemon.name)} used ${formatPokemonName(moveName)}!`,
      damage: playerDamage,
      timestamp: Date.now()
    }
    const newLog = [...battleState.battleLog, playerMoveLog]
    addToastMessage(playerMoveLog)
    
    setBattleState(prev => ({
      ...prev,
      aiHP: newAiHP,
      battleLog: newLog,
      turn: 'ai'
    }))
    
    // AI turn after delay
    setTimeout(() => {
      if (newAiHP[battleState.currentAiPokemon] <= 0) {
        // AI Pokemon fainted
        const nextAiPokemon = battleState.currentAiPokemon + 1
        if (nextAiPokemon >= battleState.aiTeam.length) {
          // Player wins
          const victoryLog = {
            type: 'victory' as const,
            message: 'All AI Pokemon fainted! You win!',
            timestamp: Date.now()
          }
          setBattleState(prev => ({
            ...prev,
            battleEnded: true,
            winner: 'player',
            battleLog: [...prev.battleLog, victoryLog]
          }))
          addToastMessage(victoryLog)
          setBattleMode('results')
          return
        } else {
          const faintLog = {
            type: 'faint' as const,
            message: `${formatPokemonName(battleState.aiTeam[battleState.currentAiPokemon].name)} fainted!`,
            timestamp: Date.now()
          }
          setBattleState(prev => ({
            ...prev,
            currentAiPokemon: nextAiPokemon,
            battleLog: [...prev.battleLog, faintLog]
          }))
          addToastMessage(faintLog)
        }
      }
      
      // AI attack
      const aiMove = aiPokemon.moves[Math.floor(Math.random() * aiPokemon.moves.length)] || 'Tackle'
      const aiDamage = Math.floor(Math.random() * 25) + 8
      const newPlayerHP = [...battleState.playerHP]
      newPlayerHP[battleState.currentPlayerPokemon] = Math.max(0, newPlayerHP[battleState.currentPlayerPokemon] - aiDamage)
      
      const aiMoveLog = {
        type: 'ai-move' as const,
        message: `${formatPokemonName(aiPokemon.name)} used ${formatPokemonName(aiMove)}!`,
        damage: aiDamage,
        timestamp: Date.now()
      }
      setBattleState(prev => ({
        ...prev,
        playerHP: newPlayerHP,
        battleLog: [...prev.battleLog, aiMoveLog],
        turn: 'player'
      }))
      addToastMessage(aiMoveLog)
      
      if (newPlayerHP[battleState.currentPlayerPokemon] <= 0) {
        const nextPlayerPokemon = battleState.currentPlayerPokemon + 1
        if (nextPlayerPokemon >= battleState.playerTeam.length) {
          const defeatLog = {
            type: 'defeat' as const,
            message: 'All your Pokemon fainted! You lose!',
            timestamp: Date.now()
          }
          setBattleState(prev => ({
            ...prev,
            battleEnded: true,
            winner: 'ai',
            battleLog: [...prev.battleLog, defeatLog]
          }))
          addToastMessage(defeatLog)
          setBattleMode('results')
        } else {
          const playerFaintLog = {
            type: 'faint' as const,
            message: `${formatPokemonName(battleState.playerTeam[battleState.currentPlayerPokemon].name)} fainted!`,
            timestamp: Date.now()
          }
          setBattleState(prev => ({
            ...prev,
            currentPlayerPokemon: nextPlayerPokemon,
            battleLog: [...prev.battleLog, playerFaintLog]
          }))
          addToastMessage(playerFaintLog)
        }
      }
    }, 2000)
  }

  const resetBattle = () => {
    setBattleMode('setup')
    setBattleState({
      playerTeam: [],
      aiTeam: [],
      currentPlayerPokemon: 0,
      currentAiPokemon: 0,
      playerHP: [],
      aiHP: [],
      turn: 'player',
      battleLog: [],
      battleStarted: false,
      battleEnded: false,
      winner: null
    })
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold pokemon-font gradient-text mb-4">
          Battle Simulator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Simulate epic Pokémon battles! Test your team's strength against AI opponents.
        </p>
      </div>

      {battleMode === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Battle Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <Swords className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Turn-Based Combat
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Strategic battles with move selection and type effectiveness
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Team vs Team
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Full 6v6 battles with switching and strategy
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Battle Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Detailed battle reports and performance metrics
              </p>
            </div>
          </div>

          {/* Team Setup */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Your Team
            </h2>
            
            {state.team.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.team.map((pokemon, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pokemon.sprite || '/placeholder-pokemon.png'}
                          alt={pokemon.name}
                          className="w-12 h-12"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatPokemonName(pokemon.name)}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Level {pokemon.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={startBattle}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                  >
                    <Play className="h-5 w-5" />
                    Start Battle vs AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Team Set
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Build your team first to start battling!
                </p>
                <a
                  href="/team-builder"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Build Team
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {battleMode === 'battle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Battle Arena */}
          <div className="bg-gradient-to-b from-blue-400 to-green-400 rounded-xl shadow-lg p-6 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Player Team Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Team
                </h3>
                <div className="space-y-2">
                  {battleState.playerTeam.map((pokemon, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${
                        index === battleState.currentPlayerPokemon
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } ${
                        battleState.playerHP[index] <= 0 ? 'opacity-40 grayscale' : ''
                      }`}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                        alt={pokemon.name}
                        className="w-12 h-12"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {formatPokemonName(pokemon.name)}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(battleState.playerHP[index] || 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Battle */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div className="text-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${battleState.playerTeam[battleState.currentPlayerPokemon]?.id}.png`}
                        alt={battleState.playerTeam[battleState.currentPlayerPokemon]?.name}
                        className="w-32 h-32 mx-auto mb-2"
                      />
                      <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatPokemonName(battleState.playerTeam[battleState.currentPlayerPokemon]?.name || '')}
                      </h4>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>HP</span>
                          <span>{battleState.playerHP[battleState.currentPlayerPokemon]}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(battleState.playerHP[battleState.currentPlayerPokemon] || 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">VS</div>
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {battleState.turn === 'player' ? 'Your Turn' : 'AI Turn'}
                      </div>
                    </div>

                    <div className="text-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${battleState.aiTeam[battleState.currentAiPokemon]?.id}.png`}
                        alt={battleState.aiTeam[battleState.currentAiPokemon]?.name}
                        className="w-32 h-32 mx-auto mb-2"
                      />
                      <h4 className="text-lg font-bold text-red-600 dark:text-red-400">
                        {formatPokemonName(battleState.aiTeam[battleState.currentAiPokemon]?.name || '')}
                      </h4>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>HP</span>
                          <span>{battleState.aiHP[battleState.currentAiPokemon]}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(battleState.aiHP[battleState.currentAiPokemon] || 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Team Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  AI Team
                </h3>
                <div className="space-y-2">
                  {battleState.aiTeam.map((pokemon, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${
                        index === battleState.currentAiPokemon
                          ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } ${
                        battleState.aiHP[index] <= 0 ? 'opacity-40 grayscale' : ''
                      }`}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                        alt={pokemon.name}
                        className="w-12 h-12"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {formatPokemonName(pokemon.name)}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(battleState.aiHP[index] || 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Battle Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {battleState.turn === 'player' ? 'Choose your move:' : 'AI is thinking...'}
            </h3>
            
            {battleState.turn === 'player' && !battleState.battleEnded && (
              <div className="grid grid-cols-2 gap-3">
                {battleState.playerTeam[battleState.currentPlayerPokemon]?.moves.slice(0, 4).map((move, index) => (
                  <button
                    key={index}
                    onClick={() => executeMove(index)}
                    disabled={battleState.turn !== 'player'}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-sm"
                  >
                    {formatPokemonName(move)}
                  </button>
                )) || [1, 2, 3, 4].map((moveNum) => (
                  <button
                    key={moveNum}
                    onClick={() => executeMove(moveNum - 1)}
                    disabled={battleState.turn !== 'player'}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Move {moveNum}
                  </button>
                ))}
              </div>
            )}
            
            {battleState.turn === 'ai' && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">AI is thinking...</p>
              </div>
            )}
            
            {/* Toast Messages */}
            <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
              {toastMessages.map((toast) => (
                <motion.div
                  key={toast.id || toast.timestamp}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 100, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg shadow-lg border-l-4 max-w-sm pointer-events-auto ${
                    toast.type === 'player-move' ? 'bg-blue-600 border-blue-400 text-white' :
                    toast.type === 'ai-move' ? 'bg-red-600 border-red-400 text-white' :
                    toast.type === 'faint' ? 'bg-purple-600 border-purple-400 text-white' :
                    toast.type === 'victory' ? 'bg-green-600 border-green-400 text-white' :
                    toast.type === 'defeat' ? 'bg-red-700 border-red-500 text-white' :
                    'bg-gray-700 border-gray-500 text-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{toast.message}</span>
                    {toast.damage && (
                      <span className="text-sm opacity-90 ml-2 font-bold">
                        -{toast.damage} HP
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {battleMode === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <Trophy className={`h-24 w-24 mx-auto mb-6 ${battleState.winner === 'player' ? 'text-yellow-500' : 'text-gray-400'}`} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {battleState.winner === 'player' ? 'Victory!' : 'Defeat!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {battleState.winner === 'player' 
                ? 'Congratulations! You defeated the AI trainer!' 
                : 'Better luck next time! Train your team and try again.'}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={resetBattle}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Battle Again
              </button>
              <a
                href="/team-builder"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Edit Team
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default BattleSimulator
