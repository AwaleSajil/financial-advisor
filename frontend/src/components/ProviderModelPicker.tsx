import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "./Picker";
import { PROVIDER_MODELS, PROVIDERS } from "../lib/constants";
import { colors, typography, spacing } from "../styles/theme";

interface ProviderModelPickerProps {
  provider: string;
  decodeModel: string;
  embeddingModel: string;
  onProviderChange: (p: string) => void;
  onDecodeModelChange: (m: string) => void;
  onEmbeddingModelChange: (m: string) => void;
}

export function ProviderModelPicker({
  provider,
  decodeModel,
  embeddingModel,
  onProviderChange,
  onDecodeModelChange,
  onEmbeddingModelChange,
}: ProviderModelPickerProps) {
  const models = PROVIDER_MODELS[provider] || PROVIDER_MODELS.Google;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>LLM Provider</Text>
        <Text style={styles.helper}>Powers your financial analysis</Text>
        <Picker
          options={PROVIDERS.map((p) => ({ label: p, value: p }))}
          selectedValue={provider}
          onValueChange={(val) => {
            onProviderChange(val);
            const newModels = PROVIDER_MODELS[val];
            onDecodeModelChange(newModels.decode[0]);
            onEmbeddingModelChange(newModels.embedding[0]);
          }}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Model</Text>
          <Text style={styles.helper}>For chat and analysis</Text>
          <Picker
            options={models.decode.map((m) => ({ label: m, value: m }))}
            selectedValue={decodeModel}
            onValueChange={onDecodeModelChange}
          />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Embedding Model</Text>
          <Text style={styles.helper}>For document search</Text>
          <Picker
            options={models.embedding.map((m) => ({ label: m, value: m }))}
            selectedValue={embeddingModel}
            onValueChange={onEmbeddingModelChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  label: {
    ...typography.subtitle2,
    color: colors.text,
    marginBottom: 2,
  },
  helper: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
});
