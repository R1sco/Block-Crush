import { View } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function ModalScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack.Screen 
        options={{
          title: 'Modal',
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          presentation: 'modal',
        }} 
      />
    </View>
  );
} 