let Course = require("../model/courceSchema")
const CustomError = require("../utils/customError")
let User = require("../model/userSchema")


module.exports.createCourse = async (req, res, next) => {
    try {
        let { title, description, category, price, instructor } = req.body

        let newCourse = await Course.create({
            title, description, category, price,
            instructor: req.user._id


        })
        await newCourse.save()
        await req.user.course.push(newCourse._id)

        await req.user.save()
        res.status(200).json({
            message: "Course Created Successfully",
            newCourse
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.deleteCourse = async (req, res, next) => {
    try {
        let { id } = req.params
        let deleteCourse = await Course.findByIdAndDelete(id)
        if (!deleteCourse) return next(new CustomError("Course not Found", 400))
        req.user.course = req.user.course.filter((item) => item.toString() !== id.toString())
        await req.user.save()
        res.status(200).json({
            message: "Course deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.updateCourse = async (req, res, next) => {
    try {
        let { id } = req.params
        let { title, description, category, price } = req.body
        let updateCourse = await Course.findById(id)
        if (!updateCourse) return next(new CustomError("Course not Found", 400))
        if (title) updateCourse.title = title
        if (description) updateCourse.description = description
        if (category) updateCourse.category = category
        if (price) updateCourse.price = price
        await updateCourse.save()
        res.status(200).json({
            message: "Course Updated Successfully",
            updateCourse
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.getAllCourse = async (req, res, next) => {
    try {
        let allCourse = await Course.find()
        if (!allCourse) return next(new CustomError("No Course Found", 400))
        res.status(200).json({
            message: "All Course Fetched Successfully",
            allCourse
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.getMyCourses = async (req, res, next) => {
    try {
        let myCourses=await Course.find({instructor:req.user._id})
        if(!myCourses) return next(new CustomError("No Course Found",400))
            res.status(200).json({
                message:"My Courses Fetched Successfully",
                myCourses
            })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}