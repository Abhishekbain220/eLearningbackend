let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createAssignment, deleteAssignment, updateAssignment, getAllAssignment } = require("../controller/assignmentController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router=express.Router()

router.post("/createAssignment/:courseId",authenticateInstructor,createAssignment)
router.delete("/deleteAssignment/:assignmentId",authenticateInstructor,deleteAssignment)
router.put("/updateAssignment/:assignmentId",authenticateInstructor,updateAssignment)
router.get("/getAllAssignment/:courseId",authenticateUser,getAllAssignment)

module.exports=router