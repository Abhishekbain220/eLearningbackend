const CustomError = require("../utils/customError")
let User = require("../model/userSchema")
const Course = require("../model/courceSchema")
let Assignment = require("../model/assignmentSchema")
let Quiz = require("../model/quizSchema")
let StudyMaterial = require("../model/studyMaterialSchema")
let VideoLecture = require("../model/videoLectureSchema")   
let AssignmentSubmisson=require("../model/assignmentSubmissionSchema")
let QuizSubmission=require("../model/quizSubmission")

module.exports.getAllUsers = async (req, res, next) => {
    try {
        let users = await User.find()
        if (!users) return next(new CustomError("No Users Found", 404))
        res.status(200).json({
            message: "Users fetched Successfully",
            users
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        let { userId } = req.params
        let user = await User.findByIdAndDelete(userId)
        if (!user) return next(new CustomError("No User Found", 404))
        if (user.course && user.course.length >= 0) {
            user.course.forEach(async (item) => {
                let course = await Course.findByIdAndDelete(item)
            })
        }
        if (user.assignment && user.assignment.length >= 0) {
            user.assignment.forEach(async (item) => {
                let assignment = await Assignment.findByIdAndDelete(item)
                let assignmentSubmission=await AssignmentSubmisson.deleteMany({assignment:item})
            })
        }
        if (user.quiz && user.quiz.length >= 0) {
            user.quiz.forEach(async (item) => {
                let quiz = await Quiz.findByIdAndDelete(item)
                let quizSubmission=await QuizSubmission.deleteMany({quiz:item})
            })
        }
        if (user.studyMaterial && user.studyMaterial.length >= 0) {
            user.studyMaterial.forEach(async (item) => {
                let studyMaterial = await StudyMaterial.findByIdAndDelete(item)
            })
        }
        if (user.videoLecture && user.videoLecture.length >= 0) {
            user.videoLecture.forEach(async (item) => {
                let videoLecture = await VideoLecture.findByIdAndDelete(item)
            })
        }
        res.status(200).json({
            message: "User Deleted Successfully",
            user
        })  

    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}