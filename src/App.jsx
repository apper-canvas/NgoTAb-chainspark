import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              ChainSpark
            </h1>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </header>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="py-4 px-6 border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800">
        <div className="container mx-auto text-center text-sm text-surface-500">
          <p>© {new Date().getFullYear()} ChainSpark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App