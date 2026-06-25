import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

function uploadPdf(buffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const safeName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: `rak-baca/pdfs/${Date.now()}-${safeName}.pdf`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("URL PDF tidak ditemukan"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File PDF wajib diupload" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "File harus berformat PDF" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfUrl = await uploadPdf(buffer, file.name);

    return NextResponse.json(
      {
        message: "Upload PDF berhasil",
        pdfUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("UPLOAD PDF ERROR:", error);

    return NextResponse.json(
      { message: "Gagal upload PDF" },
      { status: 500 }
    );
  }
}