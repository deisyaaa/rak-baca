// Import mongoose untuk membuat schema dan model MongoDB
import mongoose, { Schema, models } from "mongoose";

// Membuat schema untuk data buku
const BookSchema = new Schema(
  {
    // Field judul buku
    // required: true artinya field ini wajib diisi
    title: {
      type: String,
      required: true,
    },

    // Field nama penulis buku
    author: {
      type: String,
      required: true,
    },

    // Field kategori buku, misalnya Novel, Pendidikan, Fiksi, dan lainnya
    category: {
      type: String,
      required: true,
    },

    // Field deskripsi atau ringkasan singkat isi buku
    description: {
      type: String,
      required: true,
    },

    // Field URL cover buku
    // Biasanya berisi link gambar dari Cloudinary
    coverUrl: {
      type: String,
      required: true,
    },

    // Field URL file PDF buku
    // default: "" artinya jika tidak ada PDF, nilainya string kosong
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  {
    // timestamps otomatis menambahkan createdAt dan updatedAt
    timestamps: true,
  }
);

// Membuat model Book
// Jika model Book sudah ada, gunakan models.Book
// Jika belum ada, buat model baru dengan mongoose.model
const Book = models.Book || mongoose.model("Book", BookSchema);

// Export model Book agar bisa digunakan di API route
export default Book;