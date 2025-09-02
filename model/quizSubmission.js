const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz",   // reference to Quiz schema
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",   // reference to User schema
      required: true,
    },
    marks: {
      type: Number, // store marks in percentage
      min: 0,
      max: 100,
      required: true,
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("quizSubmission", quizSubmissionSchema);
