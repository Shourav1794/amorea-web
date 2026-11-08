import type { Metadata, Viewport } from "next";
import { Dancing_Script, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "./site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comingSoonFont = Dancing_Script({
  variable: "--font-coming-soon",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Amorea Bangladesh | Pakistani Fashion, Skincare & Lifestyle",
  description:
    "Discover curated Pakistani fashion, skincare, bags, and footwear at Amorea Bangladesh. Explore featured collections and contact our team.",
  applicationName: "Amorea",
  authors: [{ name: "Amorea" }],
  creator: "Amorea",
  publisher: "Amorea",
  keywords: [
    "Amorea Bangladesh",
    "Pakistani fashion Bangladesh",
    "Pakistani dresses Bangladesh",
    "skincare Bangladesh",
    "women's fashion Dhaka",
    "bags and footwear Bangladesh",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.JPG",
    apple: "/logo.JPG",
  },
  openGraph: {
    title: "Amorea Bangladesh | Pakistani Fashion, Skincare & Lifestyle",
    description:
      "Discover curated Pakistani fashion, skincare, bags, and footwear at Amorea Bangladesh.",
    url: "/",
    siteName: "Amorea",
    locale: "en_BD",
    alternateLocale: ["bn_BD"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amorea Bangladesh | Pakistani Fashion, Skincare & Lifestyle",
    description:
      "Discover curated Pakistani fashion, skincare, bags, and footwear at Amorea Bangladesh.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Amorea",
  url: siteUrl,
  logo: `${siteUrl}/logo.JPG`,
  telephone: "+8801779747967",
  sameAs: [
    "https://www.facebook.com/amorea.com.bd/about",
    "https://www.instagram.com/amorea.com.bd/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8801779747967",
    contactType: "customer service",
    areaServed: "BD",
    availableLanguage: ["English", "Bengali"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-BD" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${comingSoonFont.variable} min-h-full flex flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}