import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Ben Gubler",
    default: "Ben Gubler",
  },
  metadataBase: new URL("https://www.bengubler.com"),
  description:
    "Ben Gubler is a computer scientist, open-source maintainer, and aspiring polyglot",
  openGraph: {
    title: "Ben Gubler",
    description:
      "Ben Gubler is a computer scientist, open-source maintainer, and aspiring polyglot",
    url: "https://bengubler.com",
    siteName: "Ben Gubler",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://bengubler.com/api/og",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
  twitter: {
    title: "Ben Gubler",
    card: "summary_large_image",
    creator: "@nebrelbug",
    siteId: "1249828411041701888",
  },
  icons: {
    shortcut: "https://maxleiter.com/favicons/favicon.ico",
  },
  alternates: {
    types: {
      // TODO
      // "application/rss+xml": "https://maxleiter.com/feed.xml",
    },
  },
};

export const viewport = {
  // these are the HEX versions of the colors in @/globals.css
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          {process.env.NODE_ENV === "production" && (
            <Script
              async
              src="https://umami.bengubler.com/script.js"
              data-website-id="498eb52a-3a81-433c-9813-8d45f976cce7"
            />
          )}
        </body>
      </html>
    </ViewTransitions>
  );
}
