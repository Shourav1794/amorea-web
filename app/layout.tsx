import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Amorea Professional SEO & Open Graph Metadata
export const metadata: Metadata = {
  title: "Amorea | Premium Pakistani Wear, Skincare & Luxury Lifestyle in BD",
  description: "Shop authentic Pakistani dresses, premium skincare, stylish bags, and footwear at amorea.com.bd. Located in Gabtoli, Dhaka.",
  keywords: ["Amorea", "Pakistani Dresses in Bangladesh", "Skincare BD", "Amorea Fashion", "Womens Clothing Store Dhaka"],
  openGraph: {
    title: "Amorea | Premium Pakistani Wear & Skincare",
    description: "Discover authentic Pakistani dresses, premium skincare, stylish bags, and footwear curated exclusively for Bangladesh.",
    url: "https://amorea.com.bd",
    siteName: "Amorea",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}