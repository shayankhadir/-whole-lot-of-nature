import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Whole Lot of Nature",
  description: "Find answers to common questions about our plants, delivery, care instructions, and gardening services.",
  openGraph: {
    title: "FAQ | Whole Lot of Nature",
    description: "Common questions about plants, delivery, and gardening services",
    type: "website",
    url: "https://wholelotofnature.com/faq",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/faq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
