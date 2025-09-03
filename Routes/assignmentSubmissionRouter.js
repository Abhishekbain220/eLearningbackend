let express=require("express")
const { submitAssignment, getAllSubmissions, getMySubmission, deleteSubmission } = require("../controller/assignmentSubmissionController")
const { authenticateUser } = require("../middleware/authMiddleware")
const { authenticateStudent } = require("../middleware/studentMiddleware")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router=express.Router()

router.post("/submitAssignment/:assignmentId",authenticateUser,authenticateStudent,submitAssignment)
router.get("/getAllSubmissions/:assignmentId",authenticateUser,authenticateInstructor,getAllSubmissions)
router.get("/getMySubmission/:assignmentId",authenticateUser,authenticateStudent,getMySubmission)
router.delete("/deleteSubmission/:submissionId",authenticateUser,authenticateStudent,deleteSubmission)



module.exports=router