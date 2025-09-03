let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createStudyMaterial, deleteStudyMaterial, updateStudyMaterial, getAllStudyMaterial } = require("../controller/studyMaterialController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router=express.Router()

router.post("/createStudyMaterial/:courseId",authenticateUser,authenticateInstructor,createStudyMaterial)

router.delete("/deleteStudyMaterial/:studyMaterialId",authenticateUser,authenticateInstructor,deleteStudyMaterial)
router.put("/updateStudyMaterial/:studyMaterialId",authenticateUser,authenticateInstructor,updateStudyMaterial)
router.get("/getAllStudyMaterial/:courseId",authenticateUser,getAllStudyMaterial)

module.exports=router