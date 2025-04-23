import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <AlertTriangle size={40} className="text-secondary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-md"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound