import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Menentukan agar route ini berjalan menggunakan runtime Node.js
// Dibutuhkan karena proses autentikasi menggunakan bcrypt dan koneksi database
export const runtime = "nodejs";

// Membuat handler NextAuth untuk proses login dan autentikasi
const handler = NextAuth({
  // Menentukan provider login yang digunakan
  providers: [
    // CredentialsProvider digunakan untuk login manual menggunakan email dan password
    CredentialsProvider({
      name: "Credentials",

      // Menentukan field input yang dibutuhkan saat login
      credentials: {
        // Field email pada form login
        email: {
          label: "Email",
          type: "email",
        },

        // Field password pada form login
        password: {
          label: "Password",
          type: "password",
        },
      },

      // Fungsi authorize digunakan untuk memvalidasi email dan password user
      async authorize(credentials) {
        // Validasi jika email atau password tidak dikirim
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Menghubungkan aplikasi ke database MongoDB
        await connectDB();

        // Mencari user berdasarkan email yang dimasukkan
        const user = await User.findOne({
          email: credentials.email,
        });

        // Jika user tidak ditemukan, proses login gagal
        if (!user) {
          return null;
        }

        // Membandingkan password yang dimasukkan dengan password hash di database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Jika password tidak sesuai, proses login gagal
        if (!isPasswordValid) {
          return null;
        }

        // Jika login berhasil, kembalikan data user yang akan disimpan ke session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Mengatur strategi session menggunakan JWT
  session: {
    strategy: "jwt",
  },

  // Mengatur halaman login custom
  pages: {
    signIn: "/login",
  },

  // Secret key untuk keamanan NextAuth
  secret: process.env.NEXTAUTH_SECRET,
});

// Mengekspor handler untuk method GET dan POST
// NextAuth membutuhkan keduanya agar proses autentikasi berjalan
export { handler as GET, handler as POST };