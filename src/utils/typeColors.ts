import { TypeName } from '../types/pokemon'

/**
 * Pokemon type color mappings and utility functions
 * Used for consistent styling across the application
 */

export const TYPE_COLORS: Record<TypeName, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

export const TYPE_GRADIENTS: Record<TypeName, string> = {
  normal: 'from-gray-400 to-gray-500',
  fire: 'from-red-400 to-orange-500',
  water: 'from-blue-400 to-blue-600',
  electric: 'from-yellow-300 to-yellow-500',
  grass: 'from-green-400 to-green-600',
  ice: 'from-cyan-300 to-cyan-500',
  fighting: 'from-red-600 to-red-700',
  poison: 'from-purple-500 to-purple-700',
  ground: 'from-yellow-600 to-amber-600',
  flying: 'from-indigo-300 to-purple-400',
  psychic: 'from-pink-400 to-pink-600',
  bug: 'from-lime-500 to-green-600',
  rock: 'from-yellow-700 to-amber-700',
  ghost: 'from-purple-600 to-indigo-700',
  dragon: 'from-indigo-600 to-purple-700',
  dark: 'from-gray-700 to-gray-800',
  steel: 'from-gray-400 to-slate-500',
  fairy: 'from-pink-300 to-pink-500',
}

export const TYPE_ICONS: Record<TypeName, string> = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🌍',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🗿',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '🧚',
}

/**
 * Get the primary color for a Pokemon type
 */
export function getTypeColor(type: TypeName): string {
  return TYPE_COLORS[type] || TYPE_COLORS.normal
}

/**
 * Get the gradient classes for a Pokemon type
 */
export function getTypeGradient(type: TypeName): string {
  return TYPE_GRADIENTS[type] || TYPE_GRADIENTS.normal
}

/**
 * Get the icon for a Pokemon type
 */
export function getTypeIcon(type: TypeName): string {
  return TYPE_ICONS[type] || TYPE_ICONS.normal
}

/**
 * Get Tailwind CSS classes for a Pokemon type
 */
export function getTypeTailwindClass(type: TypeName): string {
  const colorMap: Record<TypeName, string> = {
    normal: 'bg-gray-400 text-white',
    fire: 'bg-red-500 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400 text-black',
    grass: 'bg-green-500 text-white',
    ice: 'bg-cyan-400 text-white',
    fighting: 'bg-red-600 text-white',
    poison: 'bg-purple-600 text-white',
    ground: 'bg-yellow-600 text-white',
    flying: 'bg-indigo-400 text-white',
    psychic: 'bg-pink-500 text-white',
    bug: 'bg-lime-500 text-white',
    rock: 'bg-yellow-700 text-white',
    ghost: 'bg-purple-700 text-white',
    dragon: 'bg-indigo-700 text-white',
    dark: 'bg-gray-800 text-white',
    steel: 'bg-gray-500 text-white',
    fairy: 'bg-pink-400 text-white',
  }
  
  return colorMap[type] || colorMap.normal
}

/**
 * Get contrasting text color for a type background
 */
export function getTypeTextColor(type: TypeName): 'text-white' | 'text-black' {
  const lightTypes: TypeName[] = ['electric', 'ice']
  return lightTypes.includes(type) ? 'text-black' : 'text-white'
}

/**
 * Type effectiveness multipliers
 */
export const TYPE_EFFECTIVENESS: Record<TypeName, Record<TypeName, number>> = {
  normal: {
    rock: 0.5, ghost: 0, steel: 0.5,
    fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, dragon: 1, dark: 1, fairy: 1, normal: 1
  },
  fire: {
    fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2,
    normal: 1, electric: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, ghost: 1, dark: 1, fairy: 1
  },
  water: {
    fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5,
    normal: 1, electric: 1, ice: 1, fighting: 1, poison: 1, flying: 1, psychic: 1, bug: 1, ghost: 1, steel: 1, dark: 1, fairy: 1
  },
  electric: {
    water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5,
    normal: 1, fire: 1, ice: 1, fighting: 1, poison: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, steel: 1, dark: 1, fairy: 1
  },
  grass: {
    fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5,
    normal: 1, electric: 1, ice: 1, fighting: 1, psychic: 1, ghost: 1, dark: 1, fairy: 1
  },
  ice: {
    fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5,
    normal: 1, electric: 1, fighting: 1, poison: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1, fairy: 1
  },
  fighting: {
    normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5,
    fire: 1, water: 1, electric: 1, grass: 1, ground: 1, dragon: 1, fighting: 1
  },
  poison: {
    grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2,
    normal: 1, fire: 1, water: 1, electric: 1, ice: 1, fighting: 1, flying: 1, psychic: 1, bug: 1, dragon: 1, dark: 1
  },
  ground: {
    fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2,
    normal: 1, water: 1, ice: 1, fighting: 1, ground: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1
  },
  flying: {
    electric: 0.5, grass: 2, ice: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5,
    normal: 1, fire: 1, water: 1, poison: 1, ground: 1, flying: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1
  },
  psychic: {
    fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5,
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, fairy: 1
  },
  bug: {
    fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5,
    normal: 1, water: 1, electric: 1, ice: 1, ground: 1, bug: 1, rock: 1, dragon: 1
  },
  rock: {
    fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5,
    normal: 1, water: 1, electric: 1, grass: 1, poison: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1, rock: 1
  },
  ghost: {
    normal: 0, psychic: 2, ghost: 2, dark: 0.5,
    fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, bug: 1, rock: 1, steel: 1, fairy: 1, dragon: 1
  },
  dragon: {
    dragon: 2, steel: 0.5, fairy: 0,
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1
  },
  dark: {
    fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5,
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, bug: 1, rock: 1, steel: 1, dragon: 1
  },
  steel: {
    fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2,
    normal: 1, grass: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, ghost: 1, dragon: 1, dark: 1
  },
  fairy: {
    fire: 0.5, poison: 0.5, fighting: 2, dragon: 2, dark: 2, steel: 0.5,
    normal: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, fairy: 1
  }
}

/**
 * Get type effectiveness multiplier
 */
export function getTypeEffectiveness(attackingType: TypeName, defendingType: TypeName): number {
  return TYPE_EFFECTIVENESS[attackingType]?.[defendingType] ?? 1
}

/**
 * Calculate damage multiplier for dual-type Pokemon
 */
export function calculateDualTypeEffectiveness(
  attackingType: TypeName, 
  defendingTypes: TypeName[]
): number {
  return defendingTypes.reduce((multiplier, type) => {
    return multiplier * getTypeEffectiveness(attackingType, type)
  }, 1)
}

/**
 * Get effectiveness description
 */
export function getEffectivenessText(multiplier: number): string {
  if (multiplier === 0) return 'No Effect'
  if (multiplier === 0.25) return 'Not Very Effective'
  if (multiplier === 0.5) return 'Not Very Effective'
  if (multiplier === 1) return 'Normal Damage'
  if (multiplier === 2) return 'Super Effective'
  if (multiplier === 4) return 'Super Effective'
  return 'Normal Damage'
}

/**
 * Get effectiveness color class
 */
export function getEffectivenessColor(multiplier: number): string {
  if (multiplier === 0) return 'text-gray-500'
  if (multiplier < 1) return 'text-red-500'
  if (multiplier === 1) return 'text-gray-700'
  if (multiplier > 1) return 'text-green-500'
  return 'text-gray-700'
}
