export interface Block {
  id: string;
  colorIndex: number;
  row: number;
  col: number;
  isSelected?: boolean;
  isMatched?: boolean;
  isSwapping?: boolean;
  isFalling?: boolean;
  specialType?: 'striped-horizontal' | 'striped-vertical' | 'wrapped' | 'bomb';
}

export interface GameState {
  board: Block[][];
  score: number;
  highScore: number;
  timeLeft: number;
  isGameOver: boolean;
  isGameActive: boolean;
  selectedBlock: Block | null;
  swappingBlocks: Block[];
  matchedBlocks: Block[];
  moves: number;
  moveLimit: number;
  isProcessing: boolean;
  cascadeCount: number; // Current cascade level (1-5)
  cascadeTimer: number | null; // Timer for resetting cascade count
  fallingBlocks: Block[]; // Blocks currently falling
  boardLocked: boolean; // Whether the board is locked for interaction
  
  // Method signatures
  initGame: () => void;
  selectBlock: (block: Block) => void;
  swapBlocks: (block1: Block, block2: Block) => void;
  checkForMatches: () => void;
  clearMatches: () => void;
  tick: () => void;
  endGame: () => void;
}

export type MatchPattern = {
  blocks: Block[];
  type: 'row' | 'column' | 'l-shape' | 't-shape' | 'cross';
};

export type GameAction = 
  | { type: 'SELECT_BLOCK'; block: Block }
  | { type: 'SWAP_BLOCKS'; block1: Block; block2: Block }
  | { type: 'CHECK_MATCHES' }
  | { type: 'CLEAR_MATCHES' }
  | { type: 'UPDATE_SCORE'; points: number }
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'TICK' };