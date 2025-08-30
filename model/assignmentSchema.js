const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // assuming User schema stores both students & instructors
        },
        title: {
            type: String,
            required: [true, "Assignment title is required"],
        },
        description: {
            type: String,
        },
        dueDate: {
            type: String,
            required: true,
        },
        maxMarks: {
            type: Number,
            default: 100,
        },
        fileURL: {
            type: String, // uploaded file link (Google Drive, S3, etc.)
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("assignment", assignmentSchema);
