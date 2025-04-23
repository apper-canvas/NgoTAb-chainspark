import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Settings, Play, Info, X } from 'lucide-react'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [showRules, setShowRules] = useState(false)
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text"
        >
          Chain Reaction Game
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto"
        >
          Place atoms strategically, trigger explosions, and create chain reactions to dominate the board!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 p-6 rounded-2xl shadow-card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <Users className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Multiplayer</h2>
          </div>
          <p className="text-surface-600 dark:text-surface-300">
            Compete with 2-8 players in this strategic turn-based game. Challenge friends or play against AI opponents.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          className="bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/5 p-6 rounded-2xl shadow-card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
              <Settings className="text-secondary" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Customizable</h2>
          </div>
          <p className="text-surface-600 dark:text-surface-300">
            Adjust grid size from 6x6 to 12x12, modify explosion thresholds, and set game speed to your preference.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.5 } }}
          className="bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/5 p-6 rounded-2xl shadow-card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-4">
              <Play className="text-accent" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Real-time</h2>
          </div>
          <p className="text-surface-600 dark:text-surface-300">
            Experience dynamic gameplay with real-time explosions and chain reactions. Chat with players and request rematches.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
        className="mb-12"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Play Now</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRules(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <Info size={18} />
            <span>Game Rules</span>
          </motion.button>
        </div>
        
        <MainFeature />
      </motion.div>

      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">How to Play ChainSpark</h3>
                <button 
                  onClick={() => setShowRules(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4 text-surface-700 dark:text-surface-300">
                <div>
                  <h4 className="font-semibold text-surface-900 dark:text-white mb-1">Objective</h4>
                  <p>Capture all cells on the board by eliminating other players' atoms.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-surface-900 dark:text-white mb-1">Game Mechanics</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Players take turns placing atoms in cells.</li>
                    <li>Each cell has a critical mass based on its adjacent cells (2-4).</li>
                    <li>Corner cells: 2 atoms</li>
                    <li>Edge cells: 3 atoms</li>
                    <li>Center cells: 4 atoms</li>
                    <li>When a cell reaches critical mass, it explodes, distributing atoms to adjacent cells.</li>
                    <li>When you add an atom to another player's cell, it becomes yours.</li>
                    <li>Chain reactions occur when explosions trigger other cells to reach critical mass.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-surface-900 dark:text-white mb-1">Winning</h4>
                  <p>The last player with atoms on the board wins the game.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-surface-900 dark:text-white mb-1">Strategy Tips</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Focus on corners and edges first as they require fewer atoms to explode.</li>
                    <li>Create clusters of your atoms to set up chain reactions.</li>
                    <li>Block opponents from creating large clusters.</li>
                    <li>Plan several moves ahead to create devastating chain reactions.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home