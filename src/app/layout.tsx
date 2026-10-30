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

export const metadata: Metadata = {
  title: "FinTrack - Aplikasi Pengelolaan Uang & Tabungan Bersama",
  description: "Pencatatan keuangan personal & bersama pasangan: Lacak arus kas harian, multi-rekening bank, target tabungan, dan kalender tagihan bulanan.",
  metadataBase: new URL("https://fintrack-jaee.vercel.app"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "FinTrack - Aplikasi Pengelolaan Uang & Tabungan Bersama",
    description: "Pencatatan arus kas harian, multi-rekening bank & e-wallet, kalender tagihan, dan tabungan keluarga.",
    url: "https://fintrack-jaee.vercel.app",
    siteName: "FinTrack Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinTrack Pro - Financial Management Platform",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinTrack - Aplikasi Pengelolaan Uang & Tabungan Bersama",
    description: "Pencatatan arus kas harian, multi-rekening bank & e-wallet, kalender tagihan, dan tabungan keluarga.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
