let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createStudyMaterial, deleteStudyMaterial, updateStudyMaterial } = require("../controller/studyMaterialController")
let router=express.Router()

router.post("/createStudyMaterial/:courseId",authenticateUser,createStudyMaterial)

router.delete("/deleteStudyMaterial/:studyMaterialId",authenticateUser,deleteStudyMaterial)
router.put("/updateStudyMaterial/:studyMaterialId",authenticateUser,updateStudyMaterial)

module.exports=router