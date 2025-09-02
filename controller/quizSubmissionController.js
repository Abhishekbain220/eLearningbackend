let QuizSubmission = require("../model/quizSubmission")
const CustomError = require("../utils/customError")

module.exports.submitQuiz = async (req, res, next) => {
    try {
        let { quizId } = req.params
        let { marks } = req.body
        let oldSubmission = await QuizSubmission.findOne({ user: req.user._id })
        if (oldSubmission) {
            let deleteSubmission = await QuizSubmission.findByIdAndDelete(oldSubmission._id)
        }
        let newSubmission = await QuizSubmission.create({
            user: req.user._id,
            quiz: quizId,
            marks: marks
        })
        if (!newSubmission) return next(new CustomError("Unable to submit Quiz", 400))
        res.status(200).json({
            message: "Quiz Submitted Successfully",
            newSubmission
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.getQuizResult = async (req, res, next) => {
    try {
        let { quizId } = req.params
        let result = await QuizSubmission.findOne({ quiz: quizId ,user:req.user._id})
        if (!result) return next(new CustomError("No Result Found", 404))
        res.status(200).json({
            message: "Quiz Result fetched Successfully",
            result
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.getAllQuizResult = async (req, res, next) => {
    try {
        let {quizId}=req.params
        let results=await QuizSubmission.find({quiz:quizId})
        if(!results) return next(new CustomError("No Results Found",404))
            res.status(200).json({
            message: "Quiz Results fetched Successfully",
            results
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}