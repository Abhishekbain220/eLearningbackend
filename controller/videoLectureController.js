let VideoLecture = require("../model/videoLectureSchema")
const CustomError = require("../utils/customError")
let Course = require("../model/courceSchema")

// 📌 Create a new video lecture for a course
module.exports.createLecture = async (req, res, next) => {
    try {
        let { courseId } = req.params
        let { title, description, videoUrl, duration } = req.body

        // 🔎 Check if the course exists
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))

        // ✅ Create video lecture linked with course & instructor
        let videoLecture = await VideoLecture.create({
            title, description, videoUrl, duration,
            course: course._id,
            instructor: req.user._id
        })

        // 📌 Push reference to course and user
        await course.lectures.push(videoLecture._id)
        await videoLecture.save()
        await course.save()
        await req.user.videoLecture.push(videoLecture._id)
        await req.user.save()

        res.status(200).json({
            message: "Video Lecture Created Successfully",
            course
        })

    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

// 📌 Delete a video lecture by ID
module.exports.deleteLecture = async (req, res, next) => {
    try {
        let { lectureId } = req.params

        // 🔎 Delete from DB
        let deleteLecture = await VideoLecture.findByIdAndDelete(lectureId)
        if (!deleteLecture) return next(new CustomError("Video Lecture not found", 400))

        // 📌 Remove reference from course
        let courseId = deleteLecture.course
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))

        course.lectures = course.lectures.filter(item => item.toString() !== deleteLecture._id.toString());
        await course.save()

        // 📌 Remove reference from user
        req.user.videoLecture=req.user.videoLecture.filter((item)=> item.toString() !== lectureId.toString())
        await req.user.save()

        // ⚠️ Debug: returning all lectures (not only deleted one)
        let videoLectures = await VideoLecture.find()
        res.status(200).json({
            message: "Video Lecture Deleted Successfully",
            videoLectures,
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

// 📌 Update an existing video lecture
module.exports.updateLecture=async(req,res,next)=>{
    try {
        let {lectureId}=req.params
        let { title, description, videoUrl, duration } = req.body

        // 🔎 Find lecture
        let videoLecture=await VideoLecture.findById(lectureId)
        if(!videoLecture)return next(new CustomError("Video Lecture not Found"))

        // ✅ Update only provided fields
        if(title)videoLecture.title=title
        if(description)videoLecture.description=description
        if(videoUrl)videoLecture.videoUrl=videoUrl
        if(duration)videoLecture.duration=duration

        await videoLecture.save()

        // ⚠️ Debug: returning all video lectures instead of only updated one
        let videoLectures=await VideoLecture.find()
        res.status(200).json({
            message:"Video Lecture Updated Successfully",
            videoLectures
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

// 📌 Get all lectures for a specific course
module.exports.getAllLectures=async(req,res,next)=>{
    try {
        let {courseId}=req.params

        // 🔎 Fetch lectures by course
        let allLectures=await VideoLecture.find({course:courseId})

        // ⚠️ `find()` always returns array → check `.length === 0` instead
        if(!allLectures)return next(new CustomError("No Lecture Found",400))

        res.status(200).json({
            message:"All Lectures Fetched Successfully",
            allLectures
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

// 📌 Mark a lecture as "watched" by the current user
module.exports.watchLecture=async(req,res,next)=>{
    try {
        let {lectureId}=req.params

        // 🔎 Find lecture
        let lecture=await VideoLecture.findById(lectureId)
        if(!lecture)return next(new CustomError("Lecture not Found",400))

        // ✅ Push user ID into studentsWatched array
        lecture.studentsWatched.push(req.user._id)
        await lecture.save()

        res.status(200).json({
            message:"Lecture Watched Successfully",
            lecture
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}
