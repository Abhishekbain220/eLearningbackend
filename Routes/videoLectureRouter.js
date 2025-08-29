let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createLecture, deleteLecture, updateLecture } = require("../controller/videoLectureController")
let router=express.Router()

router.post("/createLecture/:courseId",authenticateUser,createLecture)
router.delete("/deleteLecture/:lectureId",authenticateUser,deleteLecture)
router.put("/updateLecture/:lectureId",authenticateUser,updateLecture)

module.exports=router