# Visual Style Theme Configuration

This document describes the design system and visual style guidelines extracted from the codebase and consolidated into the Tailwind theme configuration.

## Overview

The theme configuration provides a consistent design language across the application with carefully selected colors, typography, spacing, and component styles.

## Color System

### Brand Colors

The application uses a semantic color system based on HeroUI with custom brand colors:

- **Primary** (`#006FEE`): Blue - Main brand color used for primary actions and key UI elements
- **Secondary** (`#9353D3`): Purple - Secondary accent color for complementary elements
- **Success** (`#17C964`): Green - Success states, positive actions, and CTAs
- **Warning** (`#F5A524`): Orange - Warning states and attention-grabbing elements
- **Danger** (`#F31260`): Red - Error states and destructive actions

### Usage Examples

```tsx
// Using brand colors
<Button className="bg-brand-success text-white">Generate</Button>
<div className="border-2 border-brand-primary">Content</div>

// Using semantic HeroUI colors
<div className="bg-primary">Primary action</div>
<div className="text-default-500">Secondary text</div>
```

### Gradient Combinations

Pre-defined gradient combinations for consistent visual effects:

```tsx
// Gradient definitions in theme.config.ts
gradients: {
  violet: { from: '#FF1CF7', to: '#b249f8' },
  yellow: { from: '#FF705B', to: '#FFB457' },
  blue: { from: '#5EA2EF', to: '#0072F5' },
  // ... more gradients
}

// Usage
<div className="bg-gradient-to-r from-primary to-secondary">
  Gradient background
</div>
```

## Typography

### Font Families

- **Sans**: System font stack for body text
- **Mono**: Monospace font for code

### Font Sizes

Consistent font size scale with appropriate line heights:

- `text-xs` (12px) - Small labels, badges
- `text-sm` (14px) - Secondary text
- `text-base` (16px) - Body text
- `text-lg` (18px) - Emphasized text
- `text-xl` (20px) - Section headings
- `text-2xl` (24px) - Large stats, numbers
- `text-3xl` (30px) - Page subheadings
- `text-4xl` (36px) - Hero titles
- `text-5xl` (48px) - Large hero titles

### Font Weights

- `font-normal` (400) - Body text
- `font-medium` (500) - Emphasized text
- `font-semibold` (600) - Headings
- `font-bold` (700) - Strong emphasis
- `font-black` (900) - Extra bold headlines

### Usage Example

```tsx
<h1 className="text-4xl font-black tracking-tighter">
  Turn your URLs into clean infographics
</h1>
<p className="text-base font-normal text-default-500">
  Support for WeChat, blogs, and news
</p>
```

## Spacing System

Consistent spacing scale for margins, padding, and gaps:

- `1` (4px), `2` (8px), `3` (12px), `4` (16px)
- `5` (20px), `6` (24px), `8` (32px)
- `10` (40px), `12` (48px), `14` (56px), `16` (64px)

### Common Patterns

```tsx
// Card padding
<Card className="p-6">...</Card>

// Section spacing
<div className="py-14 px-6">...</div>

// Gap between elements
<div className="flex gap-4">...</div>
<div className="grid gap-6">...</div>
```

## Border Radius

Consistent corner rounding:

- `rounded-lg` (12px) - Small elements, inputs
- `rounded-xl` (16px) - Cards, larger containers
- `rounded-2xl` (24px) - Feature sections
- `rounded-3xl` (32px) - Large decorative elements
- `rounded-full` - Circular elements, badges

### Usage Example

```tsx
<Card className="rounded-xl">Card content</Card>
<div className="rounded-full w-3 h-3 bg-primary">Dot indicator</div>
```

## Shadows

Layered shadow system for depth:

- `shadow-lg` - Standard card elevation
- `shadow-xl` - Emphasized cards, modals
- `shadow-2xl` - Maximum elevation

### Usage Example

```tsx
<div className='bg-content1 rounded-xl shadow-lg p-8'>Elevated card</div>
```

## Component Patterns

### Cards

Standard card styling:

```tsx
<Card className='bg-content1/60 border border-default-100 h-full p-6'>
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
</Card>
```

