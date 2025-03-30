import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Github, Globe, Heart } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function AboutScreen() {
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
            <Text style={styles.title}>About Fumo Crash</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>How to Play</Text>
            <Text style={styles.cardText}>
              Fumo Crash is a match-3 style puzzle game where you need to find and clear connected blocks of the same color.
            </Text>
            <Text style={styles.cardText}>
              The more blocks you clear at once, the higher your score multiplier will be!
            </Text>
            <Text style={styles.cardText}>
              Try to score as many points as possible before the timer runs out.
            </Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Game Rules</Text>
            <View style={styles.ruleItem}>
              <View style={styles.ruleBullet} />
              <Text style={styles.ruleText}>
                Tap on a block to select all connected blocks of the same color
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <View style={styles.ruleBullet} />
              <Text style={styles.ruleText}>
                You need at least 2 connected blocks to make a match
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <View style={styles.ruleBullet} />
              <Text style={styles.ruleText}>
                Tap again to clear the selected blocks
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <View style={styles.ruleBullet} />
              <Text style={styles.ruleText}>
                Each game lasts 60 seconds
              </Text>
            </View>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Scoring</Text>
            <Text style={styles.cardText}>
              Base points: 10 points per block
            </Text>
            <Text style={styles.cardText}>
              Multipliers:
            </Text>
            <View style={styles.multiplierContainer}>
              <View style={styles.multiplierItem}>
                <Text style={styles.multiplierCount}>3 blocks</Text>
                <Text style={styles.multiplierValue}>1x</Text>
              </View>
              <View style={styles.multiplierItem}>
                <Text style={styles.multiplierCount}>4 blocks</Text>
                <Text style={styles.multiplierValue}>1.5x</Text>
              </View>
              <View style={styles.multiplierItem}>
                <Text style={styles.multiplierCount}>5 blocks</Text>
                <Text style={styles.multiplierValue}>2x</Text>
              </View>
              <View style={styles.multiplierItem}>
                <Text style={styles.multiplierCount}>6 blocks</Text>
                <Text style={styles.multiplierValue}>3x</Text>
              </View>
              <View style={styles.multiplierItem}>
                <Text style={styles.multiplierCount}>7 blocks</Text>
                <Text style={styles.multiplierValue}>4x</Text>
              </View>
              <View style={styles.multiplierItem}>
                <Text style={styles.multiplierCount}>8+ blocks</Text>
                <Text style={styles.multiplierValue}>5x</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Credits</Text>
            <Text style={styles.cardText}>
              Built with React Native and Expo
            </Text>
            <View style={styles.linksContainer}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL('https://github.com/R1sco')}
              >
                <Github size={20} color={COLORS.text} />
                <Text style={styles.linkText}>GitHub</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL('')}
              >
                <Globe size={20} color={COLORS.text} />
                <Text style={styles.linkText}>Website</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Heart size={16} color={COLORS.secondary} />
              <Text style={styles.footerText}>
                Made with love
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  cardText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 7,
    marginRight: 8,
  },
  ruleText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  multiplierContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  multiplierItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    width: '30%',
  },
  multiplierCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  multiplierValue: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  linkText: {
    color: COLORS.text,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});