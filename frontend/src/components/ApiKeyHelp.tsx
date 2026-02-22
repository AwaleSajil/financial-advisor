import React, { useState } from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../styles/theme";

export function ApiKeyHelp() {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableRipple onPress={() => setExpanded(!expanded)}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.headerText}>Where do I get an API key?</Text>
          <MaterialCommunityIcons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textSecondary}
          />
        </View>
      </TouchableRipple>

      {expanded && (
        <View style={styles.body}>
          <TouchableRipple
            onPress={() => Linking.openURL("https://aistudio.google.com/app/apikey")}
            style={styles.linkRow}
          >
            <View style={styles.linkContent}>
              <MaterialCommunityIcons
                name="google"
                size={20}
                color="#4285F4"
              />
              <View style={styles.linkText}>
                <Text style={styles.linkTitle}>Google AI Studio</Text>
                <Text style={styles.linkUrl}>aistudio.google.com</Text>
              </View>
              <MaterialCommunityIcons
                name="open-in-new"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => Linking.openURL("https://platform.openai.com/api-keys")}
            style={styles.linkRow}
          >
            <View style={styles.linkContent}>
              <MaterialCommunityIcons
                name="creation"
                size={20}
                color="#10a37f"
              />
              <View style={styles.linkText}>
                <Text style={styles.linkTitle}>OpenAI Platform</Text>
                <Text style={styles.linkUrl}>platform.openai.com/api-keys</Text>
              </View>
              <MaterialCommunityIcons
                name="open-in-new"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </TouchableRipple>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.primaryFaded,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    ...typography.subtitle2,
    color: colors.primary,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  linkRow: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  linkText: {
    flex: 1,
  },
  linkTitle: {
    ...typography.subtitle2,
    color: colors.text,
  },
  linkUrl: {
    ...typography.caption,
    color: colors.primary,
  },
});
