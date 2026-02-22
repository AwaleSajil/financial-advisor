import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { GlassCard } from "../../src/components/GlassCard";
import { ProviderModelPicker } from "../../src/components/ProviderModelPicker";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { useConfig } from "../../src/hooks/useConfig";
import { colors } from "../../src/styles/theme";
import { createLogger } from "../../src/lib/logger";

const log = createLogger("ConfigScreen");

export default function ConfigScreen() {
  const { config, isLoading, isSaving, error, saveConfig } = useConfig();

  const [provider, setProvider] = useState("Google");
  const [decodeModel, setDecodeModel] = useState("gemini-3-flash-preview");
  const [embeddingModel, setEmbeddingModel] = useState("gemini-embedding-001");
  const [apiKey, setApiKey] = useState("");
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
        <Text style={styles.subtitle}>
          Configure your AI providers and models here.
        </Text>

        <GlassCard>
          <ProviderModelPicker
            provider={provider}
            decodeModel={decodeModel}
            embeddingModel={embeddingModel}
            onProviderChange={setProvider}
            onDecodeModelChange={setDecodeModel}
            onEmbeddingModelChange={setEmbeddingModel}
          />

          <View style={styles.apiKeySection}>
            <Text style={styles.label}>API Key</Text>
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
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={styles.saveButton}
            labelStyle={styles.saveButtonLabel}
          >
            Save Configuration
          </Button>
        </GlassCard>
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
    padding: 16,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  apiKeySection: {
    marginTop: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
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
    marginTop: 20,
  },
  saveButtonLabel: {
    fontWeight: "600",
    paddingVertical: 4,
  },
});
