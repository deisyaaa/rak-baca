import mongoose, { Schema, models } from "mongoose";

// Membuat schema untuk koleksi User di MongoDB
const UserSchema = new Schema(
  {
    // Nama pengguna
    name: {
      type: String,
      required: true,
    },

    // Email pengguna
    // unique: true artinya email tidak boleh sama dengan user lain
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Password pengguna
    // Biasanya password ini disimpan dalam bentuk yang sudah di-hash
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Mengecek apakah model User sudah ada.
// Jika sudah ada, gunakan model yang lama agar tidak error saat hot reload di Next.js.
// Jika belum ada, buat model User baru berdasarkan UserSchema.
const User = models.User || mongoose.model("User", UserSchema);

// Mengekspor model User agar bisa digunakan di file lain
export default User;