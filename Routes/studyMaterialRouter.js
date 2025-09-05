let express = require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createStudyMaterial, deleteStudyMaterial, updateStudyMaterial, getAllStudyMaterial } = require("../controller/studyMaterialController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router = express.Router()

router.post("/createStudyMaterial/:courseId", authenticateInstructor, createStudyMaterial)

router.delete("/deleteStudyMaterial/:studyMaterialId", authenticateInstructor, deleteStudyMaterial)
router.put("/updateStudyMaterial/:studyMaterialId", authenticateInstructor, updateStudyMaterial)
router.get("/getAllStudyMaterial/:courseId", authenticateUser, getAllStudyMaterial)

module.exports = router