import { Box } from "ink";

// Cloudflare brand colors
export const CF_COLORS = {
  orange: "#F6821F",        // Primary brand color
  deepOrange: "#F38020",    // Deep orange
  lightOrange: "#FBAD41",   // Light orange
  gray: "#6B7280",          // Gray
  darkGray: "#1F2937",      // Dark gray
  white: "#FFFFFF",         // White
} as const;

export const baseBoxStyles: React.ComponentProps<typeof Box> = {
  flexDirection: "column",
  paddingX: 2,
  paddingY: 1,
  borderStyle: "round",
};

export const defaultBoxStyles = (
  borderColor: string,
  overrides?: Partial<React.ComponentProps<typeof Box>>,
): React.ComponentProps<typeof Box> => ({
  ...baseBoxStyles,
  borderColor,
  ...overrides,
});
