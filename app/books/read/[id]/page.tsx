"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  pdfUrl?: string;
};

export default function ReadBookPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBook() {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();

        setBook(data);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getBook();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-6 shadow-xl">
          <p className="text-sm text-slate-300">Memuat buku...</p>
        </div>
      </main>
    );
  }

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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-400">
                Rak Baca Reader
              </p>

              <h1 className="text-3xl font-bold text-white md:text-4xl">
                {book.title}
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Penulis: <span className="text-slate-200">{book.author}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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

              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
              >
                ← Kembali
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          {/* Informasi Buku */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Informasi Buku
              </h2>

              <div className="flex h-[430px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-contain"
                />
              </div>

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

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white">Deskripsi</h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {book.description}
              </p>
            </section>
          </aside>

          {/* Reader PDF */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Pembaca PDF
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Gunakan area ini untuk membaca file buku secara langsung.
                </p>
              </div>

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

                  <Link
                    href={`/books/edit/${book._id}`}
                    className="mt-6 inline-block rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600"
                  >
                    Edit Buku
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                <iframe
                  src={book.pdfUrl}
                  className="h-[720px] w-full bg-white"
                />

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