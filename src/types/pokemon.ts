/**
 * TypeScript interfaces and types for Pokemon data structures
 * Based on PokeAPI v2 schema with additional custom types for app features
 */

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  order: number
  is_default: boolean
  sprites: PokemonSprites
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  moves: PokemonMove[]
  species: {
    name: string
    url: string
  }
  forms: {
    name: string
    url: string
  }[]
  game_indices: {
    game_index: number
    version: {
      name: string
      url: string
    }
  }[]
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  front_female: string | null
  front_shiny_female: string | null
  back_default: string | null
  back_shiny: string | null
  back_female: string | null
  back_shiny_female: string | null
  other: {
    dream_world: {
      front_default: string | null
      front_female: string | null
    }
    home: {
      front_default: string | null
      front_female: string | null
      front_shiny: string | null
      front_shiny_female: string | null
    }
    'official-artwork': {
      front_default: string | null
      front_shiny: string | null
    }
  }
  versions: any // Complex nested structure, simplified for now
}

export interface PokemonType {
  slot: number
  type: {
    name: TypeName
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: StatName
    url: string
  }
}

export interface PokemonAbility {
  is_hidden: boolean
  slot: number
  ability: {
    name: string
    url: string
  }
}

export interface PokemonMove {
  move: {
    name: string
    url: string
  }
  version_group_details: {
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }[]
}

export interface PokemonSpecies {
  id: number
  name: string
  order: number
  gender_rate: number
  capture_rate: number
  base_happiness: number
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
  hatch_counter: number
  has_gender_differences: boolean
  forms_switchable: boolean
  growth_rate: {
    name: string
    url: string
  }
  pokedex_numbers: {
    entry_number: number
    pokedex: {
      name: string
      url: string
    }
  }[]
  egg_groups: {
    name: string
    url: string
  }[]
  color: {
    name: string
    url: string
  }
  shape: {
    name: string
    url: string
  }
  evolves_from_species: {
    name: string
    url: string
  } | null
  evolution_chain: {
    url: string
  }
  habitat: {
    name: string
    url: string
  } | null
  generation: {
    name: string
    url: string
  }
  names: {
    name: string
    language: {
      name: string
      url: string
    }
  }[]
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version: {
      name: string
      url: string
    }
  }[]
  form_descriptions: any[]
  genera: {
    genus: string
    language: {
      name: string
      url: string
    }
  }[]
  varieties: {
    is_default: boolean
    pokemon: {
      name: string
      url: string
    }
  }[]
}

export interface EvolutionChain {
  id: number
  baby_trigger_item: any | null
  chain: EvolutionChainLink
}

export interface EvolutionChainLink {
  is_baby: boolean
  species: {
    name: string
    url: string
  }
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionDetail {
  item: {
    name: string
    url: string
  } | null
  trigger: {
    name: string
    url: string
  }
  gender: number | null
  held_item: {
    name: string
    url: string
  } | null
  known_move: {
    name: string
    url: string
  } | null
  known_move_type: {
    name: string
    url: string
  } | null
  location: {
    name: string
    url: string
  } | null
  min_level: number | null
  min_happiness: number | null
  min_beauty: number | null
  min_affection: number | null
  needs_overworld_rain: boolean
  party_species: {
    name: string
    url: string
  } | null
  party_type: {
    name: string
    url: string
  } | null
  relative_physical_stats: number | null
  time_of_day: string
  trade_species: {
    name: string
    url: string
  } | null
  turn_upside_down: boolean
}

export interface Move {
  id: number
  name: string
  accuracy: number | null
  effect_chance: number | null
  pp: number | null
  priority: number
  power: number | null
  damage_class: {
    name: 'physical' | 'special' | 'status'
    url: string
  }
  effect_entries: {
    effect: string
    short_effect: string
    language: {
      name: string
      url: string
    }
  }[]
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }[]
  generation: {
    name: string
    url: string
  }
  machines: any[]
  meta: {
    ailment: {
      name: string
      url: string
    }
    category: {
      name: string
      url: string
    }
    min_hits: number | null
    max_hits: number | null
    min_turns: number | null
    max_turns: number | null
    drain: number
    healing: number
    crit_rate: number
    ailment_chance: number
    flinch_chance: number
    stat_chance: number
  }
  names: {
    name: string
    language: {
      name: string
      url: string
    }
  }[]
  past_values: any[]
  stat_changes: {
    change: number
    stat: {
      name: string
      url: string
    }
  }[]
  super_contest_effect: {
    url: string
  } | null
  target: {
    name: string
    url: string
  }
  type: {
    name: TypeName
    url: string
  }
}

// Type definitions for Pokemon types
export type TypeName = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

// Stat names
export type StatName = 
  | 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'

// Custom types for app features
export interface PokemonListItem {
  id: number
  name: string
  url: string
  sprite?: string
  types?: TypeName[]
}

export interface TeamPokemon {
  id: number
  name: string
  sprite: string
  types: TypeName[]
  level: number
  moves: string[]
  nickname?: string
}

export interface BattlePokemon extends TeamPokemon {
  currentHp: number
  maxHp: number
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  status?: 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep'
}

export interface TypeEffectiveness {
  [attackingType: string]: {
    [defendingType: string]: number
  }
}

export interface SearchFilters {
  type?: TypeName
  generation?: number
  legendary?: boolean
  mythical?: boolean
  minStats?: {
    hp?: number
    attack?: number
    defense?: number
    specialAttack?: number
    specialDefense?: number
    speed?: number
  }
  maxStats?: {
    hp?: number
    attack?: number
    defense?: number
    specialAttack?: number
    specialDefense?: number
    speed?: number
  }
}

export interface PaginationInfo {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ErrorResponse {
  error: string
  status: number
  details?: any
}
