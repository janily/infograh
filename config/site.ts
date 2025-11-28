import { FEATURE_FLAGS } from './feature-flags';

export type SiteConfig = typeof siteConfig;

// Build navigation items based on feature flags
const buildNavItems = () => {
  const items = [
    {
      label: 'Home',
      href: '/',
    },
  ];

  if (FEATURE_FLAGS.SHOW_HOW_IT_WORKS) {
    items.push({
      label: 'How it Works',
      href: '/#how-it-works',
    });
  }

  if (FEATURE_FLAGS.SHOW_PRICING) {
    items.push({
      label: 'Pricing',
      href: '/#pricing',
    });
  }

  return items;
};

const buildNavMenuItems = () => {
  const items = [
    {
      label: 'Home',
      href: '/',
    },
  ];

  if (FEATURE_FLAGS.SHOW_HOW_IT_WORKS) {
    items.push({
      label: 'How it Works',
      href: '/#how-it-works',
    });
  }

  if (FEATURE_FLAGS.SHOW_PRICING) {
    items.push({
      label: 'Pricing',
      href: '/#pricing',
    });
  }

  if (FEATURE_FLAGS.SHOW_DASHBOARD_LINK) {
    items.push({
      label: 'Dashboard',
      href: '/dashboard',
    });
  }

  return items;
};

export const siteConfig = {
  name: 'url2infographic - Turn your URL into infographic',
  description:
    'Turn your URLs into clean infographics in seconds. Support WeChat Articles, Blogs, and News.',
  navItems: buildNavItems(),
  navMenuItems: buildNavMenuItems(),
  links: {
    github: '#',
    twitter: '#',
    docs: '/docs',
    discord: '#',
    sponsor: '#',
  },
};
