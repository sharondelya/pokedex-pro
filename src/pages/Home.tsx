import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Users, 
  Zap, 
  Grid3X3, 
  GitCompare, 
  Heart, 
  Sparkles,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react'
import { usePokemon } from '../contexts/PokemonContext'
import { usePokemon as usePokemonData } from '../hooks/usePokemonData'
import { formatPokemonName, getPokemonSprite } from '../services/pokemonApi'
import { getTypeTailwindClass } from '../utils/typeColors'

/**
 * Home page component with hero section, features, and daily Pokemon
 */
const Home: React.FC = () => {
  const { state } = usePokemon()
  
  // Fetch daily Pokemon data if available
  const { data: dailyPokemonData } = usePokemonData(
    state.dailyPokemon?.id || 0, 
    !!state.dailyPokemon
  )

  const features = [
    {
      icon: Search,
      title: 'Complete Pokédex',
      description: 'Browse all Pokémon with advanced search and filtering options',
      link: '/pokemon',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Team Builder',
      description: 'Create and customize your perfect Pokémon team',
      link: '/team-builder',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Battle Simulator',
      description: 'Simulate battles between Pokémon teams',
      link: '/battle',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Grid3X3,
      title: 'Type Chart',
      description: 'Interactive type effectiveness reference',
      link: '/type-chart',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: GitCompare,
      title: 'Compare Pokémon',
      description: 'Side-by-side Pokémon comparison tool',
      link: '/compare',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Heart,
      title: 'Favorites',
      description: 'Keep track of your favorite Pokémon',
      link: '/favorites',
      color: 'from-red-500 to-pink-500'
    }
  ]

  const stats = [
    { label: 'Total Pokémon', value: '1000+' },
    { label: 'Favorites', value: state.favorites.length },
    { label: 'Team Members', value: state.team.length },
    { label: 'Recently Viewed', value: state.recentlyViewed.length }
  ]

  return (
    <div className="py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold pokemon-font mb-6">
            <span className="gradient-text">PokéDex Pro</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate Pokémon encyclopedia with advanced features, battle simulation, 
            and comprehensive data for trainers of all levels.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/pokemon"
              className="btn-primary text-lg px-8 py-3 flex items-center gap-2 group"
            >
              <Search className="h-5 w-5" />
              Explore Pokédex
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/random"
              className="btn-secondary text-lg px-8 py-3 flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Random Pokémon
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Daily Pokemon */}
      {state.dailyPokemon && dailyPokemonData && (
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Daily Pokémon
          </h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Link
              to={`/pokemon/${dailyPokemonData.id}`}
              className="block pokemon-card p-8 hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img
                  src={getPokemonSprite(dailyPokemonData, state.showShinySprites)}
                  alt={dailyPokemonData.name}
                  className="w-48 h-48 mx-auto mb-4 animate-float"
                />
                {state.showShinySprites && (
                  <Sparkles className="absolute top-2 right-2 h-6 w-6 text-yellow-500" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {formatPokemonName(dailyPokemonData.name)}
              </h3>
              
              <div className="flex justify-center gap-2 mb-4">
                {dailyPokemonData.types.map((type: any) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type-badge ${getTypeTailwindClass(type.type.name)}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                Today's featured Pokémon! Click to learn more.
              </p>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Powerful Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className="block pokemon-card p-8 h-full group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Recently Viewed */}
      {state.recentlyViewed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Recently Viewed
            </h2>
            <Link
              to="/pokemon"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {state.recentlyViewed.slice(0, 5).map((pokemon, index) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={`/pokemon/${pokemon.id}`}
                  className="block pokemon-card p-4 text-center group"
                >
                  <img
                    src={pokemon.sprite || '/placeholder-pokemon.png'}
                    alt={pokemon.name}
                    className="w-20 h-20 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {formatPokemonName(pokemon.name)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Star className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to become a Pokémon Master?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start exploring the world of Pokémon with our comprehensive tools and features.
          </p>
          <Link
            to="/pokemon"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <TrendingUp className="h-5 w-5" />
            Start Your Journey
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
