// Menandakan bahwa komponen ini berjalan di sisi client/browser
// Dibutuhkan karena halaman ini memakai useState, useRouter, dan event form
"use client"; 

// Import useState untuk menyimpan dan mengubah state form serta loading
import { useState } from "react";

// Import Link dari Next.js untuk navigasi antar halaman tanpa reload penuh
import Link from "next/link";

// Import useRouter untuk melakukan redirect secara programatis
import { useRouter } from "next/navigation";

// Komponen halaman register
export default function RegisterPage() {
  // Inisialisasi router untuk berpindah halaman setelah register berhasil
  const router = useRouter();

  // State untuk menyimpan input form register
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State untuk menandai proses register sedang berlangsung atau tidak
  const [loading, setLoading] = useState(false);

  // Function untuk menangani proses register saat form disubmit
  async function handleRegister(e: React.FormEvent) {
    // Mencegah browser melakukan reload halaman saat form dikirim
    e.preventDefault();

    // Mengaktifkan kondisi loading
    setLoading(true);

    try {
      // Mengirim data register ke API /api/register dengan method POST
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          // Memberi tahu server bahwa data dikirim dalam format JSON
          "Content-Type": "application/json",
        },
        // Mengubah data form menjadi string JSON sebelum dikirim
        body: JSON.stringify(form),
      });

      // Mengambil response dari API dalam bentuk JSON
      const data = await res.json();

      // Jika response gagal, tampilkan pesan error
      if (!res.ok) {
        alert(data.message || "Register gagal");
        setLoading(false);
        return;
      }

      // Jika register berhasil, tampilkan pesan sukses
      alert("Register berhasil, silakan login");

      // Arahkan user ke halaman login
      router.push("/login");
    } catch (error) {
      // Menampilkan error di console jika terjadi kesalahan sistem
      console.error("REGISTER ERROR:", error);

      // Menampilkan pesan error kepada user
      alert("Terjadi kesalahan saat register");
    } finally {
      // Mematikan loading setelah proses selesai, baik berhasil maupun gagal
      setLoading(false);
    }
  }

  return (
    // Container utama halaman register
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      {/* Card form register */}
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        {/* Bagian header form */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
            Rak Baca
          </p>

          <h1 className="text-3xl font-bold text-white">
            Register Akun
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Buat akun baru untuk mulai mengelola koleksi buku digital.
          </p>
        </div>

        {/* Form register */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Input nama */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Nama
            </label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Input email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Input password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Buat password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Tombol submit register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        {/* Link menuju halaman login */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>

        {/* Link kembali ke halaman utama */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300"
          >
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </main>
  );
}