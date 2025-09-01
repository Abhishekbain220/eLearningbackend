let VideoLecture = require("../model/videoLectureSchema")
const CustomError = require("../utils/customError")
let Course = require("../model/courceSchema")


module.exports.createLecture = async (req, res, next) => {
    try {
        let { courseId } = req.params
        let { title, description, videoUrl, duration } = req.body
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))
        let videoLecture = await VideoLecture.create({
            title, description, videoUrl, duration,
            course: course._id,
            instructor: req.user._id

        })

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

module.exports.deleteLecture = async (req, res, next) => {
    try {
        let { lectureId } = req.params
        let deleteLecture = await VideoLecture.findByIdAndDelete(lectureId)
        if (!deleteLecture) return next(new CustomError("Video Lecture not found", 400))
        let courseId = deleteLecture.course
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))
        course.lectures = course.lectures.filter(item => item.toString() !== deleteLecture._id.toString());
        await course.save()
        req.user.videoLecture=req.user.videoLecture.filter((item)=> item.toString() !== lectureId.toString())
        await req.user.save()

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

module.exports.updateLecture=async(req,res,next)=>{
    try {
        let {lectureId}=req.params
        let { title, description, videoUrl, duration } = req.body
        let videoLecture=await VideoLecture.findById(lectureId)
        if(!videoLecture)return next(new CustomError("Video Lecture not Found"))
            if(title)videoLecture.title=title
            if(description)videoLecture.description=description
            if(videoUrl)videoLecture.videoUrl=videoUrl
            if(duration)videoLecture.duration=duration
            await videoLecture.save()

            // check 
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


