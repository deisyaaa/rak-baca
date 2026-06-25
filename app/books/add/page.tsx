"use client";

import { useState } from "react";
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let pdfUrl = "";

      // Upload PDF dulu
      if (pdfFile) {
        const pdfFormData = new FormData();
        pdfFormData.append("pdf", pdfFile);

        const pdfRes = await fetch("/api/upload-pdf", {
          method: "POST",
          body: pdfFormData,
        });

        const pdfData = await pdfRes.json();

        if (!pdfRes.ok) {
          alert(pdfData.message || "Upload PDF gagal");
          setLoading(false);
          return;
        }

        pdfUrl = pdfData.pdfUrl;
      }

      // Simpan buku
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

      if (res.ok) {
        alert("Buku berhasil ditambahkan");
        router.push("/dashboard");
      } else {
        alert(data.message || "Gagal menambahkan buku");
      }
    } catch (error) {
      console.error("ADD BOOK ERROR:", error);
      alert("Terjadi kesalahan saat menambahkan buku");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Rak Baca
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Tambah Buku Baru</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Tambahkan koleksi buku baru ke dalam sistem Rak Baca. Lengkapi
              informasi buku, unggah cover, dan tambahkan file PDF agar buku
              bisa dibaca langsung dari dashboard.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Form */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Form Input Buku
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Pastikan data buku diisi dengan lengkap agar koleksi terlihat
                lebih rapi dan informatif.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Judul Buku
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Laskar Pelangi"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
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
                    placeholder="Contoh: Andrea Hirata"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Kategori
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Novel, Pendidikan, Fiksi"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Deskripsi Buku
                </label>
                <textarea
                  placeholder="Tuliskan ringkasan atau gambaran singkat isi buku..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={5}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Cover Buku
                  </label>
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCover(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                      required
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Format yang disarankan: JPG, PNG, atau WEBP.
                    </p>
                    {cover && (
                      <p className="mt-2 text-xs text-green-400">
                        File dipilih: {cover.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    File PDF Buku
                  </label>
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-600"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Opsional. Jika diisi, buku bisa dibaca langsung dari
                      dashboard.
                    </p>
                    {pdfFile && (
                      <p className="mt-2 text-xs text-green-400">
                        File dipilih: {pdfFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {loading ? "Menyimpan Buku..." : "Simpan Buku"}
                </button>

                <Link
                  href="/dashboard"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Batal
                </Link>
              </div>
            </form>
          </section>

          {/* Panel informasi */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">
                Panduan Input Buku
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Gunakan panduan berikut agar data buku yang ditambahkan lebih
                jelas dan mudah dipahami pengguna.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-blue-400">
                    1. Judul & Penulis
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Isi sesuai nama buku asli dan nama penulis agar data akurat.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-blue-400">
                    2. Kategori
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Gunakan kategori yang relevan seperti Novel, Fiksi,
                    Pendidikan, Biografi, dan lainnya.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-blue-400">
                    3. Deskripsi
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Tulis ringkasan singkat isi buku agar pengguna tahu gambaran
                    umum buku tersebut.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-blue-400">
                    4. Cover & PDF
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Upload cover untuk tampilan visual, dan upload PDF jika
                    ingin buku dapat dibaca langsung.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-900/40 bg-gradient-to-br from-blue-600/15 to-slate-900 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">
                Tips Koleksi Digital
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>• Gunakan cover berkualitas baik agar tampilan lebih menarik.</li>
                <li>• Tulis deskripsi singkat namun jelas dan informatif.</li>
                <li>• Pastikan file PDF sesuai dengan buku yang diinput.</li>
                <li>• Gunakan kategori yang konsisten agar mudah difilter.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}