let VideoLecture = require("../model/videoLectureSchema")
let Course = require("../model/courceSchema") 
let User = require("../model/userSchema")
const CustomError = require("../utils/customError")

/**
 * Generate a course completion certificate
 * Condition: user must have watched all lectures in the course
 */
module.exports.generateCertificate = async (req, res, next) => {
    try {
        let { courseId } = req.params

        // Find course and populate its lectures
        let course = await Course.findById(courseId).populate("lectures")
        if (!course) return next(new CustomError("No Course Found", 404))

        // ✅ Check if the user has watched every lecture in the course
        for (let lecture of course.lectures) {
            const watched = lecture.studentsWatched.some(
                id => id.toString() === req.user._id.toString()
            )
            if (!watched) {
                // If user hasn't watched even one lecture -> no certificate
                return next(
                    new CustomError("You have not completed the course yet", 400)
                )
            }
        }

        // If all lectures are watched, allow certificate generation
        res.status(200).json({
            success: true,
            message: "Certificate Generated Successfully",
            course,
            user:req.user
        })

    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}
