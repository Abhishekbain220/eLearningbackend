let express=require("express")
const { submitAssignment, getAllSubmissions, getMySubmission, deleteSubmission } = require("../controller/assignmentSubmissionController")
const { authenticateUser } = require("../middleware/authMiddleware")
let router=express.Router()

router.post("/submitAssignment/:assignmentId",authenticateUser,submitAssignment)
router.get("/getAllSubmissions/:assignmentId",authenticateUser,getAllSubmissions)
router.get("/getMySubmission/:assignmentId",authenticateUser,getMySubmission)
router.delete("/deleteSubmission/:submissionId",authenticateUser,deleteSubmission)



module.exports=router