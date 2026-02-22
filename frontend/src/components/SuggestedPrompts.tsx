import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../styles/theme";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const PROMPTS = [
  { text: "What are my top spending categories?", icon: "chart-pie" as const },
  { text: "Show spending trends this month", icon: "trending-up" as const },
  { text: "Find my largest transactions", icon: "sort-descending" as const },
  { text: "How much did I spend on food?", icon: "food" as const },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="chat-question-outline"
        size={48}
        color={colors.primaryMedium}
      />
      <Text style={styles.title}>Ask about your finances</Text>
      <Text style={styles.subtitle}>
        I can analyze your transactions, find patterns, and visualize spending
      </Text>
      <View style={styles.grid}>
        {PROMPTS.map((prompt) => (
          <Chip
            key={prompt.text}
            mode="outlined"
            icon={prompt.icon}
            onPress={() => onSelectPrompt(prompt.text)}
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {prompt.text}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
    maxWidth: 300,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
    maxWidth: 360,
  },
  chip: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primaryBorder,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
  },
});
