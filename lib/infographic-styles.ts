// Infographic style presets
export const INFOGRAPHIC_STYLES = {
  FUN_PLAYFUL:
    'STYLE: Fun, playful, vibrant 2D vector illustrations. Use bright colors, rounded shapes, and a friendly tone.',
  CLEAN_MINIMALIST:
    'STYLE: Ultra-minimalist. Lots of whitespace, thin lines, limited color palette (1-2 accent colors max). Very sophisticated and airy.',
  DARK_MODE_TECH:
    'STYLE: Dark mode technical aesthetic. Dark slate/black background with bright, glowing accent colors (cyan, lime green) for data points.',
  MODERN_EDITORIAL:
    'STYLE: Modern, flat vector illustration style. Clean, professional, and editorial (like a high-end tech magazine). Cohesive, mature color palette.',
} as const;

export type InfographicStyle = keyof typeof INFOGRAPHIC_STYLES;
