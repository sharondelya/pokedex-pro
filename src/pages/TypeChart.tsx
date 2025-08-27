import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, Zap, Shield, X } from 'lucide-react'
import { TypeName } from '../types/pokemon'
import { 
  getTypeTailwindClass, 
  getTypeEffectiveness, 
  getEffectivenessText, 
  getEffectivenessColor,
  TYPE_ICONS 
} from '../utils/typeColors'

/**
 * Interactive type effectiveness chart
 */
const TypeChart: React.FC = () => {
  const [selectedAttackType, setSelectedAttackType] = useState<TypeName | null>(null)
  const [selectedDefendType, setSelectedDefendType] = useState<TypeName | null>(null)

  const allTypes: TypeName[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]

  const getEffectivenessMultiplier = (attacking: TypeName, defending: TypeName): number => {
    return getTypeEffectiveness(attacking, defending)
  }

  const getEffectivenessStyle = (multiplier: number): string => {
    if (multiplier === 0) return 'bg-gray-500 text-white'
    if (multiplier === 0.5) return 'bg-red-500 text-white'
    if (multiplier === 1) return 'bg-gray-400 text-white'
    if (multiplier === 2) return 'bg-green-500 text-white'
    return 'bg-gray-400 text-white'
  }

  const clearSelection = () => {
    setSelectedAttackType(null)
    setSelectedDefendType(null)
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold pokemon-font gradient-text mb-4">
          Type Effectiveness Chart
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Interactive type effectiveness reference. Click on types to see their offensive and defensive matchups.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Info className="h-5 w-5" />
          Legend
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-400 rounded"></div>
            <span className="text-sm">Super Effective (2×)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <span className="text-sm">Normal Damage (1×)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-400 rounded"></div>
            <span className="text-sm">Not Very Effective (0.5×)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span className="text-sm">No Effect (0×)</span>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {(selectedAttackType || selectedDefendType) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedAttackType && (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Attacking:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getTypeTailwindClass(selectedAttackType)}`}>
                    {selectedAttackType}
                  </span>
                </div>
              )}
              
              {selectedDefendType && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Defending:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getTypeTailwindClass(selectedDefendType)}`}>
                    {selectedDefendType}
                  </span>
                </div>
              )}
              
              {selectedAttackType && selectedDefendType && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Result:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getEffectivenessColor(getEffectivenessMultiplier(selectedAttackType, selectedDefendType))}`}>
                    {getEffectivenessText(getEffectivenessMultiplier(selectedAttackType, selectedDefendType))} 
                    ({getEffectivenessMultiplier(selectedAttackType, selectedDefendType)}×)
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={clearSelection}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Type Chart Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 overflow-x-auto">
        <div className="w-full">
          {/* Header Row with Type Labels */}
          <div className="flex mb-1 w-full">
            <div className="flex-shrink-0 w-16 h-8"></div>
            {allTypes.map((type) => (
              <div
                key={type}
                className={`flex-1 h-8 text-center text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${getTypeTailwindClass(type)} ${
                  selectedDefendType === type ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedDefendType(selectedDefendType === type ? null : type)}
              >
                {type.slice(0, 3).toUpperCase()}
              </div>
            ))}
          </div>
          
          {/* Data Rows */}
          {allTypes.map((attackingType) => (
            <div key={attackingType} className="flex mb-1 w-full">
              <div
                className={`flex-shrink-0 w-16 h-8 text-center text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${getTypeTailwindClass(attackingType)} ${
                  selectedAttackType === attackingType ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedAttackType(selectedAttackType === attackingType ? null : attackingType)}
              >
                {attackingType.slice(0, 3).toUpperCase()}
              </div>
              {allTypes.map((defendingType) => {
                const multiplier = getEffectivenessMultiplier(attackingType, defendingType)
                return (
                  <div
                    key={`${attackingType}-${defendingType}`}
                    className={`flex-1 h-8 text-center text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${getEffectivenessStyle(multiplier)}`}
                    onClick={() => {
                      setSelectedAttackType(attackingType)
                      setSelectedDefendType(defendingType)
                    }}
                  >
                    {multiplier === 0 ? '0' : multiplier === 0.5 ? '½' : multiplier === 2 ? '2' : '1'}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Battle Tips */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5" />
          Battle Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">How to Use</h4>
            <ul className="space-y-1 opacity-90">
              <li>• Click on a type in the top row to see its offensive effectiveness</li>
              <li>• Click on a type in the left column to see its defensive matchups</li>
              <li>• The intersection shows the damage multiplier</li>
              <li>• Green = Super Effective (2×), Red = Not Very Effective (½×), Gray = No Effect (0×)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Strategy</h4>
            <ul className="space-y-1 opacity-90">
              <li>• Avoid using moves that are not very effective (½× damage)</li>
              <li>• Some type combinations have no effect (0× damage)</li>
              <li>• Consider type resistances when choosing your team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypeChart
