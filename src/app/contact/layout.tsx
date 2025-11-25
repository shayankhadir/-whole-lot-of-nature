import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Whole Lot of Nature",
  description: "Get in touch with our team. We're here to help with any questions about plants, gardening, or our products.",
  openGraph: {
    title: "Contact Whole Lot of Nature",
    description: "Reach out to our team for gardening advice and support",
    type: "website",
    url: "https://wholelotofnature.com/contact",
  },
  alternates: {
    canonical: "https://wholelotofnature.com/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
