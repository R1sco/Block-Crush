import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

const GameInstructions: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>
      <View style={styles.instructionRow}>
        <View style={styles.instructionNumber}>
          <Text style={styles.numberText}>1</Text>
        </View>
        <Text style={styles.instructionText}>
          Tap on a block to select all connected blocks of the same color
        </Text>
      </View>
      <View style={styles.instructionRow}>
        <View style={styles.instructionNumber}>
          <Text style={styles.numberText}>2</Text>
        </View>
        <Text style={styles.instructionText}>
          Tap again to clear the selected blocks
        </Text>
      </View>
      <View style={styles.instructionRow}>
        <View style={styles.instructionNumber}>
          <Text style={styles.numberText}>3</Text>
        </View>
        <Text style={styles.instructionText}>
          Clear as many blocks as possible before time runs out
        </Text>
      </View>
      <View style={styles.bonusContainer}>
        <Text style={styles.bonusTitle}>Bonus Points</Text>
        <Text style={styles.bonusText}>
          Clear more blocks at once for higher score multipliers!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  bonusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  bonusTitle: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  bonusText: {
    color: COLORS.text,
    fontSize: 14,
  },
});

export default GameInstructions;