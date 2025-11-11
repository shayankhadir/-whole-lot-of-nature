import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Layout from '@/components/layout/Layout';
import { Providers } from '@/components/providers';
import JsonLd from '@/components/JsonLd';
import { defaultMetadata } from '@/lib/metadata';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

export const metadata: Metadata = defaultMetadata;

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <link
          rel="preconnect"
          href={process.env.WORDPRESS_URL}
          crossOrigin="anonymous"
        />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="antialiased">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
        <JsonLd />
      </body>
    </html>
  );
}
