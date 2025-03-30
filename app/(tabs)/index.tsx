import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/store/gameStore';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import GameControls from '@/components/GameControls';
import GameOverModal from '@/components/GameOverModal';
import HighScoresModal from '@/components/HighScoresModal';
import GameInstructions from '@/components/GameInstructions';
import { COLORS } from '@/constants/colors';

export default function GameScreen() {
  const { isGameActive, isGameOver, tick } = useGameStore();
  const [showGameOver, setShowGameOver] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  
  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGameActive) {
      timer = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive]);
  
  // Show game over modal when game ends
  useEffect(() => {
    if (isGameOver) {
      setShowGameOver(true);
    }
  }, [isGameOver]);
  
  return (
    <LinearGradient
      colors={[COLORS.background, '#0A0A0A']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Fumo Crash</Text>
            <Text style={styles.subtitle}>Match & Clear</Text>
          </View>
          
          <GameHeader />
          
          <View style={styles.boardContainer}>
            <GameBoard />
          </View>
          
          <GameControls onShowHighScores={() => setShowHighScores(true)} />
          
          {!isGameActive && !isGameOver && (
            <GameInstructions />
          )}
        </ScrollView>
      </SafeAreaView>
      
      <GameOverModal
        visible={showGameOver}
        onClose={() => setShowGameOver(false)}
      />
      
      <HighScoresModal
        visible={showHighScores}
        onClose={() => setShowHighScores(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});