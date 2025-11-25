/**
 * Visual Style Theme Configuration
 * Extracted from prototype code to maintain consistent design system
 */

export const themeConfig = {
  // Color System - Semantic colors used throughout the application
  colors: {
    // Primary brand colors
    brand: {
      primary: '#006FEE', // Blue - main brand color
      secondary: '#9353D3', // Purple - secondary accent
      success: '#17C964', // Green - success states, CTAs
      warning: '#F5A524', // Orange - warnings
      danger: '#F31260', // Red - errors, destructive actions
    },

    // Neutral colors for content and backgrounds
    neutral: {
      foreground: 'hsl(var(--heroui-foreground))',
      background: 'hsl(var(--heroui-background))',
      content1: 'hsl(var(--heroui-content1))',
      content2: 'hsl(var(--heroui-content2))',
      default: {
        100: 'hsl(var(--heroui-default-100))',
        200: 'hsl(var(--heroui-default-200))',
        400: 'hsl(var(--heroui-default-400))',
        500: 'hsl(var(--heroui-default-500))',
        600: 'hsl(var(--heroui-default-600))',
      },
    },

    // Gradient color combinations
    gradients: {
      violet: { from: '#FF1CF7', to: '#b249f8' },
      yellow: { from: '#FF705B', to: '#FFB457' },
      blue: { from: '#5EA2EF', to: '#0072F5' },
      cyan: { from: '#00b7fa', to: '#01cfea' },
      green: { from: '#6FEE8D', to: '#17c964' },
      pink: { from: '#FF72E1', to: '#F54C7A' },
      primarySecondary: { from: 'primary', to: 'secondary' },
    },
  },

  // Typography System
  typography: {
    // Font families
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },

    // Font sizes with line heights
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      '5xl': ['3rem', { lineHeight: '1.2' }], // 48px
    },

    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },

    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Spacing System (used for margin, padding, gap)
  spacing: {
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
  },

  // Border Radius System
  borderRadius: {
    sm: '0.25rem', // 4px
    base: '0.5rem', // 8px - rounded
    lg: '0.75rem', // 12px - rounded-lg
    xl: '1rem', // 16px - rounded-xl
    '2xl': '1.5rem', // 24px - rounded-2xl
    '3xl': '2rem', // 32px - rounded-3xl
    full: '9999px', // rounded-full
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Opacity levels commonly used
  opacity: {
    5: '0.05',
    10: '0.1',
    20: '0.2',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    80: '0.8',
  },

  // Border widths
  borderWidth: {
    DEFAULT: '1px',
    0: '0px',
    2: '2px',
    4: '4px',
  },

  // Animation and transitions
  animation: {
    // Easing functions
    easing: {
      smooth: 'cubic-bezier(0.22, 1, 0.36, 1)', // Custom smooth easing
      default: 'ease',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
    },
    // Duration
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.6s',
    },
  },

  // Backdrop blur values
  backdropBlur: {
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
  },

  // Component-specific styles
  components: {
    // Card styles
    card: {
      background: 'bg-content1/60',
      border: 'border border-default-100',
      hoverBorder: 'hover:border-primary/30',
      padding: 'p-6',
      borderRadius: 'rounded-xl',
    },

    // Button styles
    button: {
      primary: {
        background: 'bg-primary',
        text: 'text-white',
        hover: 'hover:bg-primary/90',
      },
      success: {
        background: 'bg-success',
        text: 'text-white',
        hover: 'hover:bg-success/90',
      },
      sizes: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-5 text-base',
      },
    },

    // Input/Form field styles
    input: {
      border: 'border-2 border-default-200',
      focusBorder: 'focus-within:border-success',
      focusRing: 'focus-within:ring-2 focus-within:ring-success',
      borderRadius: 'rounded-lg',
      height: {
        md: 'h-14',
        lg: 'h-16',
      },
    },

    // Badge/Chip styles
    badge: {
      background: 'bg-default-100',
      borderRadius: 'rounded-full',
      padding: 'px-3 py-1',
      text: 'text-xs font-medium',
    },

    // Navbar styles
    navbar: {
      background: 'backdrop-blur supports-[backdrop-filter]:bg-background/60',
      border: 'border-b border-divider',
    },
  },

  // Layout configurations
  layout: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1400px',
      '7xl': '1536px',
    },
    container: {
      padding: {
        DEFAULT: '1rem', // px-4
        sm: '1.5rem', // px-6
        lg: '2rem', // px-8
      },
    },
  },
} as const;

export type ThemeConfig = typeof themeConfig;
