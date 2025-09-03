let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createLecture, deleteLecture, updateLecture, getAllLectures } = require("../controller/videoLectureController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router=express.Router()

router.post("/createLecture/:courseId",authenticateUser,authenticateInstructor,createLecture)
router.delete("/deleteLecture/:lectureId",authenticateUser,authenticateInstructor,deleteLecture)
router.put("/updateLecture/:lectureId",authenticateUser,authenticateInstructor,updateLecture)
router.get("/getAllLectures/:courseId",authenticateUser,getAllLectures)

module.exports=router