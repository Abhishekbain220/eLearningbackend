let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createAssignment, deleteAssignment, updateAssignment } = require("../controller/assignmentController")
let router=express.Router()

router.post("/createAssignment/:courseId",authenticateUser,createAssignment)
router.delete("/deleteAssignment/:assignmentId",authenticateUser,deleteAssignment)
router.put("/updateAssignment/:assignmentId",authenticateUser,updateAssignment)

module.exports=router