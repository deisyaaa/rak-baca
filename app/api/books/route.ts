import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();

    const books = await Book.find().sort({ createdAt: -1 });

    return NextResponse.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const pdfUrl = formData.get("pdfUrl") as string;
    const file = formData.get("cover") as File | null;

    if (!title || !author || !category || !description || !file) {
      return NextResponse.json(
        { message: "Judul, penulis, kategori, deskripsi, dan cover wajib diisi" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "rak-baca/covers",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        )
        .end(buffer);
    });

    if (!uploadResult?.secure_url) {
      return NextResponse.json(
        { message: "Upload cover gagal" },
        { status: 500 }
      );
    }

    const book = await Book.create({
      title,
      author,
      category,
      description,
      coverUrl: uploadResult.secure_url,
      pdfUrl: pdfUrl || "",
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("POST BOOK ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menambah buku" },
      { status: 500 }
    );
  }
}