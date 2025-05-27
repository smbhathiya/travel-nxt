
import { createTheme, type Theme } from './utils/theme';

/**
 * Application theme definition
 */
export const theme: Theme = createTheme({
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.141 0.005 285.823)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.141 0.005 285.823)",
    
    // Modern green theme
    primary: "oklch(0.57 0.15 145)",
    primaryForeground: "oklch(0.985 0 0)",
    
    secondary: "oklch(0.967 0.001 286.375)",
    secondaryForeground: "oklch(0.21 0.006 285.885)",
    muted: "oklch(0.967 0.001 286.375)",
    mutedForeground: "oklch(0.552 0.016 285.938)",
    accent: "oklch(0.967 0.001 286.375)",
    accentForeground: "oklch(0.21 0.006 285.885)",
    border: "oklch(0.92 0.004 286.32)",
    input: "oklch(0.92 0.004 286.32)",
    ring: "oklch(0.57 0.15 145)",
  },
  dark: {
    background: "oklch(0.141 0.005 285.823)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.21 0.006 285.885)",
    cardForeground: "oklch(0.985 0 0)",
    popover: "oklch(0.21 0.006 285.885)",
    popoverForeground: "oklch(0.985 0 0)",
    
    // Modern green theme for dark mode
    primary: "oklch(0.62 0.16 145)",
    primaryForeground: "oklch(0.1 0.005 285.823)",
    
    secondary: "oklch(0.274 0.006 286.033)",
    secondaryForeground: "oklch(0.985 0 0)",
    muted: "oklch(0.274 0.006 286.033)",
    mutedForeground: "oklch(0.705 0.015 286.067)",
    accent: "oklch(0.274 0.006 286.033)",
    accentForeground: "oklch(0.985 0 0)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.57 0.15 145)"
  }
});
