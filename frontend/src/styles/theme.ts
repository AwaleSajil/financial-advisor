import { DefaultTheme } from "react-native-paper";

export const colors = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  primaryLight: "#eef2ff",
  primaryBorder: "#c7d2fe",
  primaryFaded: "rgba(99, 102, 241, 0.08)",
  primaryMedium: "#818cf8",
  secondary: "#8b5cf6",
  background: "#f8f9ff",
  surface: "#ffffff",
  surfaceElevated: "#ffffff",
  surfaceSubtle: "#f1f3f9",
  surfaceBorder: "#e8eaf6",
  text: "#1e1e3a",
  textSecondary: "#6b7280",
  textTertiary: "#9ca3af",
  border: "#e5e7eb",
  divider: "#e8eaf6",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  userBubble: "#6366f1",
  assistantBubble: "#ffffff",
};

export const typography = {
  h1: { fontSize: 32, fontWeight: "800" as const, letterSpacing: -1.5 },
  h2: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.3 },
  subtitle1: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24 },
  subtitle2: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
  body1: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  body2: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  overline: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const shadows = {
  sm: { elevation: 2 },
  md: { elevation: 4 },
  lg: { elevation: 8 },
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
