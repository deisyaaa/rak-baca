"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Tipe data Book untuk menentukan struktur data buku
type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  pdfUrl?: string;
};

// Komponen halaman untuk membaca detail buku dan file PDF
export default function ReadBookPage() {
  // Mengambil parameter id dari URL
  const params = useParams<{ id: string }>();

  // Menyimpan id buku dari parameter URL
  const id = params.id;

  // State untuk menyimpan data buku
  const [book, setBook] = useState<Book | null>(null);

  // State untuk menandai proses loading saat mengambil data buku
  const [loading, setLoading] = useState(true);

  // useEffect dijalankan saat halaman dibuka atau ketika id berubah
  useEffect(() => {
    // Fungsi untuk mengambil detail buku dari API berdasarkan id
    async function getBook() {
      try {
        // Mengambil data buku dari API
        const res = await fetch(`/api/books/${id}`);

        // Mengubah response API menjadi JSON
        const data = await res.json();

        // Menyimpan data buku ke dalam state
        setBook(data);
      } catch (error) {
        // Menampilkan error di console jika gagal mengambil data buku
        console.error("Gagal mengambil data buku:", error);
      } finally {
        // Mematikan loading setelah proses selesai
        setLoading(false);
      }
    }

    // Jika id tersedia, jalankan fungsi getBook
    if (id) {
      getBook();
    }
  }, [id]);

  // Tampilan saat data buku masih dimuat
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-6 shadow-xl">
          <p className="text-sm text-slate-300">Memuat buku...</p>
        </div>
      </main>
    );
  }

  // Tampilan jika data buku tidak ditemukan
  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-white">
            Buku tidak ditemukan
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Data buku tidak tersedia atau sudah dihapus.
          </p>

          {/* Tombol kembali ke halaman dashboard */}
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Tampilan utama halaman baca buku
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              {/* Label halaman reader */}
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-400">
                Rak Baca Reader
              </p>

              {/* Judul buku */}
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                {book.title}
              </h1>

              {/* Nama penulis buku */}
              <p className="mt-2 text-sm text-slate-400">
                Penulis: <span className="text-slate-200">{book.author}</span>
              </p>
            </div>

            {/* Tombol aksi pada bagian header */}
            <div className="flex flex-wrap gap-3">
              {/* Tombol buka PDF hanya tampil jika pdfUrl tersedia */}
              {book.pdfUrl && (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                >
                  Buka PDF
                </a>
              )}

              {/* Tombol kembali ke dashboard */}
              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
              >
                ← Kembali
              </Link>
            </div>
          </div>
        </header>

        {/* Layout utama: informasi buku dan reader PDF */}
        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          {/* Informasi Buku */}
          <aside className="space-y-6">
            {/* Kartu informasi buku */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Informasi Buku
              </h2>

              {/* Tampilan cover buku */}
              <div className="flex h-[430px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Detail data buku */}
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Judul
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {book.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Penulis
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{book.author}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Kategori
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    {book.category}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Status File
                  </p>

                  {/* Menampilkan status ketersediaan file PDF */}
                  {book.pdfUrl ? (
                    <span className="mt-2 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                      PDF tersedia
                    </span>
                  ) : (
                    <span className="mt-2 inline-block rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
                      PDF belum tersedia
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Kartu deskripsi buku */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white">Deskripsi</h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {book.description}
              </p>
            </section>
          </aside>

          {/* Reader PDF */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            {/* Header bagian reader PDF */}
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Pembaca PDF
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Gunakan area ini untuk membaca file buku secara langsung.
                </p>
              </div>

              {/* Tombol buka PDF di tab baru jika PDF tersedia */}
              {book.pdfUrl && (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Buka di Tab Baru
                </a>
              )}
            </div>

            {/* Jika PDF belum tersedia, tampilkan pesan kosong */}
            {!book.pdfUrl ? (
              <div className="flex h-[720px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    PDF belum tersedia
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Buku ini belum memiliki file PDF. Silakan tambahkan atau edit
                    buku untuk mengunggah file PDF.
                  </p>

                  {/* Tombol menuju halaman edit buku untuk menambahkan PDF */}
                  <Link
                    href={`/books/edit/${book._id}`}
                    className="mt-6 inline-block rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600"
                  >
                    Edit Buku
                  </Link>
                </div>
              </div>
            ) : (
              // Jika PDF tersedia, tampilkan PDF menggunakan iframe
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                <iframe
                  src={book.pdfUrl}
                  className="h-[720px] w-full bg-white"
                />

                {/* Catatan jika PDF tidak tampil di iframe */}
                <div className="border-t border-slate-800 bg-slate-950 px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Jika PDF tidak tampil di area reader, klik tombol{" "}
                    <span className="font-semibold text-blue-400">
                      Buka di Tab Baru
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}