const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Course description is required"],
  },

  category: {
    type: String,
    enum: ["Programming", "Design", "Marketing", "Business", "Science", "Other"],
    default: "Other",
  },

  price: {
    type: Number,
    required: [true, "Course price is required"],
    min: 0,
  },

 

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // linked to User model
    // required: [true, "Instructor is required"],
  },

  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // linked to User model
    },
  ],

  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videoLecture", // linked to videoLecture model
    },
  ],
  studyMaterial: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studyMaterial", // linked to videoLecture model
    },
  ],
  assignment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assignment", // linked to videoLecture model
    },
  ],
  quiz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz", // linked to videoLecture model
    },
  ],

  

  
},
{ timestamps: true }
);

module.exports = mongoose.model("course", courseSchema);
