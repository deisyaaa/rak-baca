import mongoose, { Schema, models } from "mongoose";

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    coverUrl: {
      type: String,
      required: true,
    },

    pdfUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Book = models.Book || mongoose.model("Book", BookSchema);

export default Book;