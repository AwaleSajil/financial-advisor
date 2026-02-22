import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "./Picker";
import { PROVIDER_MODELS, PROVIDERS } from "../lib/constants";

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
      <Text style={styles.label}>LLM Provider</Text>
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

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Model</Text>
          <Picker
            options={models.decode.map((m) => ({ label: m, value: m }))}
            selectedValue={decodeModel}
            onValueChange={onDecodeModelChange}
          />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Embedding Model</Text>
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
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
});
