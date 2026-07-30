import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MAISON — Designer Fashion",
  description: "Curated high fashion, delivered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body grain">
        <ConvexClientProvider>
          <Navbar />
          <main>{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
