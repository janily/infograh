/**
 * Feature Flags Configuration
 * 
 * Use this file to enable/disable features during development.
 * Set to `true` to enable, `false` to disable.
 */

export const FEATURE_FLAGS = {
  // Landing page sections
  SHOW_HOW_IT_WORKS: false,    // How it Works section on homepage
  SHOW_PRICING: false,          // Pricing section on homepage
  
  // Authentication & User features
  SHOW_AUTH: false,             // Sign In/Sign Up buttons and user menu
  SHOW_GITHUB_STAR: false,      // GitHub star button in navbar
  
  // Dashboard features
  SHOW_DASHBOARD_LINK: false,   // Dashboard link in navigation
  
  // Future features (placeholders)
  SHOW_TESTIMONIALS: false,     // Testimonials section
  SHOW_FAQ: false,              // FAQ section
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

