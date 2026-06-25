import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export const runtime = "nodejs";

function makeSafeFileName(fileName: string) {
  const nameWithoutExt = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  return `${Date.now()}-${nameWithoutExt}.pdf`;
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFileName = makeSafeFileName(file.name);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "pdfs"
    );

    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, safeFileName);

    await writeFile(filePath, buffer);

    const pdfUrl = `/uploads/pdfs/${safeFileName}`;

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