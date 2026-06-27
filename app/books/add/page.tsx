"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddBookPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  });

  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleCoverChange(file: File | null) {
    setCover(file);

    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview("");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      let pdfUrl = "";

      if (pdfFile) {
        const pdfFormData = new FormData();
        pdfFormData.append("pdf", pdfFile);

        const pdfRes = await fetch("/api/upload-pdf", {
          method: "POST",
          body: pdfFormData,
        });

        const pdfData = await pdfRes.json();

        if (!pdfRes.ok) {
          setErrorMessage(pdfData.message || "Upload PDF gagal");
          return;
        }

        pdfUrl = pdfData.pdfUrl;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("pdfUrl", pdfUrl);

      if (cover) {
        formData.append("cover", cover);
      }

      const res = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal menambahkan buku");
        return;
      }

      setSuccessOpen(true);
    } catch (error) {
      console.error("ADD BOOK ERROR:", error);
      setErrorMessage("Terjadi kesalahan saat menambahkan buku");
    } finally {
      setLoading(false);
    }
  }

  function handleCloseSuccess() {
    setSuccessOpen(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-xl">
            <h2 className="text-xl font-bold text-white">Berhasil</h2>

            <p className="mt-2 text-sm text-slate-300">
              Buku berhasil ditambahkan.
            </p>

            <button
              type="button"
              onClick={handleCloseSuccess}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-xl">
            <h2 className="text-xl font-bold text-white">Gagal</h2>

            <p className="mt-2 text-sm text-slate-300">{errorMessage}</p>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Rak Baca
            </p>

            <h1 className="mt-2 text-3xl font-bold">Tambah Buku</h1>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            Kembali
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Judul Buku
                </label>

                <input
                  type="text"
                  placeholder="Masukkan judul buku"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Penulis
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan nama penulis"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Kategori
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: Novel"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Deskripsi
                </label>

                <textarea
                  placeholder="Masukkan deskripsi singkat"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Cover Buku
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleCoverChange(e.target.files?.[0] || null)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    File PDF
                  </label>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>

                <Link
                  href="/dashboard"
                  className="flex-1 rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Batal
                </Link>
              </div>
            </div>
          </form>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Preview Cover</h2>

            <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Preview cover"
                  className="max-h-[320px] w-full object-contain"
                />
              ) : (
                <p className="text-sm text-slate-500">Belum ada cover</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}