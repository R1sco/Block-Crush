import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { BOARD_SIZE, POINTS_PER_BLOCK, BONUS_MULTIPLIER, MOVE_LIMIT, TIME_LIMIT, MIN_MATCH_SIZE, SPECIAL_REQUIREMENTS, CASCADE_MULTIPLIER, MAX_CASCADE, CASCADE_DURATION } from '@/constants/game';
import { COLORS } from '@/constants/colors';
import { Block, GameState, MatchPattern } from '@/types/game';
import { Platform } from 'react-native';

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to create a new block
const createBlock = (row: number, col: number): Block => ({
  id: generateId(),
  colorIndex: Math.floor(Math.random() * COLORS.blocks.length),
  row,
  col,
});

// Helper to initialize a new board
const initializeBoard = (): Block[][] => {
  let board: Block[][] = [];
  
  // Create initial board
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = createBlock(row, col);
    }
  }
  
  // Check for matches and regenerate blocks until no matches exist
  let hasMatches = true;
  while (hasMatches) {
    hasMatches = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const matches = checkForMatch(board, board[row][col]);
        if (matches.length >= MIN_MATCH_SIZE) {
          // Regenerate this block with a different color
          board[row][col] = {
            ...board[row][col],
            colorIndex: (board[row][col].colorIndex + 1 + Math.floor(Math.random() * (COLORS.blocks.length - 1))) % COLORS.blocks.length
          };
          hasMatches = true;
        }
      }
    }
  }
  
  return board;
};

// Helper to check if two blocks are adjacent
const areBlocksAdjacent = (block1: Block, block2: Block): boolean => {
  const rowDiff = Math.abs(block1.row - block2.row);
  const colDiff = Math.abs(block1.col - block2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

// Helper to get a block at a specific position
const getBlockAt = (board: Block[][], row: number, col: number): Block | null => {
  if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
    return board[row][col];
  }
  return null;
};

// Check for matches (3 or more in a row/column)
const checkForMatch = (board: Block[][], block: Block): Block[] => {
  const { row, col, colorIndex } = block;
  const matches: Block[] = [block];
  
  // Check horizontally
  let checkCol = col - 1;
  while (checkCol >= 0 && board[row][checkCol]?.colorIndex === colorIndex) {
    matches.push(board[row][checkCol]);
    checkCol--;
  }
  
  checkCol = col + 1;
  while (checkCol < BOARD_SIZE && board[row][checkCol]?.colorIndex === colorIndex) {
    matches.push(board[row][checkCol]);
    checkCol++;
  }
  
  // If we have 3+ matches horizontally, return them
  if (matches.length >= MIN_MATCH_SIZE) {
    return matches;
  }
  
  // Reset matches and check vertically
  matches.length = 0;
  matches.push(block);
  
  let checkRow = row - 1;
  while (checkRow >= 0 && board[checkRow][col]?.colorIndex === colorIndex) {
    matches.push(board[checkRow][col]);
    checkRow--;
  }
  
  checkRow = row + 1;
  while (checkRow < BOARD_SIZE && board[checkRow][col]?.colorIndex === colorIndex) {
    matches.push(board[checkRow][col]);
    checkRow++;
  }
  
  return matches;
};

// Find all match patterns in the board
const findAllMatches = (board: Block[][]): Block[] => {
  const matchedBlocks: Block[] = [];
  const checked = new Set<string>();
  
  // Check for matches in each position
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const blockId = board[row][col].id;
      
      // Skip if already checked this block
      if (checked.has(blockId)) continue;
      
      const matches = checkForMatch(board, board[row][col]);
      
      // If we found a match (3+ blocks)
      if (matches.length >= MIN_MATCH_SIZE) {
        // Add all matched blocks and mark as checked
        matches.forEach(block => {
          matchedBlocks.push(block);
          checked.add(block.id);
        });
      } else {
        // Mark as checked even if no match
        checked.add(blockId);
      }
    }
  }
  
  return matchedBlocks;
};

