import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useAuth } from "../src/providers/AuthProvider";
import { GlassCard } from "../src/components/GlassCard";
import { colors } from "../src/styles/theme";
import { createLogger } from "../src/lib/logger";

const log = createLogger("LoginScreen");

export default function LoginScreen() {
  log.debug("LoginScreen rendered");
  const { login, register } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "", error: false });

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return;
    log.info("Login button pressed", { email: loginEmail });
    setIsLoggingIn(true);
    try {
      await login(loginEmail, loginPassword);
      log.info("Login successful from UI");
    } catch (e: any) {
      log.error("Login failed from UI", { error: e.message });
      setSnackbar({ visible: true, message: e.message, error: true });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    if (!regEmail || !regPassword) return;
    log.info("Register button pressed", { email: regEmail });
    setIsRegistering(true);
    try {
      const msg = await register(regEmail, regPassword);
      log.info("Registration successful from UI", { message: msg });
      setSnackbar({ visible: true, message: msg, error: false });
    } catch (e: any) {
      log.error("Registration failed from UI", { error: e.message });
      setSnackbar({ visible: true, message: e.message, error: true });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI-Powered Finance</Text>
          </View>
          <Text style={styles.title}>MoneyRAG</Text>
          <Text style={styles.subtitle}>
            Your personal finance analyst. Upload bank statements, ask questions,
            get insights — powered by AI.
          </Text>
        </View>

        {/* Auth Cards */}
        <View style={styles.cardsRow}>
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <TextInput
              mode="outlined"
              placeholder="you@example.com"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineStyle={styles.outline}
              dense
            />
            <TextInput
              mode="outlined"
              placeholder="Password"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
              style={styles.input}
              outlineStyle={styles.outline}
              dense
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoggingIn}
              disabled={isLoggingIn || !loginEmail || !loginPassword}
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <TextInput
              mode="outlined"
              placeholder="you@example.com"
              value={regEmail}
              onChangeText={setRegEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineStyle={styles.outline}
              dense
            />
            <TextInput
              mode="outlined"
              placeholder="Password"
              value={regPassword}
              onChangeText={setRegPassword}
              secureTextEntry
              style={styles.input}
              outlineStyle={styles.outline}
              dense
            />
            <Button
              mode="outlined"
              onPress={handleRegister}
              loading={isRegistering}
              disabled={isRegistering || !regEmail || !regPassword}
              style={styles.outlinedButton}
              labelStyle={styles.outlinedButtonLabel}
            >
              Create Account
            </Button>
          </GlassCard>
        </View>

        {/* Resource Links */}
        <View style={styles.resources}>
          <GlassCard style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>API Keys</Text>
            <Text style={styles.resourceText}>
              Google: aistudio.google.com{"\n"}
              OpenAI: platform.openai.com
            </Text>
          </GlassCard>
          <GlassCard style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>Export Transactions</Text>
            <Text style={styles.resourceText}>
              Export your bank statements as CSV files from Chase, Discover, etc.
            </Text>
          </GlassCard>
        </View>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 32,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 16,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 440,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  outline: {
    borderRadius: 10,
    borderColor: colors.border,
  },
  primaryButton: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  buttonLabel: {
    fontWeight: "600",
    paddingVertical: 4,
  },
  outlinedButton: {
    borderRadius: 10,
    borderColor: colors.border,
    marginTop: 4,
  },
  outlinedButtonLabel: {
    fontWeight: "600",
    color: colors.text,
    paddingVertical: 4,
  },
  resources: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  resourceCard: {
    flex: 1,
    minWidth: 240,
    maxWidth: 360,
    padding: 16,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  resourceText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
