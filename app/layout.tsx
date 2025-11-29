import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/lib/authProvider";
import { Suspense } from "react";
import ProvidersWrapper from "./ProvidersWrapper";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060606' },
    { media: '(prefers-color-scheme: light)', color: '#F0F0ED' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://samedays.com'),
  title: "Samedays",
  description: `Welcome to Samedays`,
  manifest: `/api/manifest`,
  icons: [
    {
      rel: 'icon',
      url: '/logos/same_fav.svg',
      sizes: 'any',
      type: 'image/svg+xml'
    },
    {
      rel: 'apple-touch-icon',
      url: '/logos/same_fav.png',
      sizes: '180x180',
      type: 'image/png'
    },
    {
      rel: 'mask-icon',
      url: '/logos/same_fav.svg',
      color: '#000000',
      type: 'image/svg+xml'
    },
  ],
  twitter: {
    card: 'summary_large_image',
    title: {
      default: 'Samedays',
      template: ""
    },
    description: `Samedays`,
    images: '/logos/same_logo.png',
  },
  openGraph: {
    title: {
      default: 'Samedays',
      template: ""
    },
    description: ``,
    url: 'https://samedays.com',
    siteName: 'samedays.com',
    images: '/logos/same_logo.png',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Samedays',
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className="bg-inf0 no-scrollbar">
      <body
        className={`${inter.variable} font-sans antialiased w-screen h-full`}
        suppressHydrationWarning={true}
      >
        <Suspense fallback={<div className="h-screen w-screen bg-inf0" />}>
          <div className="h-full w-full">
            <NextAuthProvider>
              <ProvidersWrapper>
                {children}
              </ProvidersWrapper>
            </NextAuthProvider>
          </div>
        </Suspense>
      </body>
    </html>
  );
}