// Check if a potential swap would create a match
const checkSwapCreatesMatch = (board: Block[][], block1: Block, block2: Block): boolean => {
  // Create a copy of the board
  const tempBoard = JSON.parse(JSON.stringify(board)) as Block[][];
  
  // Swap blocks in the temporary board
  const temp = { ...tempBoard[block1.row][block1.col] };
  tempBoard[block1.row][block1.col] = { ...tempBoard[block2.row][block2.col], row: block1.row, col: block1.col };
  tempBoard[block2.row][block2.col] = { ...temp, row: block2.row, col: block2.col };
  
  // Check if the swap creates any matches
  const matches1 = checkForMatch(tempBoard, tempBoard[block1.row][block1.col]);
  const matches2 = checkForMatch(tempBoard, tempBoard[block2.row][block2.col]);
  
  return matches1.length >= MIN_MATCH_SIZE || matches2.length >= MIN_MATCH_SIZE;
};

// Helper to fill empty spaces after blocks are cleared
const fillEmptySpaces = (board: Block[][]): Block[][] => {
  const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
  
  // For each column
  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptySpaces = 0;
    
    // Start from the bottom and move up
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (newBoard[row][col].isMatched) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        // Move block down by emptySpaces
        const newRow = row + emptySpaces;
        newBoard[newRow][col] = { 
          ...newBoard[row][col], 
          row: newRow, 
          isFalling: true 
        };
        newBoard[row][col] = {
          ...createBlock(row, col),
          isMatched: true
        };
      }
    }
    
    // Fill the top with new blocks
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (newBoard[row][col].isMatched) {
        newBoard[row][col] = {
          ...createBlock(row, col),
          isFalling: true
        };
      }
    }
  }
  
  return newBoard;
};

// Fix the specialType to use correct union type without redefining GameState
const createSpecialBlock = (block: Block, matchPattern: MatchPattern): Block => {
  let specialType: "striped-horizontal" | "striped-vertical" | "wrapped" | "bomb" | undefined = undefined;
  
  // Check match type and length to determine special block
  if (matchPattern.blocks.length >= SPECIAL_REQUIREMENTS.bomb) {
    specialType = 'bomb';
  } else if (matchPattern.blocks.length >= SPECIAL_REQUIREMENTS['striped-horizontal']) {
    if (matchPattern.type === 'row') {
      specialType = 'striped-horizontal';
    } else if (matchPattern.type === 'column') {
      specialType = 'striped-vertical';
    }
  } else if (matchPattern.blocks.length >= SPECIAL_REQUIREMENTS.wrapped && 
            (matchPattern.type === 'l-shape' || matchPattern.type === 't-shape')) {
    specialType = 'wrapped';
  }
  
  return {
    ...block,
    specialType
  };
};

// Calculate score based on match pattern with cascade multiplier
const calculateScore = (matchedBlocks: Block[], cascadeCount: number): number => {
  const count = matchedBlocks.length;
  const matchMultiplier = BONUS_MULTIPLIER[Math.min(count, 8) as keyof typeof BONUS_MULTIPLIER] || 1;
  
  // Apply cascade multiplier (clamped to MAX_CASCADE)
  // For level 0 (match aktif), gunakan multiplier 1.0
  let cascadeMultiplier = 1.0;
  if (cascadeCount > 0) {
    // Untuk match pasif, gunakan multiplier sesuai level
    const cascadeLevel = Math.min(cascadeCount, MAX_CASCADE) as keyof typeof CASCADE_MULTIPLIER;
    cascadeMultiplier = CASCADE_MULTIPLIER[cascadeLevel] || 1;
  }
  
  // Calculate base points and apply multipliers
  const basePoints = count * POINTS_PER_BLOCK;
  const cascadeBonus = Math.floor(basePoints * matchMultiplier * cascadeMultiplier);
  
  console.log(`Score calculation: ${count} blocks x ${POINTS_PER_BLOCK} points = ${basePoints} base points`);
  console.log(`Match multiplier: x${matchMultiplier} (${count} blocks)`);
  console.log(`Cascade multiplier: x${cascadeMultiplier} (level ${cascadeCount})`);
  console.log(`Final score: ${cascadeBonus}`);
  
  return cascadeBonus;
};

