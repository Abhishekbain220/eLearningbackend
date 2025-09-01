const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Material title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course", // Reference to Course model
    },
    
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Instructor or admin
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"], // Store in AWS S3, Cloudinary, or local
    },
    fileType: {
      type: String,
      enum: ["pdf", "ppt", "docx", "image", "link", "other"],
      required: true,
    },
    size: {
      type: Number, // in KB or MB
    },
    tags: [
      {
        type: String,
      },
    ],
    isDownloadable: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "course-only"],
      default: "course-only",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("studyMaterial", studyMaterialSchema);
