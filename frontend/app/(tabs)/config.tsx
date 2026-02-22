import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { GlassCard } from "../../src/components/GlassCard";
import { ProviderModelPicker } from "../../src/components/ProviderModelPicker";
import { ApiKeyHelp } from "../../src/components/ApiKeyHelp";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { useConfig } from "../../src/hooks/useConfig";
import { colors, typography, spacing } from "../../src/styles/theme";
import { createLogger } from "../../src/lib/logger";

const log = createLogger("ConfigScreen");

export default function ConfigScreen() {
  const { config, isLoading, isSaving, error, saveConfig } = useConfig();

  const [provider, setProvider] = useState("Google");
  const [decodeModel, setDecodeModel] = useState("gemini-3-flash-preview");
  const [embeddingModel, setEmbeddingModel] = useState("gemini-embedding-001");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "", error: false });

  // Populate form when config loads
  useEffect(() => {
    if (config) {
      log.info("Config loaded into form", {
        provider: config.llm_provider,
        decodeModel: config.decode_model,
        embeddingModel: config.embedding_model,
        hasApiKey: !!config.api_key,
      });
      setProvider(config.llm_provider || "Google");
      setDecodeModel(config.decode_model || "gemini-3-flash-preview");
      setEmbeddingModel(config.embedding_model || "gemini-embedding-001");
      setApiKey(config.api_key || "");
    }
  }, [config]);

  const handleSave = async () => {
    if (!apiKey) {
      log.warn("Save attempted without API key");
      setSnackbar({ visible: true, message: "API Key is required.", error: true });
      return;
    }
    log.info("Save config button pressed", {
      provider,
      decodeModel,
      embeddingModel,
    });
    const ok = await saveConfig({
      llm_provider: provider,
      api_key: apiKey,
      decode_model: decodeModel,
      embedding_model: embeddingModel,
    });
    if (ok) {
      log.info("Config saved successfully from UI");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setSnackbar({
        visible: true,
        message: "Configuration saved successfully!",
        error: false,
      });
    } else {
      log.error("Config save failed from UI", { error });
      setSnackbar({
        visible: true,
        message: error || "Failed to save configuration",
        error: true,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading configuration..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Provider Selection */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>AI Provider</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your LLM provider and models
          </Text>
          <ProviderModelPicker
            provider={provider}
            decodeModel={decodeModel}
            embeddingModel={embeddingModel}
            onProviderChange={setProvider}
            onDecodeModelChange={setDecodeModel}
            onEmbeddingModelChange={setEmbeddingModel}
          />
        </GlassCard>

        {/* Section 2: API Key */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>API Key</Text>
          <Text style={styles.sectionSubtitle}>
            Required to process your financial data
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Enter your API key"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            style={styles.input}
            outlineStyle={styles.outline}
            dense
          />
          <ApiKeyHelp />
        </GlassCard>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          icon={saved ? "check" : undefined}
          style={[
            styles.saveButton,
            saved && styles.saveButtonSuccess,
          ]}
          labelStyle={styles.saveButtonLabel}
        >
          {saved ? "Saved!" : "Save Configuration"}
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={4000}
        style={{
          backgroundColor: snackbar.error ? colors.error : colors.success,
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
  },
  outline: {
    borderRadius: 10,
    borderColor: colors.border,
  },
  saveButton: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
  },
  saveButtonSuccess: {
    backgroundColor: colors.success,
  },
  saveButtonLabel: {
    fontWeight: "600",
    paddingVertical: spacing.xs,
  },
});
