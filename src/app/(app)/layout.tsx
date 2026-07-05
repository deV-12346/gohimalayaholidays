import type { Metadata } from "next";
import { Outfit } from 'next/font/google'
import "../globals.css";
import Navbar from "@/components/layouts/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layouts/Footer";
import WhatsappButton from "@/components/home/WhatsAppButton";

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit'
})

export const metadata: Metadata = {
  metadataBase: new URL("https://gohimalayaholidays.com"),

  title: {
    default: "Go Himalaya Holidays",
    template: "%s | Go Himalaya Holidays",
  },

  description:
    "Explore Himachal tour packages including Shimla, Manali, Kasol, Dharamshala and Spiti Valley with Go Himalaya Holidays.",

  keywords: [
    "Himachal Tour Packages",
    "Shimla Tour Package",
    "Manali Tour Package",
    "Kasol Trip",
    "Spiti Valley Tour",
    "Travel Agency Himachal",
    "Go Himalaya Holidays",
  ],

  openGraph: {
    title: "Go Himalaya Holidays",
    description:
      "Affordable Himachal tour packages and customized travel plans.",

    url: "https://gohimalayaholidays.com",

    siteName: "Go Himalaya Holidays",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Go Himalaya Holidays",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Go Himalaya Holidays",
    description:
      "Affordable Himachal tour packages and travel services.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
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
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center"/>
        {children}
        <WhatsappButton/>
      <Footer/>
      </body>
    </html>
  );
}