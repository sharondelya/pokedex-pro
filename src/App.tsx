import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import PokemonList from './pages/PokemonList'
import PokemonDetail from './pages/PokemonDetail'
import TeamBuilder from './pages/TeamBuilder'
import BattleSimulator from './pages/BattleSimulator'
import TypeChart from './pages/TypeChart'
import Compare from './pages/Compare'
import Favorites from './pages/Favorites'
import RandomPokemon from './pages/RandomPokemon'
import { ThemeProvider } from './contexts/ThemeContext'
import { PokemonProvider } from './contexts/PokemonContext'
import ErrorBoundary from './components/common/ErrorBoundary'

/**
 * Main App component that sets up routing and global providers
 */
function App() {
  return (
    <PokemonProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <AnimatePresence mode="wait">
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon" element={<PokemonList />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/team-builder" element={<TeamBuilder />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/type-chart" element={<TypeChart />} />
                <Route path="/battle" element={<BattleSimulator />} />
                <Route path="/random" element={<RandomPokemon />} />
                </Routes>
              </AnimatePresence>
            </main>
            
            <Footer />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </PokemonProvider>
  )
}

export default App
