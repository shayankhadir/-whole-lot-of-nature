import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Whole Lot of Nature",
  description: "Review our terms and conditions for using Whole Lot of Nature services and purchasing products.",
  robots: "noindex, follow",
  openGraph: {
    title: "Terms & Conditions | Whole Lot of Nature",
    description: "Our terms and conditions for using our services",
    type: "website",
    url: "https://wholelotofnature.com/terms",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/terms",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
