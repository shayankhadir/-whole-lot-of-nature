import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gardening Tips, Plant Care & Nature Blog | Whole Lot of Nature",
  description: "Expert gardening guides, plant care tips, soil knowledge, and sustainable growing techniques. Learn from our community of gardening enthusiasts.",
  openGraph: {
    title: "Gardening Blog | Expert Tips & Plant Care Guides",
    description: "Discover expert gardening advice, plant care tips, and sustainable growing techniques from Whole Lot of Nature.",
    type: "website",
    url: "https://wholelotofnature.com/blog",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Whole Lot of Nature Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gardening Tips & Plant Care Blog",
    description: "Expert gardening guides and plant care tips",
    images: ["/og-cover.jpg"],
  },
  alternates: {
    canonical: "https://wholelotofnature.com/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
