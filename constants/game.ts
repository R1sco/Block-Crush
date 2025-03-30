// Game constants
export const BOARD_SIZE = 8; // 8x8 grid
export const MIN_MATCH_SIZE = 3; // Minimum 3 blocks to match
export const BLOCK_ANIMATION_DURATION = 200; // ms
export const POINTS_PER_BLOCK = 10;
export const TIME_LIMIT = 60; // 60 seconds game time
export const MOVE_LIMIT = 20;
export const SWAP_ANIMATION_DURATION = 200;
export const FALL_ANIMATION_DURATION = 300;
export const MATCH_ANIMATION_DURATION = 200;
export const MAX_CASCADE = 5; // Maximum cascade multiplier
export const CASCADE_DURATION = 2000; // Delay between cascades in ms

// Score multipliers for different match sizes
export const BONUS_MULTIPLIER = {
  3: 1,   // 3 blocks = normal points
  4: 2,   // 4 blocks = 2x points
  5: 3,   // 5 blocks = 3x points
  6: 4,   // 6 blocks = 4x points
  7: 5,   // 7 blocks = 5x points
  8: 10,  // 8+ blocks = 10x points
};

// Cascade multipliers (when blocks matches create chain reactions)
export const CASCADE_MULTIPLIER = {
  1: 1.0,  // First match (base points)
  2: 2.0,  // First cascade (double points)
  3: 3.0,  // Second cascade (triple points)
  4: 4.0,  // Third cascade (quadruple points)
  5: 5.0,  // Fourth cascade (quintuple points)
};

// Special candy requirements
export const SPECIAL_REQUIREMENTS = {
  'striped-horizontal': 4, // Match 4 in a row
  'striped-vertical': 4,   // Match 4 in a column
  'wrapped': 5,            // Match 5 in L or T shape
  'bomb': 5,               // Match 5 in a row or column
};