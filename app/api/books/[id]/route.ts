import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import cloudinary from "@/lib/cloudinary";

// Menentukan agar route ini berjalan menggunakan runtime Node.js
// Dibutuhkan karena proses upload file menggunakan Buffer dan Cloudinary
export const runtime = "nodejs";

// Tipe untuk mengambil parameter id dari URL
type RouteParams = {
  params: Promise<{ id: string }>;
};

// Handler GET untuk mengambil detail buku berdasarkan id
export async function GET(req: Request, { params }: RouteParams) {
  try {
    // Menghubungkan aplikasi ke database MongoDB
    await connectDB();

    // Mengambil id buku dari parameter URL
    const { id } = await params;

    // Mencari data buku berdasarkan id
    const book = await Book.findById(id);

    // Jika buku tidak ditemukan, kirim response error 404
    if (!book) {
      return NextResponse.json(
        { message: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika buku ditemukan, kirim data buku sebagai response JSON
    return NextResponse.json(book);
  } catch (error) {
    // Menampilkan error di terminal/server
    console.error("GET BOOK DETAIL ERROR:", error);

    // Mengirim response error jika gagal mengambil detail buku
    return NextResponse.json(
      { message: "Gagal mengambil detail buku" },
      { status: 500 }
    );
  }
}

// Handler PUT untuk mengubah data buku berdasarkan id
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    // Menghubungkan aplikasi ke database MongoDB
    await connectDB();

    // Mengambil id buku dari parameter URL
    const { id } = await params;

    // Mengambil data dari form yang dikirim oleh frontend
    const formData = await req.formData();

    // Mengambil masing-masing input dari formData
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const pdfUrl = formData.get("pdfUrl") as string;

    // Mengambil file cover jika ada
    const file = formData.get("cover") as File | null;

    // Data yang akan diperbarui ke database
    const updateData: any = {
      title,
      author,
      category,
      description,
      pdfUrl,
    };

    // Jika user mengunggah file cover baru
    if (file && file.size > 0) {
      // Mengubah file menjadi arrayBuffer
      const bytes = await file.arrayBuffer();

      // Mengubah arrayBuffer menjadi Buffer agar bisa di-upload ke Cloudinary
      const buffer = Buffer.from(bytes);

      // Upload file cover ke Cloudinary
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

      // Menyimpan URL cover baru dari Cloudinary ke data update
      updateData.coverUrl = uploadResult.secure_url;
    }

    // Mengupdate data buku berdasarkan id
    // returnDocument: "after" artinya data yang dikembalikan adalah data setelah di-update
    const book = await Book.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    // Mengirim data buku yang sudah diperbarui sebagai response
    return NextResponse.json(book);
  } catch (error) {
    // Menampilkan error di terminal/server
    console.error("PUT BOOK ERROR:", error);

    // Mengirim response error jika gagal mengubah data buku
    return NextResponse.json(
      { message: "Gagal mengubah buku" },
      { status: 500 }
    );
  }
}

// Handler DELETE untuk menghapus buku berdasarkan id
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Menghubungkan aplikasi ke database MongoDB
    await connectDB();

    // Mengambil id buku dari parameter URL
    const { id } = await params;

    // Menghapus data buku berdasarkan id
    await Book.findByIdAndDelete(id);

    // Mengirim response jika buku berhasil dihapus
    return NextResponse.json({
      message: "Buku berhasil dihapus",
    });
  } catch (error) {
    // Menampilkan error di terminal/server
    console.error("DELETE BOOK ERROR:", error);

    // Mengirim response error jika gagal menghapus buku
    return NextResponse.json(
      { message: "Gagal menghapus buku" },
      { status: 500 }
    );
  }
}