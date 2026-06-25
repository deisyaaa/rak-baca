"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  });

  const [oldCoverUrl, setOldCoverUrl] = useState("");
  const [oldPdfUrl, setOldPdfUrl] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function getBook() {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data: Book = await res.json();

        setForm({
          title: data.title || "",
          author: data.author || "",
          category: data.category || "",
          description: data.description || "",
        });

        setOldCoverUrl(data.coverUrl || "");
        setOldPdfUrl(data.pdfUrl || "");
      } catch (error) {
        console.error("GET BOOK ERROR:", error);
        alert("Gagal mengambil data buku");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getBook();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);

    try {
      let pdfUrl = oldPdfUrl;

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
          setUpdating(false);
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

      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal mengubah buku");
        return;
      }

      alert("Buku berhasil diperbarui");
      router.push("/dashboard");
    } catch (error) {
      console.error("UPDATE BOOK ERROR:", error);
      alert("Terjadi kesalahan saat mengubah buku");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-6 shadow-xl">
          <p className="text-sm text-slate-300">Memuat data buku...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-yellow-400">
              Rak Baca
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Edit Data Buku
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Perbarui informasi buku yang sudah tersimpan. Kamu dapat mengubah
              judul, penulis, kategori, deskripsi, cover, dan file PDF jika
              diperlukan.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Form Edit Buku
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Data lama akan tetap tersimpan jika kamu tidak mengganti cover
                atau file PDF.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Judul Buku
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Masukkan judul buku"
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
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    placeholder="Masukkan nama penulis"
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
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    placeholder="Contoh: Novel, Fiksi, Pendidikan"
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
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Tuliskan deskripsi atau ringkasan buku"
                  rows={5}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Ganti Cover Buku
                  </label>

                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCover(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-600"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Kosongkan jika tidak ingin mengganti cover lama.
                    </p>

                    {cover && (
                      <p className="mt-2 text-xs text-green-400">
                        Cover baru: {cover.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Ganti File PDF
                  </label>

                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-600"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Kosongkan jika PDF lama tetap digunakan.
                    </p>

                    {pdfFile && (
                      <p className="mt-2 text-xs text-green-400">
                        PDF baru: {pdfFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {updating ? "Menyimpan Perubahan..." : "Update Buku"}
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

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">
                Preview Cover Saat Ini
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Cover yang sedang tersimpan akan tetap digunakan jika kamu tidak
                memilih file cover baru.
              </p>

              <div className="mt-5 flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
                {oldCoverUrl ? (
                  <img
                    src={oldCoverUrl}
                    alt={form.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-slate-500">
                    Cover belum tersedia
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">
                Status File Buku
              </h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-blue-400">
                    Cover Buku
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {cover
                      ? "Cover baru sudah dipilih."
                      : "Menggunakan cover lama."}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-blue-400">
                    File PDF
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {pdfFile
                      ? "PDF baru sudah dipilih."
                      : oldPdfUrl
                      ? "PDF lama masih tersedia."
                      : "Buku ini belum memiliki file PDF."}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-yellow-500/15 to-slate-950 p-4">
                  <p className="text-sm font-semibold text-yellow-300">
                    Catatan Edit
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Perubahan akan menggantikan data buku lama setelah tombol
                    Update Buku ditekan. Pastikan data sudah benar sebelum
                    menyimpan.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}