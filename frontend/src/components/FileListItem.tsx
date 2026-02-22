import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../styles/theme";
import type { FileItem } from "../lib/types";

interface FileListItemProps {
  file: FileItem;
  onDelete: (file: FileItem) => void;
}

export function FileListItem({ file, onDelete }: FileListItemProps) {
  const isCSV = file.type === "csv";
  const iconName = isCSV ? "file-delimited" : "file-image";
  const iconColor = isCSV ? colors.success : colors.warning;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: isCSV ? "#dcfce7" : "#fef3c7" }]}>
        <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.filename} numberOfLines={1}>
          {file.filename}
        </Text>
        <Text style={styles.date}>
          {file.upload_date?.slice(0, 10) ?? "N/A"}
        </Text>
      </View>
      <IconButton
        icon="trash-can-outline"
        iconColor={colors.error}
        size={20}
        onPress={() => onDelete(file)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 12,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  filename: {
    ...typography.subtitle2,
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
