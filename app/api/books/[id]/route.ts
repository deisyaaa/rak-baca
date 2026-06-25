import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        { message: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("GET BOOK DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail buku" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const pdfUrl = formData.get("pdfUrl") as string;
    const file = formData.get("cover") as File | null;

    const updateData: any = {
      title,
      author,
      category,
      description,
      pdfUrl,
    };

    if (file && file.size > 0) {
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

      updateData.coverUrl = uploadResult.secure_url;
    }

    const book = await Book.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("PUT BOOK ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengubah buku" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    await Book.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Buku berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus buku" },
      { status: 500 }
    );
  }
}