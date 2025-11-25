import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Whole Lot of Nature",
  description: "Complete your purchase securely",
  robots: "noindex, follow",
  openGraph: {
    title: "Checkout",
    type: "website",
    url: "https://wholelotofnature.com/checkout",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/checkout",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
