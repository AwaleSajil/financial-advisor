import { DefaultTheme } from "react-native-paper";

export const colors = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  primaryLight: "#eef2ff",
  primaryBorder: "#c7d2fe",
  secondary: "#8b5cf6",
  background: "#f8f9ff",
  surface: "#ffffff",
  surfaceBorder: "#e8eaf6",
  text: "#1e1e3a",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  userBubble: "#6366f1",
  assistantBubble: "#ffffff",
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
    onPrimary: "#ffffff",
    secondaryContainer: colors.primaryLight,
  },
  roundness: 12,
};
