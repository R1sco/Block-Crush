import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { COLORS } from "@/constants/colors";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function PerformanceStats() {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateStats = () => {
      const now = performance.now();
      const delta = now - lastTime;
      frameCount++;
      
      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastTime = now;
        
        // Update memory usage if available
        if (performance?.memory) {
          setMemory(Math.round(performance.memory.usedJSHeapSize / 1048576));
        }
      }
      
      requestAnimationFrame(updateStats);
    };

    const handle = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>FPS: {fps}</Text>
      {memory > 0 && <Text style={styles.statsText}>Memory: {memory}MB</Text>}
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <PerformanceStats />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
    zIndex: 9999,
  },
  statsText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});