import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Premium Plants & Gardening Essentials | Whole Lot of Nature",
  description: "Browse our collection of premium plants, soil mixes, leaf mould, and eco-friendly gardening essentials. Fast delivery across India.",
  openGraph: {
    title: "Shop Plants & Gardening Products | Whole Lot of Nature",
    description: "Premium plants and sustainable gardening essentials delivered across India. Explore our curated collection.",
    type: "website",
    url: "https://wholelotofnature.com/shop",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Whole Lot of Nature Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Plants & Gardening Essentials",
    description: "Premium plants and eco-friendly gardening products",
    images: ["/og-cover.jpg"],
  },
  alternates: {
    canonical: "https://wholelotofnature.com/shop",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
