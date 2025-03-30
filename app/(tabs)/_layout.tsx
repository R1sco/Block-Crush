import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Fumo Crash",
          tabBarLabel: "Game",
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarLabel: "About",
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    color: COLORS.text,
  },
});