With hover effect:

```tsx
<Card className='bg-content1/60 border border-default-100 hover:border-primary/30 transition-colors'>
  Interactive card
</Card>
```

### Buttons

Primary action button:

```tsx
<Button
  className='w-full h-12 px-5 bg-success text-white text-base font-bold'
  size='lg'
>
  Generate Infographic
</Button>
```

Secondary button:

```tsx
<Button color='primary' variant='flat' size='lg'>
  Choose Plan
</Button>
```

### Input Fields

Standard input with focus states:

```tsx
<div className='rounded-lg border-2 border-default-200 focus-within:ring-2 focus-within:ring-success focus-within:border-success'>
  <input
    className='flex-1 bg-transparent px-3 text-base text-foreground placeholder:text-default-400'
    placeholder='Enter text...'
  />
</div>
```

### Badges/Chips

```tsx
<div className='px-3 py-1 bg-default-100 rounded-full text-xs font-medium'>
  Label
</div>
```

### Color Indicators

Small circular color dots for categorization:

```tsx
<div className="w-3 h-3 bg-primary rounded-full" />
<div className="w-3 h-3 bg-success rounded-full" />
<div className="w-3 h-3 bg-warning rounded-full" />
```

## Animations

### Fade Up Animation

Used for page load animations:

```tsx
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

<motion.div initial='hidden' animate='visible' variants={fadeUp}>
  Content
</motion.div>;
```

### Stagger Container

For sequential animations:

```tsx
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

<motion.div variants={staggerContainer}>
  <motion.div variants={fadeUp}>Item 1</motion.div>
  <motion.div variants={fadeUp}>Item 2</motion.div>
</motion.div>;
```

### Transition Timing

Smooth cubic-bezier easing: `cubic-bezier(0.22, 1, 0.36, 1)`

## Opacity Levels

Consistent opacity values for backgrounds and overlays:

- `/5` (5%) - Subtle decorative backgrounds
- `/10` (10%) - Light gradient accents
- `/20` (20%) - Overlay gradients
- `/30` (30%) - Hover states
- `/40` (40%) - Active states
- `/60` (60%) - Semi-transparent backgrounds

### Usage Example

```tsx
<div className="bg-content1/60">Semi-transparent card</div>
<div className="bg-gradient-to-r from-primary/10 to-secondary/10">
  Subtle gradient background
</div>
```

## Layout Patterns

### Container

```tsx
<div className='container mx-auto max-w-7xl px-6 py-14'>Content</div>
```

### Responsive Grid

```tsx
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
  Grid items
</div>
```

### Section Layout

```tsx
<section className='w-full min-h-screen snap-start flex items-center'>
  <div className='container mx-auto max-w-7xl px-6 py-14'>Section content</div>
</section>
```

## Navbar Pattern

```tsx
<Navbar
  className='backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-divider'
  position='sticky'
  maxWidth='xl'
>
  Navbar content
</Navbar>
```

## Backdrop Effects

Blur effects for glass-morphism:

```tsx
<div className='backdrop-blur-sm bg-content1/80'>Glass effect card</div>
```

## Best Practices

1. **Use semantic colors**: Prefer `bg-primary`, `text-success` over hardcoded values
2. **Consistent spacing**: Use the spacing scale for all margins/padding
3. **Typography hierarchy**: Maintain consistent font size and weight combinations
4. **Component reusability**: Use the component patterns defined in `theme.config.ts`
5. **Opacity convention**: Use the standard opacity levels (/5, /10, /20, etc.)
6. **Border radius consistency**: Use `rounded-xl` for cards, `rounded-lg` for inputs
7. **Shadow layering**: Apply shadows consistently based on elevation needs
8. **Animation smoothness**: Use the custom `smooth` timing function for transitions

## Files

- `theme.config.ts` - Theme configuration constants and types
- `tailwind.config.js` - Tailwind CSS configuration
- `hero.ts` - Extended Tailwind configuration for Tailwind v4
- `styles/globals.css` - Global styles

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HeroUI Theme](https://heroui.com/docs/customization/theme)
- [Framer Motion](https://www.framer.com/motion/)
