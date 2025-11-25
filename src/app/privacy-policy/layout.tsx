import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Whole Lot of Nature",
  description: "Our privacy policy explains how we collect, use, and protect your personal information.",
  robots: "noindex, follow",
  openGraph: {
    title: "Privacy Policy | Whole Lot of Nature",
    description: "Learn how we protect your data and privacy",
    type: "website",
    url: "https://wholelotofnature.com/privacy-policy",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/privacy-policy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
