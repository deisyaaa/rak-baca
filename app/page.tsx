import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rak Baca</h1>
          <p className="text-xs text-slate-400">Digital Library App</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Aplikasi pengelolaan buku digital berbasis web
          </div>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Kelola, simpan, dan baca buku digital dalam satu aplikasi.
          </h2>

          <p className="mb-8 max-w-xl text-base leading-8 text-slate-300">
            Rak Baca adalah aplikasi perpustakaan digital sederhana yang
            dirancang untuk membantu pengguna mengelola koleksi buku secara
            praktis. Pengguna dapat menambahkan data buku, mengunggah cover,
            menyimpan file PDF, membaca buku langsung dari aplikasi, serta
            mengelola data melalui dashboard yang aman setelah login.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Mulai Sekarang
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:border-blue-400 hover:bg-slate-900"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Dashboard Rak Baca</h3>
              <p className="text-sm text-slate-400">Preview fitur aplikasi</p>
            </div>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
              Aktif
            </span>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">Total Koleksi</p>
              <h4 className="mt-2 text-3xl font-bold">Buku Digital</h4>
              <p className="mt-2 text-sm text-slate-400">
                Data buku tersimpan dengan cover dan file PDF.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-600 p-5">
                <p className="text-sm text-blue-100">CRUD Buku</p>
                <h4 className="mt-2 text-2xl font-bold">Lengkap</h4>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">Akses</p>
                <h4 className="mt-2 text-2xl font-bold">Login</h4>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 p-5">
              <p className="mb-3 text-sm font-medium text-slate-300">
                Fitur tersedia:
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Tambah Buku
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Edit Buku
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Hapus Buku
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Baca PDF
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Upload Cover
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Fitur Utama Rak Baca</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Aplikasi ini dibuat untuk memudahkan pengelolaan koleksi buku
            digital dengan tampilan sederhana, rapi, dan mudah digunakan.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              1
            </div>
            <h3 className="mb-2 text-xl font-bold">Manajemen Buku</h3>
            <p className="text-sm leading-6 text-slate-400">
              Pengguna dapat menambahkan, mengubah, menghapus, dan melihat data
              buku melalui dashboard yang tersusun rapi.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              2
            </div>
            <h3 className="mb-2 text-xl font-bold">Upload Cover & PDF</h3>
            <p className="text-sm leading-6 text-slate-400">
              Setiap buku dapat dilengkapi cover dan file PDF agar tampilan
              lebih informatif dan buku bisa dibaca langsung.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              3
            </div>
            <h3 className="mb-2 text-xl font-bold">Autentikasi Pengguna</h3>
            <p className="text-sm leading-6 text-slate-400">
              Halaman dashboard dilindungi sistem login sehingga hanya pengguna
              terdaftar yang dapat mengakses pengelolaan buku.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="mb-6 text-3xl font-bold">Cara Kerja Aplikasi</h2>

          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="mb-2 text-sm text-blue-300">Langkah 01</p>
              <h3 className="font-bold">Register</h3>
              <p className="mt-2 text-sm text-slate-400">
                Pengguna membuat akun baru terlebih dahulu.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="mb-2 text-sm text-blue-300">Langkah 02</p>
              <h3 className="font-bold">Login</h3>
              <p className="mt-2 text-sm text-slate-400">
                Pengguna masuk untuk mengakses dashboard.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="mb-2 text-sm text-blue-300">Langkah 03</p>
              <h3 className="font-bold">Kelola Buku</h3>
              <p className="mt-2 text-sm text-slate-400">
                Tambah data buku, cover, kategori, dan file PDF.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="mb-2 text-sm text-blue-300">Langkah 04</p>
              <h3 className="font-bold">Baca Buku</h3>
              <p className="mt-2 text-sm text-slate-400">
                Buka file PDF langsung dari halaman baca buku.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-blue-600 p-10 text-center shadow-xl shadow-blue-600/20">
          <h2 className="text-3xl font-bold">
            Siap mengelola koleksi buku digital?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Masuk ke aplikasi Rak Baca untuk mulai menambahkan koleksi buku,
            mengunggah cover, menyimpan PDF, dan membaca buku secara digital.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Register
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
        © 2026 Rak Baca. Aplikasi perpustakaan digital berbasis web.
      </footer>
    </main>
  );
}