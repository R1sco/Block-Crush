import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, InteractionManager, Text, Animated } from 'react-native';
import Block from './Block';
import { useGameStore } from '@/store/gameStore';
import { BOARD_SIZE, CASCADE_MULTIPLIER } from '@/constants/game';
import { Block as BlockType } from '@/types/game';
import { COLORS } from '@/constants/colors';

// Cascade text animation component
interface CascadeTextProps {
  cascadeLevel: number;
  posX: number;
  posY: number;
  onAnimationComplete: () => void;
}

const CascadeText: React.FC<CascadeTextProps> = ({ cascadeLevel, posX, posY, onAnimationComplete }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const posAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Buat animasi lebih dramatis berdasarkan level cascade
    const duration = 800 + (cascadeLevel * 150); // Durasi lebih lama untuk cascade tinggi
    const scaleValue = 1.5 + (cascadeLevel * 0.25); // Skala lebih besar
    const moveDistance = -50 - (cascadeLevel * 10); // Bergerak lebih jauh
    
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          delay: 300,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: scaleValue,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(posAnim, {
        toValue: moveDistance,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: cascadeLevel > 1 ? cascadeLevel - 1 : 0, // Mulai rotasi dari cascade level 2
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  }, [cascadeLevel]);
  
  // Get cascade multiplier
  const multiplier = CASCADE_MULTIPLIER[Math.min(cascadeLevel, 5) as keyof typeof CASCADE_MULTIPLIER];
  const multiplierText = `x${multiplier.toFixed(1)}`;
  
  // Get cascade color based on level
  const getCascadeColor = (): string => {
    if (cascadeLevel <= 0) return COLORS.accent;
    if (cascadeLevel === 1) return '#FFA500'; // Orange
    if (cascadeLevel === 2) return '#FF4500'; // OrangeRed
    if (cascadeLevel === 3) return '#FF0000'; // Red
    return '#FF00FF'; // Magenta untuk cascade tertinggi (4-5x)
  };

  // Get cascade text based on level
  const getCascadeText = (): string => {
    if (cascadeLevel <= 0) return '';
    if (cascadeLevel === 1) return 'NICE';
    if (cascadeLevel === 2) return 'GREAT';
    if (cascadeLevel === 3) return 'FRENZY';
    return 'UNSTOPPABLE';
  };
  
  // Convert rotate value to degrees
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['0deg', '5deg', '10deg', '15deg', '20deg']
  });
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        opacity: opacityAnim,
        transform: [
          { translateY: posAnim },
          { scale: scaleAnim },
          { rotate }
        ],
        zIndex: 100,
      }}
    >
      <Text style={[styles.cascadeText, { 
        color: getCascadeColor(),
        fontSize: 22 + (cascadeLevel * 2), // Ukuran font meningkat dengan level
        textShadowRadius: 2 + (cascadeLevel / 2) // Shadow lebih tebal untuk level tinggi
      }]}>
        {getCascadeText()} {multiplierText}!
      </Text>
    </Animated.View>
  );
};

