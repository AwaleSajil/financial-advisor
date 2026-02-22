import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../styles/theme";
import type { ToolEvent } from "../lib/types";

interface ToolTraceProps {
  traces: ToolEvent[];
}

function formatToolName(name: string): string {
  return name
    .replace("money_rag_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ToolTrace({ traces }: ToolTraceProps) {
  const [expanded, setExpanded] = useState(false);

  const toolNames = [
    ...new Set(
      traces
        .filter((t) => t.type === "tool_start")
        .map((t) => formatToolName(t.name))
    ),
  ];

  return (
    <View style={styles.container}>
      <TouchableRipple onPress={() => setExpanded(!expanded)}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="magnify"
            size={14}
            color={colors.primary}
          />
          <Text style={styles.headerText}>
            Used: {toolNames.join(", ")}
          </Text>
          <MaterialCommunityIcons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </TouchableRipple>
      {expanded && (
        <View style={styles.body}>
          {traces.map((trace, i) => (
            <View key={i} style={styles.traceItem}>
              {trace.type === "tool_start" ? (
                <>
                  <Text style={styles.toolName}>
                    {">"} {trace.name}
                  </Text>
                  {trace.input && (
                    <Text style={styles.traceDetail} numberOfLines={2}>
                      Input: {trace.input}
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.traceDetail} numberOfLines={3}>
                  {"  \u21B3"} {trace.snippet}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 6,
  },
  headerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  body: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  traceItem: {
    marginBottom: 4,
  },
  toolName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    fontFamily: "monospace",
  },
  traceDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: "monospace",
  },
});
