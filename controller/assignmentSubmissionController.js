let AssignmentSubmission = require("../model/assignmentSubmissionSchema")
const CustomError = require("../utils/customError")
let Assignment = require("../model/assignmentSchema")

/**
 * Submit or re-submit an assignment
 */
module.exports.submitAssignment = async (req, res, next) => {
    try {
        let { assignmentId } = req.params
        let { fileUrl } = req.body

        // Check if user already submitted an assignment before
        let oldSubmission = await AssignmentSubmission.findOne({ user: req.user._id })
        if (oldSubmission) {
            // Delete old submission if found
            let deleteSubmission = await AssignmentSubmission.findByIdAndDelete(oldSubmission._id)
            if (!deleteSubmission) return next(new CustomError("No Old Submission Found", 404))

            // Remove old submission reference from assignment
            let assignment = await Assignment.findById(deleteSubmission.assignment)
            if (!assignment) return next(new CustomError("Assignment not Found", 404))
            assignment.submission = assignment.submission.filter(
                item => item.toString() !== oldSubmission._id.toString()
            )
            await assignment.save()
        }

        // Create new submission
        let newSubmission = await AssignmentSubmission.create({
            user: req.user._id,
            assignment: assignmentId,
            fileUrl: fileUrl
        })
        if (!newSubmission) return next(new CustomError("Unable to submit Assignment", 400))

        // Link submission with assignment
        let assignment = await Assignment.findById(assignmentId)
        if (!assignment) return next(new CustomError("Assignment not Found", 404))
        assignment.submission.push(newSubmission._id)
        await assignment.save()

        res.status(200).json({
            message: "Assignment Submitted Successfully",
            assignment
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}

/**
 * Get all submissions for an assignment (for instructor)
 * OR get only the logged-in student's submission
 */
module.exports.getAllSubmissions = async (req, res, next) => {
    try {
        let { assignmentId } = req.params

        if (req.user.role == "instructor") {
            // Instructor gets all submissions with user details
            let submissions = await Assignment.findById(assignmentId).populate({
                path: "submission",
                populate: [{ path: "user" }]
            })
            if (!submissions) return next(new CustomError("No Submissions Found", 404))

            res.status(200).json({
                message: "All Submissions fetched Successfully",
                submissions
            })
        } else if (req.user.role == "student") {
            // Student gets only their own submission
            let mySubmission = await AssignmentSubmission.findOne({ user: req.user._id }).populate({
                path: "user",
            })
            if (!mySubmission) return next(new CustomError("No Submission Found", 404))

            res.status(200).json({
                message: "My Submission fetched Successfully",
                mySubmission
            })
        }
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}

/**
 * Delete a submission and unlink it from assignment
 */
module.exports.deleteSubmission = async (req, res, next) => {
    try {
        let { submissionId } = req.params

        // Delete submission
        let deleteSubmission = await AssignmentSubmission.findByIdAndDelete(submissionId)
        if (!deleteSubmission) return next(new CustomError("No Submission Found", 404))

        // Remove reference from assignment
        let assignment = await Assignment.findById(deleteSubmission.assignment)
        if (!assignment) return next(new CustomError("Assignment not Found", 404))
        assignment.submission = assignment.submission.filter(
            item => item.toString() !== submissionId
        )
        await assignment.save()

        res.status(200).json({
            message: "Submission Deleted Successfully",
            assignment
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}

/**
 * Get logged-in student's submission for a specific assignment
 */
module.exports.getMySubmission = async (req, res, next) => {
    try {
        let { assignmentId } = req.params

        // Find user's submission for this assignment
        let mySubmission = await AssignmentSubmission.findOne({
            user: req.user._id,
            assignment: assignmentId
        })
        if (!mySubmission) return next(new CustomError("No Submission Found", 404))

        res.status(200).json({
            message: "My Submission fetched Successfully",
            mySubmission
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}
