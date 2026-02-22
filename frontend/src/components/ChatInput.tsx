import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { colors, spacing } from "../styles/theme";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Ask about your spending..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        disabled={disabled}
        multiline
        style={styles.input}
        outlineStyle={styles.outline}
        contentStyle={styles.inputContent}
        textColor={colors.text}
        dense
      />
      <IconButton
        icon="send"
        mode="contained"
        iconColor="#fff"
        containerColor={colors.primary}
        size={24}
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        style={styles.sendButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    marginRight: spacing.sm,
    maxHeight: 120,
  },
  outline: {
    borderRadius: 12,
    borderColor: colors.border,
  },
  inputContent: {
    paddingVertical: spacing.sm,
  },
  sendButton: {
    margin: 0,
    marginBottom: 2,
  },
});
