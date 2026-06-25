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
      <main className="min-h-screen bg-slate-100 p-8">
        <p className="text-slate-700">Memuat buku...</p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <p className="text-red-600">Buku tidak ditemukan.</p>

        <Link
          href="/dashboard"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Kembali ke Dashboard
        </Link>
      </main>
    );
  }

  const pdfViewerUrl = book.pdfUrl
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        book.pdfUrl
      )}`
    : "";

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {book.title}
            </h1>
            <p className="text-sm text-slate-600">
              Penulis: {book.author}
            </p>
          </div>

          <div className="flex gap-3">
            {book.pdfUrl && (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Buka PDF
              </a>
            )}

            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
            >
              Kembali
            </Link>
          </div>
        </div>

        {!book.pdfUrl ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-slate-700">
              File PDF untuk buku ini belum tersedia.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-4 shadow">
            <iframe
              src={pdfViewerUrl}
              className="h-[80vh] w-full rounded-lg border border-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              Jika PDF tidak muncul, klik tombol <b>Buka PDF</b> di atas.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}