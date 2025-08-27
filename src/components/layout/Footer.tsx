import React from 'react'
import { Github, Heart, ExternalLink } from 'lucide-react'

/**
 * Footer component with project information and links
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              PokéDex Pro
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A comprehensive Pokémon encyclopedia built with modern web technologies. 
              Explore, compare, and build teams with your favorite Pokémon!
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Complete Pokédex with search & filters</li>
              <li>• Team Builder & Battle Simulator</li>
              <li>• Type Effectiveness Chart</li>
              <li>• Pokémon Comparison Tool</li>
              <li>• Favorites & Daily Pokémon</li>
              <li>• Dark/Light Theme Support</li>
            </ul>
          </div>

          {/* Links & Credits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Links & Credits
            </h3>
            <div className="space-y-3">
              <a
                href="https://github.com/sharondelya/pokedex-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>View on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>Powered by PokéAPI</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by{' '}
            <a
              href="https://github.com/sharondelya"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              sharondelya
            </a>
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 sm:mt-0">
            © 2024 PokéDex Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
