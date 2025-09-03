let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createAssignment, deleteAssignment, updateAssignment, getAllAssignment } = require("../controller/assignmentController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router=express.Router()

router.post("/createAssignment/:courseId",authenticateUser,authenticateInstructor,createAssignment)
router.delete("/deleteAssignment/:assignmentId",authenticateUser,authenticateInstructor,deleteAssignment)
router.put("/updateAssignment/:assignmentId",authenticateUser,authenticateInstructor,updateAssignment)
router.get("/getAllAssignment/:courseId",authenticateUser,getAllAssignment)

module.exports=router