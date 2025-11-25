import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Whole Lot of Nature",
  description: "View your profile, orders, and account settings",
  robots: "noindex, follow",
  openGraph: {
    title: "My Account",
    type: "website",
    url: "https://wholelotofnature.com/account",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/account",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
