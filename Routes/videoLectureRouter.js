let express = require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createLecture, deleteLecture, updateLecture, getAllLectures, watchLecture } = require("../controller/videoLectureController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
const { authenticateStudent } = require("../middleware/studentMiddleware")
let router = express.Router()

router.post("/createLecture/:courseId", authenticateInstructor, createLecture)
router.delete("/deleteLecture/:lectureId", authenticateInstructor, deleteLecture)
router.put("/updateLecture/:lectureId", authenticateInstructor, updateLecture)
router.get("/getAllLectures/:courseId", authenticateUser, getAllLectures)
router.post("/watchLecture/:lectureId", authenticateStudent, watchLecture)

module.exports = router