let QuizSubmission = require("../model/quizSubmission")
const CustomError = require("../utils/customError")

// 📌 Submit a Quiz (student side)
module.exports.submitQuiz = async (req, res, next) => {
    try {
        let { quizId } = req.params   // Quiz ID from route params
        let { marks } = req.body      // Marks submitted in request body

        // 🔎 Check if user already has a submission (⚠️ currently only checks by user, not by quiz)
        let oldSubmission = await QuizSubmission.findOne({ user: req.user._id })
        
        if (oldSubmission) {
            // ⛔ Delete old submission before creating a new one
            // (⚠️ this will remove all submissions of user, even for other quizzes)
            let deleteSubmission = await QuizSubmission.findByIdAndDelete(oldSubmission._id)
        }

        // ✅ Create new submission
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

// 📌 Get a single quiz result for the logged-in user
module.exports.getQuizResult = async (req, res, next) => {
    try {
        let { quizId } = req.params

        // 🔎 Find the result for the specific quiz and current user
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

// 📌 Get all results of a quiz (likely for instructor/admin)
module.exports.getAllQuizResult = async (req, res, next) => {
    try {
        let {quizId}=req.params

        // 🔎 Find all submissions for a particular quiz
        let results=await QuizSubmission.find({quiz:quizId})

        // ⚠️ `find()` always returns an array (even if empty),
        // so this check will never fail unless you also check `results.length === 0`
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
