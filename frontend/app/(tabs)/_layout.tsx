import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../src/providers/AuthProvider";
import { colors } from "../../src/styles/theme";

export default function TabLayout() {
  const { user, logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceBorder,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.surfaceBorder,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "700" },
        headerRight: () => (
          <Pressable
            onPress={logout}
            style={{ marginRight: 16, flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {user?.email}
            </Text>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerTitle: "MoneyRAG",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-processing"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ingest"
        options={{
          title: "Ingest Data",
          headerTitle: "Ingest Data",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-upload"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Config",
          headerTitle: "Account Configuration",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
