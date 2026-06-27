// Menandakan bahwa komponen ini berjalan di sisi client/browser
// Dibutuhkan karena memakai hook usePathname, useSearchParams, dan signOut
"use client";

// Import Link dari Next.js untuk navigasi antar halaman tanpa reload penuh
import Link from "next/link";

// Import hook dari Next.js untuk membaca path dan query parameter URL
import { usePathname, useSearchParams } from "next/navigation";

// Import signOut dari NextAuth untuk proses logout user
import { signOut } from "next-auth/react";

// Data menu utama sidebar
// Setiap item memiliki label untuk teks menu dan href untuk tujuan halaman
const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Koleksi Buku",
    href: "/dashboard?section=koleksi",
  },
  {
    label: "Tambah Buku",
    href: "/books/add",
  },
  {
    label: "Kategori",
    href: "/dashboard?filter=kategori",
  },
];

// Data menu filter koleksi
// Menu ini digunakan untuk memfilter buku berdasarkan ketersediaan PDF
const filterItems = [
  {
    label: "Buku dengan PDF",
    href: "/dashboard?pdf=available",
  },
  {
    label: "Buku tanpa PDF",
    href: "/dashboard?pdf=empty",
  },
];

// Komponen utama Sidebar
export default function Sidebar() {
  // Mengambil path halaman yang sedang aktif
  // Contoh: /dashboard atau /books/add
  const pathname = usePathname();

  // Mengambil query parameter dari URL
  // Contoh: ?pdf=available atau ?filter=kategori
  const searchParams = useSearchParams();

  // Mengambil nilai query pdf dari URL
  const currentPdf = searchParams.get("pdf");

  // Mengambil nilai query filter dari URL
  const currentFilter = searchParams.get("filter");

  // Mengambil nilai query section dari URL
  const currentSection = searchParams.get("section");

  // Function untuk menentukan apakah menu sedang aktif atau tidak
  // Hasilnya digunakan untuk memberi warna berbeda pada menu aktif
  const isActive = (href: string) => {
    // Kondisi khusus untuk menu Dashboard
    // Dashboard aktif jika path /dashboard dan tidak ada query filter apa pun
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" &&
        !currentPdf &&
        !currentFilter &&
        !currentSection
      );
    }

    // Kondisi khusus untuk halaman tambah buku
    if (href === "/books/add") {
      return pathname === "/books/add";
    }

    // Kondisi aktif untuk menu Koleksi Buku
    if (href.includes("section=koleksi")) {
      return currentSection === "koleksi";
    }

    // Kondisi aktif untuk menu Kategori
    if (href.includes("filter=kategori")) {
      return currentFilter === "kategori";
    }

    // Kondisi aktif untuk filter Buku dengan PDF
    if (href.includes("pdf=available")) {
      return currentPdf === "available";
    }

    // Kondisi aktif untuk filter Buku tanpa PDF
    if (href.includes("pdf=empty")) {
      return currentPdf === "empty";
    }

    // Kondisi default jika tidak termasuk query khusus
    return pathname === href;
  };

  // Function untuk menangani logout user
  const handleLogout = async () => {
    // signOut akan menghapus session login
    // callbackUrl menentukan halaman tujuan setelah logout
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    // Sidebar utama
    // fixed membuat sidebar tetap di kiri layar
    // hidden lg:block membuat sidebar hanya tampil di layar besar
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-slate-950/95 px-5 py-6 text-white shadow-2xl backdrop-blur-xl lg:block">
      {/* Bagian logo aplikasi */}
      <div className="mb-8 rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5">
        <div className="flex items-center gap-4">
          {/* Kotak inisial logo Rak Baca */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black tracking-wide text-white shadow-lg shadow-blue-600/20">
            RB
          </div>

          {/* Nama aplikasi */}
          <div>
            <h1 className="text-xl font-bold tracking-tight">Rak Baca</h1>
            <p className="mt-1 text-xs text-slate-400">Kelola buku digital</p>
          </div>
        </div>
      </div>

      {/* Bagian menu utama */}
      <div className="mb-8">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Menu Utama
        </p>

        {/* Daftar menu utama */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bagian filter koleksi */}
      <div>
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Filter Koleksi
        </p>

        {/* Daftar menu filter koleksi */}
        <nav className="space-y-2">
          {filterItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tombol logout di bagian bawah sidebar */}
      <div className="absolute bottom-6 left-5 right-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-500 hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}