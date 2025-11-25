import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Whole Lot of Nature",
  description: "Learn about Whole Lot of Nature - our mission to provide premium plants, sustainable soil solutions, and expert gardening guidance since 2023.",
  openGraph: {
    title: "About Whole Lot of Nature | Premium Plants & Eco-Friendly Solutions",
    description: "Discover our commitment to sustainable gardening and organic plant care. Join our community of green enthusiasts.",
    type: "website",
    url: "https://wholelotofnature.com/about",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Whole Lot of Nature - About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Whole Lot of Nature",
    description: "Learn about our mission to provide premium plants and sustainable solutions.",
    images: ["/og-cover.jpg"],
  },
  alternates: {
    canonical: "https://wholelotofnature.com/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
