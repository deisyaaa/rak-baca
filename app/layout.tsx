// Metadata digunakan untuk mengatur informasi halaman seperti title dan description
import type { Metadata } from "next";

// Import font Geist dan Geist_Mono dari Google Font bawaan Next.js
import { Geist, Geist_Mono } from "next/font/google";

// Import file CSS global
// File ini berlaku untuk seluruh halaman aplikasi
import "./globals.css";

// Konfigurasi font Geist Sans
// variable digunakan agar font bisa dipakai melalui CSS variable
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Konfigurasi font Geist Mono
// Biasanya digunakan untuk teks bergaya monospace seperti kode
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata default aplikasi
// title akan muncul di tab browser
// description digunakan sebagai deskripsi halaman
export const metadata: Metadata = {
  title: "Rak Baca",
  description: "Aplikasi perpustakaan digital berbasis web",
};

// RootLayout adalah layout utama aplikasi
// Semua halaman di dalam folder app akan dibungkus oleh layout ini
export default function RootLayout({
  children,
}: Readonly<{
  // children adalah isi halaman yang sedang dibuka
  // Contoh: app/page.tsx, app/dashboard/page.tsx, app/login/page.tsx
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}