import React, { useRef, useEffect } from "react";
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Banner } from "react-native-paper";
import { useRouter } from "expo-router";
import { ChatMessage } from "../../src/components/ChatMessage";
import { ChatInput } from "../../src/components/ChatInput";
import { SuggestedPrompts } from "../../src/components/SuggestedPrompts";
import { TypingIndicator } from "../../src/components/TypingIndicator";
import { useChat } from "../../src/hooks/useChat";
import { useFiles } from "../../src/hooks/useFiles";
import { colors, spacing } from "../../src/styles/theme";
import { createLogger } from "../../src/lib/logger";

const log = createLogger("ChatScreen");

export default function ChatScreen() {
  log.debug("ChatScreen rendered");
  const { messages, isStreaming, sendMessage } = useChat();
  const { files } = useFiles();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const fileCount = files.length;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    log.debug("Messages/streaming state changed", {
      messageCount: messages.length,
      isStreaming,
      fileCount: files.length,
    });
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isStreaming]);

  const wrapperProps = Platform.OS === "ios"
    ? { style: styles.container, behavior: "padding" as const, keyboardVerticalOffset: 90 }
    : { style: styles.container, behavior: "padding" as const, keyboardVerticalOffset: 80 };

  return (
    <KeyboardAvoidingView {...wrapperProps}>
      {/* File status banner */}
      {fileCount === 0 && (
        <Banner
          visible
          style={styles.warningBanner}
          icon="alert-circle-outline"
          actions={[
            {
              label: "Upload Files",
              onPress: () => router.push("/(tabs)/ingest"),
            },
          ]}
        >
          No data loaded yet. Upload a CSV or receipt to start chatting.
        </Banner>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <SuggestedPrompts onSelectPrompt={sendMessage} />
        }
      />

      {/* Streaming indicator */}
      {isStreaming && (
        <View style={styles.streamingIndicator}>
          <TypingIndicator />
        </View>
      )}

      {/* Chat input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  warningBanner: {
    backgroundColor: "#FEF3C7",
  },
  messagesList: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  streamingIndicator: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
