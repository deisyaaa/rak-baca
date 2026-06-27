import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Menentukan agar route ini berjalan menggunakan runtime Node.js
// Dibutuhkan karena proses upload file menggunakan Buffer dan Cloudinary
export const runtime = "nodejs";

// Fungsi untuk mengupload file PDF ke Cloudinary
function uploadPdf(buffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Membuat nama file yang aman untuk digunakan sebagai public_id
    // Menghapus ekstensi file, mengganti karakter selain huruf/angka/-/_ menjadi "-"
    // Lalu mengubah nama file menjadi huruf kecil
    const safeName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    // Membuat upload stream ke Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // resource_type: "raw" digunakan untuk file selain gambar/video, seperti PDF
        resource_type: "raw",

        // Menentukan lokasi dan nama file PDF di Cloudinary
        // Date.now() digunakan agar nama file unik dan tidak tertimpa file lain
        public_id: `rak-baca/pdfs/${Date.now()}-${safeName}.pdf`,
      },
      (error, result) => {
        // Jika terjadi error saat upload, proses akan ditolak
        if (error) {
          reject(error);
          return;
        }

        // Jika hasil upload tidak memiliki secure_url, kirim error
        if (!result?.secure_url) {
          reject(new Error("URL PDF tidak ditemukan"));
          return;
        }

        // Jika upload berhasil, kembalikan URL PDF dari Cloudinary
        resolve(result.secure_url);
      }
    );

    // Mengirim buffer file ke Cloudinary melalui upload stream
    uploadStream.end(buffer);
  });
}

// Handler POST untuk proses upload file PDF
export async function POST(req: Request) {
  try {
    // Mengambil data form yang dikirim dari frontend
    const formData = await req.formData();

    // Mengambil file PDF dari formData
    const file = formData.get("pdf") as File | null;

    // Validasi jika file PDF belum diupload
    if (!file) {
      return NextResponse.json(
        { message: "File PDF wajib diupload" },
        { status: 400 }
      );
    }

    // Validasi agar file yang diupload harus berformat PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "File harus berformat PDF" },
        { status: 400 }
      );
    }

    // Mengubah file menjadi arrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Mengubah arrayBuffer menjadi Buffer agar bisa diupload ke Cloudinary
    const buffer = Buffer.from(arrayBuffer);

    // Mengupload PDF ke Cloudinary dan mengambil URL hasil upload
    const pdfUrl = await uploadPdf(buffer, file.name);

    // Mengirim response jika upload PDF berhasil
    return NextResponse.json(
      {
        message: "Upload PDF berhasil",
        pdfUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    // Menampilkan error di terminal/server jika proses upload PDF gagal
    console.error("UPLOAD PDF ERROR:", error);

    // Mengirim response error jika upload PDF gagal
    return NextResponse.json(
      { message: "Gagal upload PDF" },
      { status: 500 }
    );
  }
}