const GameBoard: React.FC = () => {
  const { 
    board, 
    selectBlock, 
    selectedBlock,
    isProcessing,
    cascadeCount,
    swapBlocks,
    boardLocked
  } = useGameStore();
  
  const [cascadeAnimations, setCascadeAnimations] = useState<{ id: string, cascadeLevel: number, x: number, y: number }[]>([]);
  const prevCascadeCount = useRef(1);
  const lastSwapTime = useRef<number>(0);
  
  const windowWidth = Dimensions.get('window').width;
  const boardSize = Math.min(windowWidth - 32, 400); // Max board size with padding
  const blockSize = boardSize / BOARD_SIZE;
  
  // Animasi getaran pada board
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  // Efek getaran ketika cascade level tinggi
  useEffect(() => {
    if (cascadeCount >= 1 && cascadeCount > prevCascadeCount.current) {
      // Intensitas getaran berdasarkan level cascade
      let intensity = 1; // Default untuk level 1
      let duration = 300; // Default untuk level 1
      
      if (cascadeCount === 2) {
        intensity = 2;
        duration = 400;
      } else if (cascadeCount === 3) {
        intensity = 3;
        duration = 600;
      } else if (cascadeCount >= 4) {
        intensity = 5;
        duration = 800;
      }
      
      // Reset nilai animasi
      shakeAnimation.setValue(0);
      
      // Animasi getaran dengan beberapa kali osilasi
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: intensity,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -intensity,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: intensity * 0.7,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: duration / 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cascadeCount]);
  
  // Show cascade animation when cascade level increases
  useEffect(() => {
    console.log("Current cascade count:", cascadeCount);
    if (cascadeCount >= 1 && cascadeCount > prevCascadeCount.current) {
      console.log("Creating cascade animations for level:", cascadeCount);
      // Tambahkan beberapa efek cascade di posisi acak pada board
      const animationCount = Math.min(cascadeCount, 3); // Maksimal 3 animasi sekaligus
      
      for (let i = 0; i < animationCount; i++) {
        // Buat posisi acak yang berbeda untuk setiap animasi
        const randomX = Math.random() * (boardSize - 150);
        const randomY = Math.random() * (boardSize - 80);
        
        setCascadeAnimations(prev => [
          ...prev,
          {
            id: `cascade-${Date.now()}-${Math.random()}`,
            cascadeLevel: cascadeCount,
            x: randomX,
            y: randomY
          }
        ]);
      }
    }
    
    prevCascadeCount.current = cascadeCount;
  }, [cascadeCount, boardSize]);
  
  // Remove a cascade animation
  const removeCascadeAnimation = (id: string) => {
    setCascadeAnimations(prev => prev.filter(animation => animation.id !== id));
  };

  // Implement one-click swap
  const handleBlockPress = useCallback((block: BlockType) => {
    // Don't allow interaction during processing
    if (isProcessing || boardLocked) return;
    
    const now = Date.now();
    if (now - lastSwapTime.current < 300) {
      console.log('Clicked too fast, debouncing...');
      return;
    }
    
    // Use InteractionManager to handle heavy operations
    InteractionManager.runAfterInteractions(() => {
      // Jika blok yang dipilih sekarang
      if (selectedBlock) {
        // Jika blok baru berbeda dan bersebelahan dengan blok terpilih
        if (selectedBlock.id !== block.id && areBlocksAdjacent(selectedBlock, block)) {
          console.log(`Swapping blocks: (${selectedBlock.row},${selectedBlock.col}) with (${block.row},${block.col})`);
          
          // Catat waktu terakhir swap
          lastSwapTime.current = now;
          
          // Lakukan swap
          swapBlocks(selectedBlock, block);
        } else {
          // Jika tidak bersebelahan, hanya update pilihan
          selectBlock(block);
        }
      } else {
        // Blok pertama dipilih
        selectBlock(block);
      }
    });
  }, [selectBlock, selectedBlock, swapBlocks, isProcessing, boardLocked]);
  
  // Helper function to check if two blocks are adjacent
  const areBlocksAdjacent = (block1: BlockType, block2: BlockType): boolean => {
    const rowDiff = Math.abs(block1.row - block2.row);
    const colDiff = Math.abs(block1.col - block2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  return (
    <Animated.View 
      style={[
        styles.board, 
        { 
          width: boardSize, 
          height: boardSize,
          transform: [{ translateX: shakeAnimation }]
        }
      ]}
    >
      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((block) => (
            <Block
              key={block.id}
              block={block}
              size={blockSize}
              onPress={handleBlockPress}
            />
          ))}
        </View>
      ))}
      
      {/* Cascade text animations */}
      {cascadeAnimations.map(animation => (
        <CascadeText
          key={animation.id}
          cascadeLevel={animation.cascadeLevel}
          posX={animation.x}
          posY={animation.y}
          onAnimationComplete={() => removeCascadeAnimation(animation.id)}
        />
      ))}
      
      {/* Highlight for selected block */}
      {selectedBlock && (
        <View 
          style={[
            styles.selectedHighlight,
            {
              width: blockSize,
              height: blockSize,
              left: selectedBlock.col * blockSize,
              top: selectedBlock.row * blockSize,
            }
          ]}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  selectedHighlight: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  cascadeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});

export default React.memo(GameBoard);