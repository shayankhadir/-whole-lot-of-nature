import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Whole Lot of Nature",
  description: "Review your items and proceed to checkout",
  robots: "noindex, follow",
  openGraph: {
    title: "Shopping Cart",
    type: "website",
    url: "https://wholelotofnature.com/cart",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/cart",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
