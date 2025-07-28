import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Restaurant Menu - Order Online",
  description: "Browse our delicious menu and order online for pickup or delivery. Fresh ingredients, great taste, fast service.",
  keywords: ["restaurant", "menu", "food", "order online", "delivery", "pickup"],
  authors: [{ name: "Restaurant Team" }],
  creator: "Restaurant Management System",
  publisher: "Restaurant",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Restaurant Menu - Order Online",
    description: "Browse our delicious menu and order online for pickup or delivery.",
    siteName: "Restaurant Menu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Menu - Order Online",
    description: "Browse our delicious menu and order online for pickup or delivery.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#b2d98b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full restaurant-bg-background restaurant-text-foreground restaurant-font-body`}
      >
        <ThemeProvider>
          <div className="min-h-full">
            {children}
            <CartProvider />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
