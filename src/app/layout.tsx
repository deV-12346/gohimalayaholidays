import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/redux/ReduxProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gohimalayaholidays.com"),

  title: {
    default:"Go Himalaya Holidays | Himachal Tour Packages, Shimla, Manali & Spiti",
    template: "%s | Go Himalaya Holidays",
  },
  description:"Book affordable Himachal tour packages with Go Himalaya Holidays. Explore Shimla, Manali, Kasol, Dharamshala, Spiti Valley and customized honeymoon, family & group tours.",
  keywords: [
    "Go Himalaya Holidays",
    "Himachal Tour Packages",
    "Shimla Tour Package",
    "Manali Tour Package",
    "Spiti Valley Tour",
    "Kasol Tour",
    "Dharamshala Tour",
    "Kinnaur Tour",
    "Himachal Holiday Packages",
    "Travel Agency Himachal",
  ],
  authors: [
    {
      name: "Go Himalaya Holidays",
      url: "https://gohimalayaholidays.com",
    },
  ],
  creator: "Go Himalaya Holidays",
  publisher: "Go Himalaya Holidays",
  category: "Travel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
  title:"Go Himalaya Holidays | Himachal Tour Packages, Shimla, Manali & Spiti",
  description: "Explore affordable Himachal tour packages including Shimla, Manali, Kasol, Dharamshala and Spiti Valley.",
  url:"https://gohimalayaholidays.com",
  siteName: "Go Himalaya Holidays",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Go Himalaya Holidays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",

    title:
      "Go Himalaya Holidays | Himachal Tour Packages, Shimla, Manali & Spiti",

    description:
      "Affordable Himachal tour packages with customized travel plans.",

    images: ["/og-image.jpg"],

    creator: "@gohimalayaholidays",
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
  icon: "/favicon.svg",
  apple: "/apple-touch-icon.png", // optional
 },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        outfit.variable,
        geist.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <Toaster position="top-center" />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}