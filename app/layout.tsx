import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ConditionalNavbar } from "@/components/conditional-navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen bg-gradient-to-br from-default-100 to-background">
            <ConditionalNavbar />
            <main className="pt-0 flex-grow snap-y snap-mandatory">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center gap-4 py-3 border-t border-default-200">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://fal.ai"
                title="fal.ai homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">FAL AI</p>
              </Link>
              <span className="text-default-400">•</span>
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://x.com/deifosv"
                title="Built by Vlad"
              >
                <span className="text-default-600">Built with</span>
                <span className="text-yellow-500">💛</span>
                <span className="text-default-600">and</span>
                <span>🔨</span>
                <span className="text-default-600">by</span>
                <p className="text-primary">Vlad</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
