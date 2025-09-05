let Quiz = require("../model/quizSchema")
const CustomError = require("../utils/customError")
let Course = require("../model/courceSchema")

/**
 * 📌 Create a new Quiz
 * - Creates quiz and links it with course + instructor(user)
 */
module.exports.createQuiz = async (req, res, next) => {
    try {
        let { courseId } = req.params
        let { title, description, questions } = req.body

        // Create new quiz
        let newQuiz = await Quiz.create({
            title,
            description,
            questions,
            course: courseId,
            instructor: req.user._id
        })

        if (!newQuiz) return next(new CustomError("Quiz not Created", 400))
        await newQuiz.save()

        // Link quiz with course
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))
        course.quiz.push(newQuiz._id)
        await course.save()

        // Link quiz with instructor(user)
        req.user.quiz.push(newQuiz._id)
        await req.user.save()

        res.status(200).json({
            message: "Quiz Created Successfully",
            course,
            newQuiz
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

/**
 * 📌 Delete a Quiz
 * - Removes quiz from DB
 * - Also removes reference from course + user
 */
module.exports.deleteQuiz = async (req, res, next) => {
    try {
        let { quizId } = req.params

        // Delete quiz
        let deleteQuiz = await Quiz.findByIdAndDelete(quizId)
        if (!deleteQuiz) return next(new CustomError("Quiz not Found", 400))

        // Remove reference from course
        let course = await Course.findById(deleteQuiz.course)
        if (!course) return next(new CustomError("Course not Found", 400))
        course.quiz = course.quiz.filter((item) => item.toString() !== quizId.toString())
        await course.save()

        // Remove reference from instructor(user)
        req.user.quiz = req.user.quiz.filter((item) => item.toString() !== quizId.toString())
        await req.user.save()

        res.status(200).json({
            message: "Quiz Deleted Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message))
    }
}

/**
 * 📌 Update a Quiz
 * - Update quiz fields (title, description, questions)
 */
module.exports.updateQuiz = async (req, res, next) => {
    try {
        let { quizId } = req.params
        let { title, description, questions } = req.body

        let updateQuiz = await Quiz.findById(quizId)
        if (!updateQuiz) return next(new CustomError("Quiz not Found", 400))

        if (title) updateQuiz.title = title
        if (description) updateQuiz.description = description
        if (questions) updateQuiz.questions = questions

        await updateQuiz.save()

        res.status(200).json({
            message: "Quiz Updated Successfully",
            updateQuiz
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

/**
 * 📌 Get all quizzes of a course
 */
module.exports.getAllQuiz = async (req, res, next) => {
    try {
        let { courseId } = req.params

        let AllQuiz = await Quiz.find({ course: courseId })
        if (!AllQuiz || AllQuiz.length === 0) {
            return next(new CustomError("No Quiz Found", 400))
        }

        res.status(200).json({
            message: "All Quiz fetched Successfully",
            AllQuiz
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}
