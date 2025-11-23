export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'url2info',
  description:
    'Turn your URLs into clean infographics in seconds. Support WeChat Articles, Blogs, and News.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'How it Works',
      href: '/#how-it-works',
    },
    {
      label: 'Pricing',
      href: '/#pricing',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'How it Works',
      href: '/#how-it-works',
    },
    {
      label: 'Pricing',
      href: '/#pricing',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
  ],
  links: {
    github: '#',
    twitter: '#',
    docs: '/docs',
    discord: '#',
    sponsor: '#',
  },
};
