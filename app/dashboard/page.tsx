"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  pdfUrl?: string;
};

export default function DashboardPage() {
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const pdfFilter = searchParams.get("pdf");

  async function getBooks() {
    try {
      setLoading(true);

      const res = await fetch("/api/books");
      const data = await res.json();

      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error("Data books bukan array:", data);
        setBooks([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBook() {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      const res = await fetch(`/api/books/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeleteError(data.message || "Gagal menghapus buku");
        return;
      }

      setDeleteId(null);
      getBooks();
    } catch (error) {
      console.error("DELETE BOOK ERROR:", error);
      setDeleteError("Terjadi kesalahan saat menghapus buku");
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = books
      .map((book) => book.category)
      .filter(Boolean);

    return ["Semua", ...Array.from(new Set(uniqueCategories))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword);

      const matchCategory =
        selectedCategory === "Semua" || book.category === selectedCategory;

      const matchPdf =
        pdfFilter === "available"
          ? Boolean(book.pdfUrl)
          : pdfFilter === "empty"
          ? !book.pdfUrl
          : true;

      return matchSearch && matchCategory && matchPdf;
    });
  }, [books, search, selectedCategory, pdfFilter]);

  const totalBooks = books.length;
  const totalPdf = books.filter((book) => book.pdfUrl).length;
  const totalWithoutPdf = totalBooks - totalPdf;
  const totalCategory = categories.length - 1;

  const activeFilterTitle =
    pdfFilter === "available"
      ? "Buku dengan PDF"
      : pdfFilter === "empty"
      ? "Buku tanpa PDF"
      : "Semua Koleksi";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">Hapus Buku</h2>

            <p className="mt-2 text-sm text-slate-300">
              Yakin ingin menghapus buku ini?
            </p>

            {deleteError && (
              <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteId(null);
                  setDeleteError("");
                }}
                disabled={deleteLoading}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={deleteBook}
                disabled={deleteLoading}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative min-h-screen px-6 py-8 lg:ml-72">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-lg">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
                Dashboard Rak Baca
              </div>

              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Koleksi Buku Digital
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Kelola data buku, cover, kategori, dan file PDF dalam satu
                dashboard.
              </p>

              <div className="mt-6">
                <Link
                  href="/books/add"
                  className="inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  + Tambah Buku
                </Link>
              </div>
            </div>
          </header>

          <section className="mb-8 grid gap-5 md:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm font-medium text-slate-400">Total Buku</p>
              <h2 className="mt-3 text-4xl font-black text-white">
                {totalBooks}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm font-medium text-slate-400">
                Buku dengan PDF
              </p>
              <h2 className="mt-3 text-4xl font-black text-emerald-300">
                {totalPdf}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm font-medium text-slate-400">Tanpa PDF</p>
              <h2 className="mt-3 text-4xl font-black text-amber-300">
                {totalWithoutPdf}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm font-medium text-slate-400">Kategori</p>
              <h2 className="mt-3 text-4xl font-black text-cyan-300">
                {totalCategory}
              </h2>
            </div>
          </section>

          <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Daftar Buku</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Filter aktif:{" "}
                  <span className="font-semibold text-blue-300">
                    {activeFilterTitle}
                  </span>
                </p>
              </div>

              <p className="text-sm text-slate-400">
                {filteredBooks.length} dari {totalBooks} buku
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_280px]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Cari Buku
                </label>

                <input
                  type="text"
                  placeholder="Cari judul, penulis, atau kategori..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Filter Kategori
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm text-white outline-none focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center">
              <p className="text-sm text-slate-400">Memuat data buku...</p>
            </section>
          ) : filteredBooks.length === 0 ? (
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-12 text-center">
              <h2 className="text-2xl font-bold text-white">
                Buku tidak ditemukan
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Tidak ada buku yang sesuai dengan pencarian atau filter.
              </p>

              <Link
                href="/books/add"
                className="mt-6 inline-block rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Tambah Buku
              </Link>
            </section>
          ) : (
            <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <article
                  key={book._id}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 transition hover:border-blue-500/60"
                >
                  <div className="relative flex h-96 items-center justify-center overflow-hidden bg-slate-950 p-5">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="h-full w-full object-contain"
                    />

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-blue-400/30 bg-blue-500/80 px-3 py-1 text-xs font-bold text-white">
                        {book.category}
                      </span>
                    </div>

                    <div className="absolute right-4 top-4">
                      {book.pdfUrl ? (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/80 px-3 py-1 text-xs font-bold text-white">
                          PDF
                        </span>
                      ) : (
                        <span className="rounded-full border border-slate-500/30 bg-slate-700/90 px-3 py-1 text-xs font-bold text-slate-200">
                          Tanpa PDF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="line-clamp-2 text-xl font-black leading-snug text-white">
                      {book.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {book.author}
                    </p>

                    <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-300">
                      {book.description.length > 120
                        ? `${book.description.slice(0, 120)}...`
                        : book.description}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Link
                        href={`/books/read/${book._id}`}
                        className={`rounded-2xl px-3 py-3 text-center text-sm font-bold transition ${
                          book.pdfUrl
                            ? "bg-emerald-500/70 text-white hover:bg-emerald-500/90"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        Baca
                      </Link>

                      <Link
                        href={`/books/edit/${book._id}`}
                        className="rounded-2xl bg-amber-400/70 px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-amber-400/90"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteId(book._id)}
                        className="rounded-2xl bg-rose-500/70 px-3 py-3 text-sm font-bold text-white transition hover:bg-rose-500/90"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}