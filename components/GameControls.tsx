import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, RefreshCw, Trophy } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { COLORS } from '@/constants/colors';

interface GameControlsProps {
  onShowHighScores: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onShowHighScores }) => {
  const { initGame, isGameActive, isGameOver } = useGameStore();
  
  return (
    <View style={styles.container}>
      {!isGameActive && (
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={initGame}
        >
          {isGameOver ? (
            <RefreshCw size={24} color="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" />
          )}
          <Text style={styles.buttonText}>
            {isGameOver ? 'Play Again' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={onShowHighScores}
      >
        <Trophy size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>High Scores</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameControls;