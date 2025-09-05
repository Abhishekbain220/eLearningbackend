let mongoose = require("mongoose");

let videoLectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lecture title is required"],
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: [true, "Video URL is required"], // can be Cloudinary, S3, Vimeo, YouTube, etc.
  },
  duration: {
    type: Number, // in seconds or minutes
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
     // every lecture belongs to a course
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // if instructors are stored in Users collection
    
  },
  studentsWatched: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user" // users who have watched this lecture
  }]
  
},{timestamps:true});


module.exports = mongoose.model("videoLecture", videoLectureSchema);