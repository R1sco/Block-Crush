import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Trophy, X } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { COLORS } from '@/constants/colors';

interface HighScoresModalProps {
  visible: boolean;
  onClose: () => void;
}

const HighScoresModal: React.FC<HighScoresModalProps> = ({ visible, onClose }) => {
  const { highScore } = useGameStore();
  
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
          
          <View style={styles.headerContainer}>
            <Trophy size={24} color="#FFD700" />
            <Text style={styles.headerText}>High Scores</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Best</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={onClose}
          >
            <Text style={styles.closeModalText}>Close</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
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
  closeModalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
  },
  closeModalText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HighScoresModal;