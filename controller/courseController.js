let Course = require("../model/courceSchema")
const CustomError = require("../utils/customError")
let User = require("../model/userSchema")

/**
 * Create a new course and link it to the instructor (logged-in user)
 */
module.exports.createCourse = async (req, res, next) => {
    try {
        let { title, description, category, price } = req.body

        // Create new course
        let newCourse = await Course.create({
            title,
            description,
            category,
            price,
            instructor: req.user._id   // logged-in user becomes instructor
        })

        await newCourse.save()

        // Add this course to the instructor's course list
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

/**
 * Delete a course and unlink it from the instructor's profile
 */
module.exports.deleteCourse = async (req, res, next) => {
    try {
        let { id } = req.params

        // Find and delete course
        let deleteCourse = await Course.findByIdAndDelete(id)
        if (!deleteCourse) return next(new CustomError("Course not Found", 400))

        // Remove course reference from instructor's user record
        req.user.course = req.user.course.filter(
            (item) => item.toString() !== id.toString()
        )
        await req.user.save()

        res.status(200).json({
            message: "Course deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

/**
 * Update course details (title, description, category, price)
 */
module.exports.updateCourse = async (req, res, next) => {
    try {
        let { id } = req.params
        let { title, description, category, price } = req.body

        // Find course by ID
        let updateCourse = await Course.findById(id)
        if (!updateCourse) return next(new CustomError("Course not Found", 400))

        // Update fields if provided
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

/**
 * Get all courses (for students, admins, or instructors)
 */
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

/**
 * Get all courses created by the logged-in instructor
 */
module.exports.getMyCourses = async (req, res, next) => {
    try {
        let myCourses = await Course.find({ instructor: req.user._id })
        if (!myCourses) return next(new CustomError("No Course Found", 400))

        res.status(200).json({
            message: "My Courses Fetched Successfully",
            myCourses
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}
