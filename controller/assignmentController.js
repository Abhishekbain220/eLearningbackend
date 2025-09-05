let Assignment = require("../model/assignmentSchema")
const CustomError = require("../utils/customError")
let Course = require("../model/courceSchema")

/**
 * Create a new assignment and link it to a course + user
 */
module.exports.createAssignment = async (req, res, next) => {
    try {
        let { courseId } = req.params
        let { title, description, dueDate, maxMarks, fileURL } = req.body

        // Create new assignment
        let newAssignment = await Assignment.create({
            title,
            description,
            dueDate,
            maxMarks,
            fileURL,
            course: courseId,       // link to course
            user: req.user._id      // link to logged-in user
        })

        if (!newAssignment) return next(new CustomError("Assignment not Created", 400))

        await newAssignment.save()

        // Find the course and add this assignment to it
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))
        course.assignment.push(newAssignment._id)
        await course.save()

        // Add this assignment to the logged-in user's assignments
        await req.user.assignment.push(newAssignment._id)
        await req.user.save()

        res.status(200).json({
            message: "Assignment Created Successfully",
            course,
            newAssignment
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

/**
 * Delete an assignment and unlink it from course + user
 */
module.exports.deleteAssignment = async (req, res, next) => {
    try {
        let { assignmentId } = req.params

        // Delete assignment by ID
        let deleteAssignment = await Assignment.findByIdAndDelete(assignmentId)
        if (!deleteAssignment) return next(new CustomError("Assignment not Found", 400))

        // Find related course and remove the assignment reference
        let course = await Course.findById(deleteAssignment.course)
        if (!course) return next(new CustomError("Course not found", 400))
        course.assignment = course.assignment.filter(
            (item) => item.toString() !== assignmentId.toString()
        )
        await course.save()

        // Remove assignment from user's assignments
        req.user.assignment = req.user.assignment.filter(
            (item) => item.toString() !== assignmentId.toString()
        )
        await req.user.save()

        res.status(200).json({
            message: "Assignment Deleted Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

/**
 * Update an existing assignment
 */
module.exports.updateAssignment = async (req, res, next) => {
    try {
        let { assignmentId } = req.params
        let { title, description, dueDate, maxMarks, fileURL } = req.body

        // Find assignment by ID
        let updateAssignment = await Assignment.findById(assignmentId)
        if (!updateAssignment) return next(new CustomError("Assignment not Found", 400))

        // Update fields if provided
        if (title) updateAssignment.title = title
        if (description) updateAssignment.description = description
        if (dueDate) updateAssignment.dueDate = dueDate
        if (maxMarks) updateAssignment.maxMarks = maxMarks
        if (fileURL) updateAssignment.fileURL = fileURL

        await updateAssignment.save()

        res.status(200).json({
            message: "Assignment Updated Successfully",
            updateAssignment
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message))
    }
}

/**
 * Get all assignments for a specific course
 */
module.exports.getAllAssignment = async (req, res, next) => {
    try {
        let { courseId } = req.params

        // Find all assignments linked to this course
        let allAssignment = await Assignment.find({ course: courseId })
        if (!allAssignment) return next(new CustomError("No Assignment Found", 400))

        res.status(200).json({
            message: "All Assignment Fetched Successfully",
            allAssignment
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}
