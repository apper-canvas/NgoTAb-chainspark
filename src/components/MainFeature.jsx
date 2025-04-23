import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, RefreshCw, Settings, ChevronDown, ChevronUp, X } from 'lucide-react'

const MainFeature = () => {
  // Game settings
  const [gameSettings, setGameSettings] = useState({
    gridSize: 6,
    players: 2,
    showSettings: false
  })
  
  // Game state
  const [gameState, setGameState] = useState({
    board: [],
    currentPlayer: 0,
    gameStarted: false,
    gameOver: false,
    winner: null,
    playerColors: [
      'player1', // indigo
      'player2', // pink
      'player3', // emerald
      'player4', // amber
      'player5', // blue
      'player6', // red
      'player7', // violet
      'player8', // teal
    ]
  })
  
  // Initialize or reset the game board
  const initializeBoard = () => {
    const { gridSize } = gameSettings
    const newBoard = []
    
    for (let row = 0; row < gridSize; row++) {
      const newRow = []
      for (let col = 0; col < gridSize; col++) {
        // Calculate cell capacity based on position
        let capacity = 4 // Default for center cells
        
        // Corner cells
        if ((row === 0 && col === 0) || 
            (row === 0 && col === gridSize - 1) || 
            (row === gridSize - 1 && col === 0) || 
            (row === gridSize - 1 && col === gridSize - 1)) {
          capacity = 2
        } 
        // Edge cells
        else if (row === 0 || col === 0 || row === gridSize - 1 || col === gridSize - 1) {
          capacity = 3
        }
        
        newRow.push({
          owner: null,
          atoms: 0,
          capacity,
          isExploding: false
        })
      }
      newBoard.push(newRow)
    }
    
    return newBoard
  }
  
  // Start a new game
  const startGame = () => {
    setGameState({
      ...gameState,
      board: initializeBoard(),
      currentPlayer: 0,
      gameStarted: true,
      gameOver: false,
      winner: null
    })
  }
  
  // Reset the game
  const resetGame = () => {
    setGameState({
      ...gameState,
      board: initializeBoard(),
      currentPlayer: 0,
      gameStarted: true,
      gameOver: false,
      winner: null
    })
  }
  
  // Handle cell click
  const handleCellClick = (rowIndex, colIndex) => {
    if (gameState.gameOver) return
    
    const { board, currentPlayer, playerColors } = gameState
    const cell = board[rowIndex][colIndex]
    
    // Can only place on empty cells or cells you own
    if (cell.owner !== null && cell.owner !== currentPlayer) return
    
    // Create a deep copy of the board
    const newBoard = JSON.parse(JSON.stringify(board))
    
    // Update the cell
    newBoard[rowIndex][colIndex].owner = currentPlayer
    newBoard[rowIndex][colIndex].atoms += 1
    
    // Check if the cell should explode
    const updatedBoard = checkExplosions(newBoard, rowIndex, colIndex)
    
    // Check if game is over (only one player left)
    const playersLeft = findPlayersLeft(updatedBoard)
    
    if (playersLeft.length === 1 && gameSettings.players > 1) {
      setGameState({
        ...gameState,
        board: updatedBoard,
        gameOver: true,
        winner: playersLeft[0]
      })
      return
    }
    
    // Move to next player
    const nextPlayer = (currentPlayer + 1) % gameSettings.players
    
    setGameState({
      ...gameState,
      board: updatedBoard,
      currentPlayer: nextPlayer
    })
  }
  
  // Find which players still have atoms on the board
  const findPlayersLeft = (board) => {
    const players = new Set()
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].owner !== null) {
          players.add(board[row][col].owner)
        }
      }
    }
    
    return Array.from(players)
  }
  
  // Check and process explosions
  const checkExplosions = (board, rowIndex, colIndex) => {
    const cell = board[rowIndex][colIndex]
    
    // If cell hasn't reached capacity, no explosion
    if (cell.atoms < cell.capacity) {
      return board
    }
    
    // Cell explodes
    cell.atoms = 0
    const currentOwner = cell.owner
    cell.owner = null
    
    // Get adjacent cells
    const adjacentCells = getAdjacentCells(board, rowIndex, colIndex)
    
    // Distribute atoms to adjacent cells
    for (const [adjRow, adjCol] of adjacentCells) {
      board[adjRow][adjCol].owner = currentOwner
      board[adjRow][adjCol].atoms += 1
      
      // Recursively check for chain reactions
      if (board[adjRow][adjCol].atoms >= board[adjRow][adjCol].capacity) {
        board = checkExplosions(board, adjRow, adjCol)
      }
    }
    
    return board
  }
  
  // Get adjacent cells
  const getAdjacentCells = (board, rowIndex, colIndex) => {
    const adjacentCells = []
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1]   // right
    ]
    
    for (const [dx, dy] of directions) {
      const newRow = rowIndex + dx
      const newCol = colIndex + dy
      
      if (newRow >= 0 && newRow < board.length && 
          newCol >= 0 && newCol < board[0].length) {
        adjacentCells.push([newRow, newCol])
      }
    }
    
    return adjacentCells
  }
  
  // Update settings
  const updateSettings = (setting, value) => {
    setGameSettings({
      ...gameSettings,
      [setting]: value
    })
  }
  
  // Initialize board when component mounts
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      board: initializeBoard()
    }))
  }, [gameSettings.gridSize])
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Chain Reaction Game</h3>
            {gameState.gameStarted && !gameState.gameOver && (
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Player {gameState.currentPlayer + 1}'s turn
              </p>
            )}
            {gameState.gameOver && (
              <p className="text-sm font-medium text-primary">
                Player {gameState.winner + 1} wins!
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameSettings({...gameSettings, showSettings: !gameSettings.showSettings})}
              className="btn btn-outline flex items-center gap-2"
            >
              <Settings size={18} />
              <span>Settings</span>
              {gameSettings.showSettings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>
            
            {!gameState.gameStarted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="btn btn-primary"
              >
                Start Game
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="btn btn-secondary flex items-center gap-2"
              >
                <RefreshCw size={18} />
                <span>Reset</span>
              </motion.button>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {gameSettings.showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                <h4 className="font-medium mb-4">Game Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Grid Size: {gameSettings.gridSize}x{gameSettings.gridSize}</label>
                    <input 
                      type="range" 
                      min="6" 
                      max="12" 
                      value={gameSettings.gridSize}
                      onChange={(e) => updateSettings('gridSize', parseInt(e.target.value))}
                      className="w-full h-2 bg-surface-200 dark:bg-surface-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-surface-500 mt-1">
                      <span>6x6</span>
                      <span>12x12</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Players: {gameSettings.players}</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="2" 
                        max="8" 
                        value={gameSettings.players}
                        onChange={(e) => updateSettings('players', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-surface-200 dark:bg-surface-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-surface-500" />
                        <span className="font-medium">{gameSettings.players}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-surface-500 mt-1">
                      <span>2</span>
                      <span>8</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-surface-500">
                    Note: Changing settings will reset the current game.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          {Array.from({ length: gameSettings.players }).map((_, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                gameState.currentPlayer === index && gameState.gameStarted && !gameState.gameOver
                  ? `bg-${gameState.playerColors[index]} text-white`
                  : `bg-${gameState.playerColors[index]}/10 text-${gameState.playerColors[index]}`
              }`}
            >
              <div className={`w-3 h-3 rounded-full bg-${gameState.playerColors[index]}`}></div>
              <span>Player {index + 1}</span>
            </div>
          ))}
        </div>
        
        <div 
          className="grid gap-1.5 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${gameSettings.gridSize}, minmax(0, 1fr))`,
            maxWidth: `${Math.min(600, gameSettings.gridSize * 50)}px`
          }}
        >
          {gameState.board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => gameState.gameStarted && !gameState.gameOver && handleCellClick(rowIndex, colIndex)}
                className={`game-cell ${
                  cell.owner !== null 
                    ? `bg-${gameState.playerColors[cell.owner]}/10 border-${gameState.playerColors[cell.owner]}/30` 
                    : 'bg-surface-50 dark:bg-surface-700'
                } ${
                  gameState.gameStarted && !gameState.gameOver ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {cell.atoms > 0 && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Render atoms based on count */}
                    {cell.atoms === 1 && (
                      <div 
                        className={`w-3 h-3 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                      ></div>
                    )}
                    
                    {cell.atoms === 2 && (
                      <>
                        <div 
                          className={`absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                        <div 
                          className={`absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                      </>
                    )}
                    
                    {cell.atoms === 3 && (
                      <>
                        <div 
                          className={`absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                        <div 
                          className={`absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                        <div 
                          className={`absolute bottom-1/4 center w-3 h-3 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                          style={{ left: 'calc(50% - 0.375rem)' }}
                        ></div>
                      </>
                    )}
                    
                    {cell.atoms >= 4 && (
                      <div className="flex flex-wrap justify-center items-center gap-1">
                        <div 
                          className={`w-2.5 h-2.5 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                        <div 
                          className={`w-2.5 h-2.5 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                        <div 
                          className={`w-2.5 h-2.5 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                        <div 
                          className={`w-2.5 h-2.5 rounded-full bg-${gameState.playerColors[cell.owner]}`}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          ))}
        </div>
        
        {!gameState.gameStarted && (
          <div className="mt-8 text-center">
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              Configure your game settings and press Start Game to begin!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="btn btn-primary px-8"
            >
              Start Game
            </motion.button>
          </div>
        )}
        
        {gameState.gameOver && (
          <div className="mt-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block bg-surface-50 dark:bg-surface-700 px-6 py-4 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-2">
                Game Over!
              </h3>
              <p className={`text-${gameState.playerColors[gameState.winner]} font-medium mb-4`}>
                Player {gameState.winner + 1} wins!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="btn btn-primary flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={18} />
                <span>Play Again</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainFeature