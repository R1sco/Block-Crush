import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Award, Move, Trophy, Layers } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { COLORS } from '@/constants/colors';
import { CASCADE_MULTIPLIER } from '@/constants/game';

const GameHeader: React.FC = () => {
  const { score, highScore, timeLeft, moves, moveLimit, isGameActive, cascadeCount } = useGameStore();
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get current cascade multiplier text
  const getCascadeMultiplier = (): string => {
    if (cascadeCount <= 0) return '';
    const multiplier = CASCADE_MULTIPLIER[Math.min(cascadeCount, 5) as keyof typeof CASCADE_MULTIPLIER];
    return `x${multiplier.toFixed(1)}`;
  };
  
  // Determine cascade color based on level
  const getCascadeColor = (): string => {
    if (cascadeCount <= 0) return COLORS.accent;
    if (cascadeCount === 1) return '#FFA500'; // Orange
    if (cascadeCount === 2) return '#FF4500'; // OrangeRed
    if (cascadeCount === 3) return '#FF0000'; // Red
    if (cascadeCount === 4) return '#FF00FF'; // Magenta
    return '#FF00FF'; // Magenta untuk cascade tertinggi (5x)
  };
  
  // Get cascade text based on level
  const getCascadeText = (): string => {
    if (cascadeCount <= 0) return '';
    if (cascadeCount === 1) return 'NICE';
    if (cascadeCount === 2) return 'GREAT';
    if (cascadeCount === 3) return 'FRENZY';
    if (cascadeCount === 4) return 'UNSTOPPABLE';
    return 'UNSTOPPABLE';
  };
  
  const cascadeMultiplierText = getCascadeMultiplier();
  const showCascade = cascadeMultiplierText !== '';
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.scoreContainer}>
          <Award size={20} color={COLORS.accent} />
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Move size={20} color={moveLimit - moves < 5 ? COLORS.secondary : COLORS.accent} />
          <Text style={[
            styles.moveValue,
            moveLimit - moves < 5 && isGameActive && styles.moveWarning
          ]}>
            {moves}/{moveLimit}
          </Text>
        </View>
      </View>
      
      <View style={styles.row}>
        {showCascade && (
          <View style={styles.cascadeContainer}>
            <Layers size={20} color={getCascadeColor()} />
            <Text style={[styles.cascadeText, {color: getCascadeColor()}]}>
              {getCascadeText()} {cascadeMultiplierText}
            </Text>
          </View>
        )}
        
        <View style={styles.timeContainer}>
          <Clock size={20} color={timeLeft < 10 ? COLORS.secondary : COLORS.accent} />
          <Text style={[
            styles.timeValue,
            timeLeft < 10 && isGameActive && styles.timeWarning
          ]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Trophy size={20} color={COLORS.accent} />
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreLabel}>Best</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreTextContainer: {
    marginLeft: 8,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  scoreValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timeWarning: {
    color: COLORS.secondary,
  },
  moveValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  moveWarning: {
    color: COLORS.secondary,
  },
  cascadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cascadeText: {
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
});

export default GameHeader;