// Sound effects
let blockCrashSound: Audio.Sound | null = null;
let collectPointsSound: Audio.Sound | null = null;

// Initialize sounds
const initSounds = async () => {
  try {
    // Load block crash sound
    const { sound: crushSound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/BlockCrash.wav')
    );
    blockCrashSound = crushSound;
    
    // Load collect points sound
    const { sound: pointsSound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/collect-points.mp3')
    );
    collectPointsSound = pointsSound;
  } catch (error) {
    console.error('Error loading sounds:', error);
  }
};

// Initialize sounds when the module loads
initSounds();

// Play sound for block matching
const playMatchSound = async (cascadeLevel = 0) => {
  try {
    if (blockCrashSound) {
      await blockCrashSound.setPositionAsync(0);
      
      // Volume tetap berdasarkan level cascade
      let volume = 0.7;
      
      // Pitch berdasarkan tangga nada untuk setiap level cascade
      // Nilai pitch untuk setiap nada: normal (1.0), dan naik per tangga
      let pitch = 1.0; // Default pitch untuk level 0
      
      if (cascadeLevel >= 1) {
        // Tingkatkan volume berdasarkan level cascade
        volume = Math.min(0.7 + (cascadeLevel * 0.1), 1.0);
        
        // Tentukan pitch berdasarkan level cascade (naik 1 tangga nada per level)
        // Kenaikan pitch per tangga nada sekitar 1.059 (semitone)
        switch (cascadeLevel) {
          case 1: pitch = 1.059; break;    // Naik 1 semitone
          case 2: pitch = 1.122; break;    // Naik 2 semitone
          case 3: pitch = 1.189; break;    // Naik 3 semitone
          case 4: pitch = 1.335; break;    // Naik 5 semitone (fourth)
          default: pitch = 1.498; break;   // Naik 7 semitone (fifth)
        }
        
        console.log(`Playing sound with volume ${volume} and pitch ${pitch} for cascade level ${cascadeLevel}`);
      }
      
      await blockCrashSound.setVolumeAsync(volume);
      
      // Set pitch berdasarkan level cascade
      if (Platform.OS !== 'web') {
        // Untuk mobile
        await blockCrashSound.setRateAsync(pitch, true);
      } else {
        // Untuk web, kita gunakan pendekatan sound yang berbeda
        try {
          const audioElement = new window.Audio(require('@/assets/sounds/BlockCrash.wav'));
          audioElement.volume = volume;
          audioElement.playbackRate = pitch;
          await audioElement.play();
          return; // Keluar dari fungsi setelah memainkan suara web
        } catch (webError) {
          console.log('Error playing web sound, falling back to Expo Audio:', webError);
          // Jika gagal, lanjutkan dengan Expo Audio
        }
      }
      
      await blockCrashSound.playAsync();
    }
  } catch (error) {
    console.error('Error playing match sound:', error);
  }
};

// Play swap sound
const playSwapSound = async (willCreateMatch: boolean) => {
  try {
    // Check if running on web
    if (Platform.OS === 'web') {
      // Create HTML audio element for web
      const audioElement = new window.Audio(require('@/assets/sounds/collect-points.mp3'));
      audioElement.volume = willCreateMatch ? 1.0 : 0.5;
      await audioElement.play();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/collect-points.mp3'),
        { shouldPlay: true, volume: willCreateMatch ? 1.0 : 0.5 }
      );
      await sound.playAsync();
      // Unload sound after playing (with delay to ensure it completes)
      setTimeout(() => {
        sound.unloadAsync();
      }, 1000);
    }
  } catch (error) {
    console.log('Error playing swap sound:', error);
  }
};

// Start cascade timer
const startCascadeTimer = (set: Function, cascadeTimer: number | null) => {
  // Clear any existing timer
  if (cascadeTimer) {
    clearTimeout(cascadeTimer);
  }
  
  // Set new timer
  const newTimer = setTimeout(() => {
    console.log("Cascade timer expired, resetting to 1");
    // Reset cascade count after specified duration
    set({ cascadeCount: 1, cascadeTimer: null });
  }, CASCADE_DURATION);
  
  console.log("Started new cascade timer, will reset after", CASCADE_DURATION/1000, "seconds");
  // Update state
  return newTimer;
};

