import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Award, RefreshCw, X } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { COLORS } from '@/constants/colors';

interface GameOverModalProps {
  visible: boolean;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ visible, onClose }) => {
  const { score, highScore, initGame } = useGameStore();
  const isNewHighScore = score > 0 && score >= highScore;
  
  const handlePlayAgain = () => {
    initGame();
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <Text style={styles.gameOverText}>Game Over</Text>
          
          {isNewHighScore && (
            <View style={styles.newHighScoreContainer}>
              <Award size={24} color="#FFD700" />
              <Text style={styles.newHighScoreText}>New High Score!</Text>
            </View>
          )}
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Best Score</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={handlePlayAgain}
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  newHighScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  newHighScoreText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  scoreValue: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  playAgainButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameOverModal;