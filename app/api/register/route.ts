import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Handler POST untuk proses register user baru
export async function POST(req: Request) {
  try {
    // Menghubungkan aplikasi ke database MongoDB
    await connectDB();

    // Mengambil data name, email, dan password dari body request
    const { name, email, password } = await req.json();

    // Validasi jika nama, email, atau password belum diisi
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Mengecek apakah email sudah terdaftar di database
    const existingUser = await User.findOne({ email });

    // Jika email sudah ada, kirim response bahwa email sudah terdaftar
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Melakukan hashing password agar password tidak disimpan dalam bentuk asli
    // Angka 10 adalah salt round untuk tingkat keamanan hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat data user baru ke database dengan password yang sudah di-hash
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Mengirim response jika proses register berhasil
    return NextResponse.json(
      { message: "Register berhasil" },
      { status: 201 }
    );
  } catch (error) {
    // Menampilkan error di terminal/server jika proses register gagal
    console.error("REGISTER ERROR:", error);

    // Mengirim response error jika terjadi kesalahan pada server
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat register" },
      { status: 500 }
    );
  }
}