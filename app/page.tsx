import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <h1 className="text-2xl font-bold">Rak Baca</h1>
          <p className="text-xs text-slate-400">Digital Library App</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-blue-500"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Perpustakaan digital berbasis web
          </p>

          <h2 className="mb-5 text-5xl font-bold leading-tight md:text-6xl">
            Baca dan kelola buku digital lebih mudah.
          </h2>

          <p className="mb-8 max-w-xl text-base leading-7 text-slate-400">
            Rak Baca membantu pengguna menyimpan data buku, mengunggah cover,
            menambahkan file PDF, dan membaca buku langsung dari aplikasi.
          </p>

          <div className="flex gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Mulai Sekarang
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:border-blue-500"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Rak Baca</h3>
              <p className="text-sm text-slate-400">Fitur aplikasi</p>
            </div>

            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold">
              Aktif
            </span>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">Manajemen Buku</p>
              <h4 className="mt-2 text-2xl font-bold">CRUD Lengkap</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-600 p-5">
                <p className="text-sm text-blue-100">Upload</p>
                <h4 className="mt-2 text-xl font-bold">Cover</h4>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">Reader</p>
                <h4 className="mt-2 text-xl font-bold">PDF</h4>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 p-5">
              <p className="text-sm text-slate-400">
                Login diperlukan untuk masuk ke dashboard dan mengelola koleksi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-2 text-lg font-bold">Tambah Buku</h3>
            <p className="text-sm text-slate-400">
              Input data buku dengan cover dan kategori.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-2 text-lg font-bold">Upload PDF</h3>
            <p className="text-sm text-slate-400">
              Simpan file PDF agar buku bisa dibaca.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-2 text-lg font-bold">Dashboard</h3>
            <p className="text-sm text-slate-400">
              Kelola buku melalui tampilan yang rapi.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}