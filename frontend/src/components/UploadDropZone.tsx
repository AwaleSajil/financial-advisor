import React from "react";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import { Text, Button, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../styles/theme";

interface UploadDropZoneProps {
  onPickFiles: () => void;
  onOpenCamera: () => void;
}

export function UploadDropZone({ onPickFiles, onOpenCamera }: UploadDropZoneProps) {
  return (
    <View>
      <Pressable onPress={onPickFiles} style={styles.dropZone}>
        <MaterialCommunityIcons
          name="cloud-upload-outline"
          size={40}
          color={colors.primaryMedium}
        />
        <Text style={styles.dropTitle}>Tap to select files</Text>
        <Text style={styles.dropSubtitle}>
          CSV transactions or receipt images
        </Text>
        <View style={styles.badges}>
          <Chip
            icon="file-delimited"
            mode="flat"
            compact
            style={styles.badge}
            textStyle={styles.badgeText}
          >
            .CSV
          </Chip>
          <Chip
            icon="file-image"
            mode="flat"
            compact
            style={styles.badge}
            textStyle={styles.badgeText}
          >
            .PNG
          </Chip>
          <Chip
            icon="file-image"
            mode="flat"
            compact
            style={styles.badge}
            textStyle={styles.badgeText}
          >
            .JPG
          </Chip>
        </View>
      </Pressable>

      {Platform.OS !== "web" && (
        <Button
          mode="outlined"
          icon="camera"
          onPress={onOpenCamera}
          style={styles.cameraButton}
          labelStyle={styles.cameraLabel}
        >
          Capture Receipt
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropZone: {
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: spacing.xxxl,
    alignItems: "center",
    backgroundColor: colors.primaryFaded,
  },
  dropTitle: {
    ...typography.subtitle1,
    color: colors.primary,
    marginTop: spacing.md,
  },
  dropSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.surface,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cameraButton: {
    marginTop: spacing.md,
    borderRadius: 10,
    borderColor: colors.border,
  },
  cameraLabel: {
    ...typography.subtitle2,
  },
});
