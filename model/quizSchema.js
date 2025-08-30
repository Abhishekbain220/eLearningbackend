const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // assuming user schema stores instructors
        },
        title: {
            type: String,
            required: [true, "Quiz title is required"],
        },
        description: {
            type: String,
        },
        questions: [
            {
                Question: String,
                OptionA: String,
                OptionB: String,
                OptionC: String,
                OptionD: String,
                CorrectAnswer: String,
            },
        ],
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("quiz", quizSchema);
