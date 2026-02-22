import React, { useRef, useEffect, useCallback } from "react";
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
import type { ChatMessage as ChatMessageType } from "../../src/lib/types";

const log = createLogger("ChatScreen");

// Memoized row renderer — prevents re-rendering every message when a new one arrives
const MemoizedChatMessage = React.memo(ChatMessage);

export default function ChatScreen() {
  log.debug("ChatScreen rendered");
  const { messages, isStreaming, sendMessage } = useChat();
  const { files } = useFiles();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const fileCount = files.length;

  // Auto-scroll to bottom on new messages (longer delay for chart WebViews to mount)
  useEffect(() => {
    log.debug("Messages/streaming state changed", {
      messageCount: messages.length,
      isStreaming,
      fileCount: files.length,
    });
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const hasChart = lastMsg?.charts && lastMsg.charts.length > 0;
      // Charts need more time to mount their WebView before we can scroll accurately
      const delay = hasChart ? 300 : 100;
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), delay);
    }
  }, [messages.length, isStreaming]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessageType }) => <MemoizedChatMessage message={item} />,
    []
  );

  const keyExtractor = useCallback((_: ChatMessageType, i: number) => String(i), []);

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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
        // Keep chart WebViews alive when scrolled off-screen to avoid re-loading CDN
        windowSize={7}
        maxToRenderPerBatch={5}
        removeClippedSubviews={false}
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
