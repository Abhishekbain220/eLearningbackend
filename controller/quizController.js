let Quiz=require("../model/quizSchema")
const CustomError = require("../utils/customError")
let Course=require("../model/courceSchema")



module.exports.createQuiz=async(req,res,next)=>{
    try {
        let {courseId}=req.params
        let {title,description,questions}=req.body
        let newQuiz=await Quiz.create({
            title,
            description,
            questions:questions,
            course:courseId
        })
        if(!newQuiz)return next(new CustomError("Quiz not Created",400))
            await newQuiz.save()
        let course=await Course.findById(courseId)
        if(!course)return next(new CustomError("Course not Found",400))
            course.quiz.push(newQuiz._id)
        await course.save()
        res.status(200).json({
            message:"Quiz Created Successfully",
            course,
            newQuiz
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
},
module.exports.deleteQuiz=async(req,res,next)=>{
    try {
        let {quizId}=req.params
        let deleteQuiz=await Quiz.findByIdAndDelete(quizId)
        if(!deleteQuiz)return next(new CustomError("Quiz not Found",400))
            let course=await Course.findById(deleteQuiz.course)
        if(!course)return next(new CustomError("Course not Found",400))
            course.quiz=course.quiz.filter((item)=>item.toString() !== quizId.toString())
        await course.save()
        res.status(200).json({
            message:"Quiz Deleted Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message))
    }
}

module.exports.updateQuiz=async(req,res,next)=>{
    try {
        let {quizId}=req.params
        let {title,description,questions}=req.body
        let updateQuiz=await Quiz.findById(quizId)
        if(!updateQuiz)return next(new CustomError("Quiz not Found",400))
        if(title)updateQuiz.title=title
        if(description)updateQuiz.description=description
        if(questions)updateQuiz.questions=questions
        await updateQuiz.save()
        res.status(200).json({
            message:"Quiz Updated Successfully",
            updateQuiz
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}