let VideoLecture = require("../model/videoLectureSchema")
let Course = require("../model/courceSchema") 
let User = require("../model/userSchema")
const CustomError = require("../utils/customError")

module.exports.generateCertificate = async (req, res, next) => {
    try {
        let { courseId } = req.params
        let course = await Course.findById(courseId).populate("lectures")
        if (!course) return next(new CustomError("No Course Found", 404))

        // ✅ check if user watched every lecture
        for (let lecture of course.lectures) {
            const watched = lecture.studentsWatched.some(
                id => id.toString() === req.user._id.toString()
            )
            if (!watched) {
                return next(new CustomError("You have not completed the course yet", 400))
            }
        }

        res.status(200).json({
            success: true,
            message: "Certificate Generated Successfully",
            course
        })

    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}
