import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whole Lot of Nature",
  description: "Premium plant store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}