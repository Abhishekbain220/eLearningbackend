const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // reference to User schema
            required: true,
        },
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "assignment", // reference to Assignment schema
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("assignmentSubmission", assignmentSubmissionSchema);
