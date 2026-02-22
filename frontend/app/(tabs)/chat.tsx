import React, { useRef, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Banner, ActivityIndicator } from "react-native-paper";
import { ChatMessage } from "../../src/components/ChatMessage";
import { ChatInput } from "../../src/components/ChatInput";
import { ToolTrace } from "../../src/components/ToolTrace";
import { useChat } from "../../src/hooks/useChat";
import { useFiles } from "../../src/hooks/useFiles";
import { colors } from "../../src/styles/theme";
import { createLogger } from "../../src/lib/logger";

const log = createLogger("ChatScreen");

export default function ChatScreen() {
  log.debug("ChatScreen rendered");
  const { messages, isStreaming, currentToolTraces, sendMessage } = useChat();
  const { files } = useFiles();
  const flatListRef = useRef<FlatList>(null);

  const fileCount = files.length;
  const fileNames = files
    .slice(0, 3)
    .map((f) => f.filename)
    .join(", ");
  const fileSuffix = fileCount > 3 ? ` + ${fileCount - 3} more` : "";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    log.debug("Messages/streaming state changed", {
      messageCount: messages.length,
      isStreaming,
      toolTraceCount: currentToolTraces.length,
      fileCount: files.length,
    });
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isStreaming]);

  return (
    <View style={styles.container}>
      {/* File status banner */}
      {fileCount === 0 ? (
        <Banner
          visible
          style={styles.warningBanner}
          icon="alert-circle-outline"
        >
          No data loaded yet. Go to Ingest Data to upload a CSV or Bill file
          before chatting.
        </Banner>
      ) : (
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            {fileCount} file{fileCount > 1 ? "s" : ""} loaded: {fileNames}
            {fileSuffix}
          </Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Ask about your spending</Text>
            <Text style={styles.emptySubtitle}>
              Try "What are my top spending categories?" or "Show me spending
              trends this month"
            </Text>
          </View>
        }
      />

      {/* Streaming tool trace indicator */}
      {isStreaming && (
        <View style={styles.streamingIndicator}>
          {currentToolTraces.length > 0 ? (
            <ToolTrace traces={currentToolTraces} />
          ) : (
            <View style={styles.thinkingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.thinkingText}>Thinking...</Text>
            </View>
          )}
        </View>
      )}

      {/* Chat input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </View>
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
  infoBanner: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  infoBannerText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  messagesList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  streamingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  thinkingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  thinkingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
