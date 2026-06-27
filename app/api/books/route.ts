import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import cloudinary from "@/lib/cloudinary";

// Menentukan agar route ini berjalan menggunakan runtime Node.js
// Dibutuhkan karena proses upload file menggunakan Buffer dan Cloudinary
export const runtime = "nodejs";

// Handler GET untuk mengambil semua data buku
export async function GET() {
  try {
    // Menghubungkan aplikasi ke database MongoDB
    await connectDB();

    // Mengambil semua data buku dari database
    // sort({ createdAt: -1 }) digunakan agar buku terbaru tampil paling atas
    const books = await Book.find().sort({ createdAt: -1 });

    // Mengirim data buku dalam bentuk JSON
    return NextResponse.json(books);
  } catch (error) {
    // Menampilkan error di terminal/server jika gagal mengambil data buku
    console.error("GET BOOKS ERROR:", error);

    // Mengirim response error jika proses mengambil data buku gagal
    return NextResponse.json(
      { message: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}

// Handler POST untuk menambahkan data buku baru
export async function POST(req: Request) {
  try {
    // Menghubungkan aplikasi ke database MongoDB
    await connectDB();

    // Mengambil data form yang dikirim dari frontend
    const formData = await req.formData();

    // Mengambil nilai input dari formData
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const pdfUrl = formData.get("pdfUrl") as string;

    // Mengambil file cover dari formData
    const file = formData.get("cover") as File | null;

    // Validasi jika field wajib belum diisi
    if (!title || !author || !category || !description || !file) {
      return NextResponse.json(
        {
          message:
            "Judul, penulis, kategori, deskripsi, dan cover wajib diisi",
        },
        { status: 400 }
      );
    }

    // Mengubah file cover menjadi arrayBuffer
    const bytes = await file.arrayBuffer();

    // Mengubah arrayBuffer menjadi Buffer agar bisa di-upload ke Cloudinary
    const buffer = Buffer.from(bytes);

    // Upload file cover ke Cloudinary menggunakan upload_stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            // Folder penyimpanan cover di Cloudinary
            folder: "rak-baca/covers",

            // Menentukan bahwa file yang di-upload adalah gambar
            resource_type: "image",
          },
          (error, result) => {
            // Jika terjadi error saat upload, proses akan ditolak
            if (error) {
              reject(error);
              return;
            }

            // Jika upload berhasil, hasil upload dikembalikan
            resolve(result);
          }
        )
        // Mengirim buffer file ke Cloudinary
        .end(buffer);
    });

    // Validasi jika hasil upload tidak menghasilkan secure_url
    if (!uploadResult?.secure_url) {
      return NextResponse.json(
        { message: "Upload cover gagal" },
        { status: 500 }
      );
    }

    // Membuat data buku baru ke database
    const book = await Book.create({
      title,
      author,
      category,
      description,

      // Menyimpan URL cover dari hasil upload Cloudinary
      coverUrl: uploadResult.secure_url,

      // Menyimpan URL PDF jika ada, jika kosong maka disimpan string kosong
      pdfUrl: pdfUrl || "",
    });

    // Mengirim response data buku yang berhasil dibuat
    // status 201 menandakan data berhasil dibuat
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    // Menampilkan error di terminal/server jika gagal menambah buku
    console.error("POST BOOK ERROR:", error);

    // Mengirim response error jika proses menambah buku gagal
    return NextResponse.json(
      { message: "Gagal menambah buku" },
      { status: 500 }
    );
  }
}