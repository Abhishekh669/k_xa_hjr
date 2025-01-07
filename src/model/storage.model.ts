import mongoose, { mongo, Schema } from "mongoose";


const storageSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // URL to the stored file (e.g., AWS S3, local storage)
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
  }
);

export const Storage = mongoose.models.Storage||mongoose.model("Storage",storageSchema)
