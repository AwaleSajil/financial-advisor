import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { colors } from "../styles/theme";
import type { FileItem } from "../lib/types";

interface FileListItemProps {
  file: FileItem;
  onDelete: (file: FileItem) => void;
}

export function FileListItem({ file, onDelete }: FileListItemProps) {
  const icon = file.type === "csv" ? "file-delimited" : "image";

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.icon}>
          {file.type === "csv" ? "\uD83D\uDCC4" : "\uD83D\uDDBC\uFE0F"}
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.filename} numberOfLines={1}>
            {file.filename}
          </Text>
          <Text style={styles.date}>
            Uploaded: {file.upload_date?.slice(0, 10) ?? "N/A"}
          </Text>
        </View>
      </View>
      <IconButton
        icon="delete-outline"
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
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 4,
    paddingVertical: 4,
    marginBottom: 8,
  },
  info: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  filename: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
