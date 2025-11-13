import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import QueryProvider from "@/components/providers/QueryClientProvider";
import Layout from "@/components/layout/Layout";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import Script from "next/script";
import { LoadingProvider } from "@/contexts/LoadingContext";
import PageLoadingScreen from "@/components/loading/PageLoadingScreen";
import { RouteTransitionProvider } from "@/components/loading/RouteTransitionProvider";
import { Suspense } from "react";
import FloatingDock from "@/components/ui/FloatingDock";

// Load brand typography: Inter (body), Montserrat (headings), and Playfair Display (display)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://wholelotofnature.com"),
  title: {
    default: "Whole Lot of Nature | Premium Plants, Soil & Natural Essentials",
    template: "%s | Whole Lot of Nature",
  },
  description:
    "Shop premium plants, soil mixes, leaf mould, and eco-friendly gardening essentials. Fast delivery across India. Expert tips, guides, and sustainable solutions.",
  keywords: [
    "plants",
    "soil mix",
    "leaf mould",
    "gardening",
    "organic",
    "Bangalore",
    "India",
    "aquatic plants",
    "succulents",
    "wellness herbal",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://wholelotofnature.com/",
    title: "Whole Lot of Nature | Premium Plants, Soil & Natural Essentials",
    description:
      "Premium plants, soil mixes, and eco-friendly gardening essentials delivered across India. Learn, grow, and thrive with nature.",
    siteName: "Whole Lot of Nature",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Whole Lot of Nature",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@wholelotofnature",
    creator: "@wholelotofnature",
    title: "Whole Lot of Nature | Premium Plants, Soil & Natural Essentials",
    description:
      "Premium plants, soil mixes, and eco-friendly gardening essentials delivered across India.",
    images: [
      {
        url: "/og-cover.jpg",
        alt: "Whole Lot of Nature",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      ['max-image-preview']: 'large',
      ['max-snippet']: -1,
      ['max-video-preview']: -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {/* Google Analytics (GA4) */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}

        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID ? (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`} />
            </noscript>
          </>
        ) : null}
        {/* JSON-LD: Organization */}
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Whole Lot of Nature',
            url: 'https://wholelotofnature.com',
            logo: 'https://wholelotofnature.com/icon-512.png',
            sameAs: [
              'https://www.youtube.com/@wholelotofnature',
              'https://www.instagram.com/wholelotofnature',
            ],
            contactPoint: [{
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'info@wholelotofnature.com',
              areaServed: 'IN',
              availableLanguage: ['en', 'hi'],
            }],
          })}
        </Script>

        {/* JSON-LD: Website with SearchAction (point to shop search) */}
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Whole Lot of Nature',
            url: 'https://wholelotofnature.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://wholelotofnature.com/shop?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          })}
        </Script>

        {/* JSON-LD: VideoObject for YouTube channel feature video */}
        <Script id="ld-video" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'Whole Lot of Nature - Plant Care Tips & Gardening Inspiration',
            description: 'Discover plant care tips and gardening inspiration on our YouTube channel.',
            thumbnailUrl: ['https://i.ytimg.com/vi/_KyLAP__E5M/hqdefault.jpg'],
            uploadDate: '2024-01-01',
            contentUrl: 'https://www.youtube.com/watch?v=_KyLAP__E5M',
            embedUrl: 'https://www.youtube.com/embed/_KyLAP__E5M',
            publisher: {
              '@type': 'Organization',
              name: 'Whole Lot of Nature',
            },
          })}
        </Script>

        {/* JSON-LD: Local SEO (Service area Bangalore) */}
        <Script id="ld-local" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Whole Lot of Nature',
            url: 'https://wholelotofnature.com',
            areaServed: [{ '@type': 'City', name: 'Bengaluru' }, { '@type': 'Country', name: 'India' }],
            sameAs: ['https://www.youtube.com/@wholelotofnature'],
          })}
        </Script>
        <NextAuthProvider>
          <QueryProvider>
            <LoadingProvider>
              <PageLoadingScreen />
              <Suspense fallback={null}>
                <RouteTransitionProvider>
                  <Layout>
                    {children}
                  </Layout>
                  {/* Floating Dock Navigation - macOS style */}
                  <FloatingDock />
                </RouteTransitionProvider>
              </Suspense>
            </LoadingProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}