// Check if coordinates are valid
const isValidCoordinate = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      board: initializeBoard(),
      score: 0,
      highScore: 0,
      timeLeft: TIME_LIMIT,
      isGameOver: false,
      isGameActive: false,
      selectedBlock: null,
      swappingBlocks: [],
      matchedBlocks: [],
      moves: 0,
      moveLimit: MOVE_LIMIT,
      isProcessing: false,
      cascadeCount: 1,
      cascadeTimer: null,
      fallingBlocks: [],
      boardLocked: false,
      
      // Initialize the game
      initGame: () => {
        set({
          board: initializeBoard(),
          score: 0,
          timeLeft: TIME_LIMIT,
          isGameOver: false,
          isGameActive: true,
          selectedBlock: null,
          swappingBlocks: [],
          matchedBlocks: [],
          moves: 0,
          moveLimit: MOVE_LIMIT,
          isProcessing: false,
          cascadeCount: 1,
          cascadeTimer: null,
          fallingBlocks: [],
          boardLocked: false,
        });
      },
      
      // Select a block
      selectBlock: (block: Block) => {
        const { board, selectedBlock, isProcessing, boardLocked } = get();
        
        // Don't allow selection if game is processing a move or when board is locked
        if (isProcessing || boardLocked) return;
        
        // Pilih blok pertama jika belum ada yang dipilih sebelumnya
        if (!selectedBlock) {
          // First selection - select the block and highlight it
          const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
          newBoard[block.row][block.col] = { 
            ...newBoard[block.row][block.col], 
            isSelected: true 
          };
          
          set({ 
            board: newBoard,
            selectedBlock: block 
          });
        } 
        // Jika blok yang sama dipilih lagi, batalkan pilihan
        else if (selectedBlock.id === block.id) {
          // Deselect if clicking the same block
          const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
          newBoard[selectedBlock.row][selectedBlock.col] = { 
            ...newBoard[selectedBlock.row][selectedBlock.col], 
            isSelected: false 
          };
          
          set({ 
            board: newBoard,
            selectedBlock: null 
          });
        } 
        // Jika blok berbeda dengan blok terpilih
        else {
          // Check if blocks are adjacent for swap
          if (areBlocksAdjacent(selectedBlock, block)) {
            // Try to swap
            // Bersihkan tanda isSelected pada blok pertama
            const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
            newBoard[selectedBlock.row][selectedBlock.col] = { 
              ...newBoard[selectedBlock.row][selectedBlock.col], 
              isSelected: false 
            };
            
            // Update board before swap
            set({ 
              board: newBoard
            });
            
            // Swap blocks
            get().swapBlocks(selectedBlock, block);
          } else {
            // Not adjacent, update the selection to the new block
            const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
            // Clear previous selection
            newBoard[selectedBlock.row][selectedBlock.col] = { 
              ...newBoard[selectedBlock.row][selectedBlock.col], 
              isSelected: false 
            };
            // Set new selection
            newBoard[block.row][block.col] = { 
              ...newBoard[block.row][block.col], 
              isSelected: true 
            };
            
            set({ 
              board: newBoard,
              selectedBlock: block 
            });
          }
        }
      },
      
      // Swap two blocks
      swapBlocks: async (block1: Block, block2: Block) => {
        // Lock the board during swap
        set({ isProcessing: true, boardLocked: true });
        
        const { board } = get();
        
        console.log(`swapBlocks - Swapping (${block1.row},${block1.col}) with (${block2.row},${block2.col})`);
        
        // Check if blocks exist at the specified positions
        if (!board[block1.row]?.[block1.col] || !board[block2.row]?.[block2.col]) {
          console.error("Invalid block positions for swapping");
          set({ isProcessing: false, boardLocked: false });
          return;
        }
        
        // Check if blocks are adjacent
        if (!areBlocksAdjacent(block1, block2)) {
          console.error("Blocks are not adjacent, canceling swap");
          set({ isProcessing: false, boardLocked: false });
          return;
        }
        
        try {
          // Check if swap would create a match
          const willCreateMatch = checkSwapCreatesMatch(board, block1, block2);
          
          // Create a new board with swapped blocks
          const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
          
          // Update positions and set swapping flag
          newBoard[block1.row][block1.col] = {
            ...newBoard[block1.row][block1.col], 
            isSwapping: true,
            isSelected: false
          };
          
          newBoard[block2.row][block2.col] = {
            ...newBoard[block2.row][block2.col], 
            isSwapping: true,
            isSelected: false
          };
          
          set({
            board: newBoard,
            selectedBlock: null
          });
          
          // Play swap sound
          playSwapSound(willCreateMatch);
          
          // After animation delay, update board with swapped positions
          setTimeout(() => {
            try {
              const updatedBoard = JSON.parse(JSON.stringify(get().board)) as Block[][];
              
              // Swap blocks in any case (even if no match created)
              const temp = { ...updatedBoard[block1.row][block1.col] };
              updatedBoard[block1.row][block1.col] = { 
                ...updatedBoard[block2.row][block2.col], 
                row: block1.row, 
                col: block1.col, 
                isSwapping: false,
                isSelected: false
              };
              
              updatedBoard[block2.row][block2.col] = { 
                ...temp, 
                row: block2.row, 
                col: block2.col, 
                isSwapping: false,
                isSelected: false 
              };
              
              set({ 
                board: updatedBoard,
                swappingBlocks: []
              });
              
              if (willCreateMatch) {
                // If this is a valid move, increase move count
                console.log("ACTIVE MATCH from player swap. Setting cascade to 0 (active match).");
                set({
                  moves: get().moves + 1,
                  // Reset cascade count to 0 for active match (player swap)
                  cascadeCount: 0
                });
                
                // Check for matches
                setTimeout(() => {
                  get().checkForMatches();
                }, 50);
              } else {
                // No match created - swap back
                setTimeout(() => {
                  try {
                    const revertBoard = JSON.parse(JSON.stringify(get().board)) as Block[][];
                    
                    // Mark blocks for swapping back
                    revertBoard[block1.row][block1.col].isSwapping = true;
                    revertBoard[block2.row][block2.col].isSwapping = true;
                    
                    set({
                      board: revertBoard,
                      swappingBlocks: [
                        revertBoard[block1.row][block1.col],
                        revertBoard[block2.row][block2.col]
                      ]
                    });
                    
                    // Swap back after animation delay
                    setTimeout(() => {
                      try {
                        const finalBoard = JSON.parse(JSON.stringify(get().board)) as Block[][];
                        
                        // Swap back to original positions
                        const tempBlock = { ...finalBoard[block1.row][block1.col] };
                        finalBoard[block1.row][block1.col] = { 
                          ...finalBoard[block2.row][block2.col], 
                          row: block1.row, 
                          col: block1.col, 
                          isSwapping: false,
                          isSelected: false
                        };
                        
                        finalBoard[block2.row][block2.col] = { 
                          ...tempBlock, 
                          row: block2.row, 
                          col: block2.col, 
                          isSwapping: false,
                          isSelected: false
                        };
                        
                        set({
                          board: finalBoard,
                          swappingBlocks: [],
                          isProcessing: false,
                          boardLocked: false
                        });
                      } catch (error) {
                        console.error("Error during swap back final:", error);
                        set({ isProcessing: false, boardLocked: false });
                      }
                    }, 200);
                  } catch (error) {
                    console.error("Error during swap back:", error);
                    set({ isProcessing: false, boardLocked: false });
                  }
                }, 50);
              }
            } catch (error) {
              console.error("Error during swap execution:", error);
              set({ isProcessing: false, boardLocked: false });
            }
          }, 200);
        } catch (error) {
          console.error("Error during swap setup:", error);
          set({ isProcessing: false, boardLocked: false });
        }
      },
      
      // Check for matches
      checkForMatches: () => {
        const { board } = get();
        const matchedBlocks = findAllMatches(board);
        
        if (matchedBlocks.length > 0) {
          // Mark matched blocks
          const newBoard = JSON.parse(JSON.stringify(board)) as Block[][];
          
          matchedBlocks.forEach(block => {
            newBoard[block.row][block.col].isMatched = true;
          });
          
          set({ 
            board: newBoard,
            matchedBlocks: matchedBlocks
          });
          
          // After animation, clear matches and update score
          setTimeout(() => {
            get().clearMatches();
          }, 300);
        } else {
          set({ isProcessing: false, boardLocked: false });
          
          // Check if game is over (no more moves or time out)
          const { moves, moveLimit, timeLeft } = get();
          if (moves >= moveLimit || timeLeft <= 0) {
            get().endGame();
          }
        }
      },
      
      // Clear matched blocks
      clearMatches: () => {
        const { board, matchedBlocks, score, cascadeCount, cascadeTimer, moves } = get();
        
        if (matchedBlocks.length > 0) {
          // Calculate score with cascade multiplier
          const points = calculateScore(matchedBlocks, cascadeCount);
          const newScore = score + points;
          const highScore = Math.max(newScore, get().highScore);
          
          // Get the last move number to track if this is a passive match
          const lastMoveNumber = get().moves;
          
          // Setiap match pasif meningkatkan cascade level
          // Level 0: match aktif (dari swap pemain) - tanpa efek cascade
          // Level 1: match pasif pertama - efek cascade mulai
          // Level 2-4: match pasif selanjutnya - efek cascade meningkat
          let newCascadeCount = cascadeCount;
          
          // Ini adalah match pasif jika cascadeCount > 0 (sudah pernah match)
          // atau jika ini adalah match lanjutan setelah swap pemain
          if (cascadeCount < MAX_CASCADE) {
            // Tingkatkan cascade count untuk semua match
            newCascadeCount = cascadeCount + 1;
            console.log(`Increasing cascade level from ${cascadeCount} to ${newCascadeCount}`);
          }
          
          // Start or reset the cascade timer
          const newTimer = startCascadeTimer(set, cascadeTimer);
          
          // Play match sound dengan level cascade yang sesuai
          playMatchSound(newCascadeCount);
          
          set({
            score: newScore,
            highScore,
            matchedBlocks: [],
            cascadeCount: newCascadeCount,
            cascadeTimer: newTimer as unknown as number
          });
          
          // Fill empty spaces
          const newBoard = fillEmptySpaces(get().board);
          
          set({
            board: newBoard
          });
          
          // After blocks fall, check for new matches
          setTimeout(() => {
            // Reset falling state
            const updatedBoard = JSON.parse(JSON.stringify(get().board)) as Block[][];
            for (let row = 0; row < BOARD_SIZE; row++) {
              for (let col = 0; col < BOARD_SIZE; col++) {
                updatedBoard[row][col].isFalling = false;
              }
            }
            
            set({
              board: updatedBoard
            });
            
            // Check for new matches (cascade effect)
            get().checkForMatches();
          }, 500);
        } else {
          // Reset cascade when there are no more matches
          console.log("No more matches, resetting cascade count to 0");
          set({ 
            isProcessing: false,
            boardLocked: false,
            cascadeCount: 0,
            cascadeTimer: null
          });
        }
      },
      
      // Tick the game timer
      tick: () => {
        const { timeLeft, isGameActive, moves, moveLimit } = get();
        
        if (isGameActive && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
          
          // Check if time is up
          if (timeLeft <= 1) {
            get().endGame();
          }
        }
      },
      
      // End the game
      endGame: () => {
        const { cascadeTimer } = get();
        
        // Clear cascade timer if active
        if (cascadeTimer) {
          clearTimeout(cascadeTimer);
        }
        
        set({
          isGameActive: false,
          isGameOver: true,
          cascadeTimer: null,
          boardLocked: false
        });
      },
    }),
    {
      name: 'fumo-crash-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ highScore: state.highScore }),
    }
  )
);