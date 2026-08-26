import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/ThemeProvider";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus ERP - Enterprise Financial Management System",
  description: "A comprehensive, world-class financial management system built with Next.js 16, TypeScript, and Tailwind CSS. Features include General Ledger, AP/AR, Treasury Management, Multi-Currency support, and advanced financial reporting with IFRS/GAAP compliance.",
  keywords: [
    "ERP", 
    "Financial Management System", 
    "Next.js", 
    "TypeScript", 
    "Tailwind CSS", 
    "React",
    "Enterprise Software",
    "Accounting",
    "General Ledger",
    "Multi-Currency",
    "IFRS",
    "GAAP"
  ],
  authors: [{ name: "Full Stack Developer" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Nexus ERP - Financial Management System",
    description: "Enterprise-grade financial management system with GL, AP/AR, Treasury, and Multi-Currency support",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus ERP - Financial Management System",
    description: "Built with Next.js 16, TypeScript, and Tailwind CSS",
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Nexus ERP',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
