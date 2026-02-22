import React from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
import { colors, typography } from "../styles/theme";

interface PickedFileChipProps {
  name: string;
  type: string;
  onRemove: () => void;
}

function getIcon(type: string): string {
  if (type.includes("csv") || type.includes("excel")) return "file-delimited";
  if (type.includes("image")) return "file-image";
  return "file-document";
}

export function PickedFileChip({ name, type, onRemove }: PickedFileChipProps) {
  return (
    <Chip
      mode="outlined"
      icon={getIcon(type)}
      onClose={onRemove}
      style={styles.chip}
      textStyle={styles.chipText}
    >
      {name}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primaryBorder,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
  },
});
