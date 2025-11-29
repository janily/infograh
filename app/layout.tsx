import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import clsx from 'clsx';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { ConditionalNavbar } from '@/components/conditional-navbar';
import { Footer } from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  authors: [{ name: 'url2infographic' }],
  creator: 'url2infographic',
  publisher: 'url2infographic',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://url2infographic.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://url2infographic.com',
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: 'https://url2infographic.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'url2infographic - Turn URLs into clean infographics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['https://url2infographic.com/og-image.png'],
    creator: '@url2infographic',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head>
        <meta content='url2info' name='apple-mobile-web-app-title' />
      </head>
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className='relative flex flex-col min-h-screen bg-gradient-to-br from-default-100 to-background'>
            <ConditionalNavbar />
            <main className='flex-grow'>{children}</main>
            <Footer />
          </div>
        </Providers>

        <GoogleAnalytics gtag='G-742SLK7W01' />

        {/* Feedback Basket Widget built by vlad, if you clone this poject check out feedbackbasket.com :) */}
        <Script
          src='https://www.feedbackbasket.com/api/widget/script/cme3q0an50001jm04d6extjp1'
          strategy='lazyOnload'
        />
      </body>
    </html>
  );
}
