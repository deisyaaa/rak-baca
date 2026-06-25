"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  async function getBooks() {
    try {
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
    }
  }

  async function deleteBook(id: string) {
    const confirmDelete = confirm("Yakin ingin menghapus buku ini?");
    if (!confirmDelete) return;

    await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    getBooks();
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

      return matchSearch && matchCategory;
    });
  }, [books, search, selectedCategory]);

  const totalBooks = books.length;
  const totalPdf = books.filter((book) => book.pdfUrl).length;
  const totalCategory = categories.length - 1;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-400">
                Dashboard Rak Baca
              </p>

              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Kelola Koleksi Buku Digital
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Tambahkan buku, unggah cover, simpan file PDF, edit data buku,
                dan baca koleksi digital langsung dari aplikasi.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/books/add"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                + Tambah Buku
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <p className="text-sm text-slate-400">Total Buku</p>
            <h2 className="mt-3 text-4xl font-bold text-white">
              {totalBooks}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Semua koleksi yang tersimpan.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <p className="text-sm text-slate-400">Buku dengan PDF</p>
            <h2 className="mt-3 text-4xl font-bold text-white">
              {totalPdf}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Buku yang dapat dibaca digital.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <p className="text-sm text-slate-400">Kategori Buku</p>
            <h2 className="mt-3 text-4xl font-bold text-white">
              {totalCategory}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Jenis kategori yang tersedia.
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Cari Buku
              </label>

              <input
                type="text"
                placeholder="Cari berdasarkan judul, penulis, atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Filter Kategori
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
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

        {filteredBooks.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-2xl font-bold text-white">
              Buku tidak ditemukan
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Coba ubah kata kunci pencarian atau tambahkan buku baru.
            </p>

            <Link
              href="/books/add"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Tambah Buku Baru
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-blue-950/40"
              >
                <div className="relative flex h-96 items-center justify-center overflow-hidden bg-slate-950 p-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      {book.category}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4">
                    {book.pdfUrl ? (
                      <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
                        PDF tersedia
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 shadow">
                        Tanpa PDF
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold leading-snug text-white">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Penulis: {book.author}
                  </p>

                  <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-300">
                    {book.description.length > 130
                      ? `${book.description.slice(0, 130)}...`
                      : book.description}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Link
                      href={`/books/read/${book._id}`}
                      className={`rounded-xl px-3 py-2 text-center text-sm font-semibold transition ${
                        book.pdfUrl
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      Baca
                    </Link>

                    <Link
                      href={`/books/edit/${book._id}`}
                      className="rounded-xl bg-yellow-500 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-yellow-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteBook(book._id)}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
    </main>
  );
}