let express=require("express")
const { createCourse, deleteCourse, updateCourse, getAllCourse, getMyCourses } = require("../controller/courseController")
const { authenticateUser } = require("../middleware/authMiddleware")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router=express.Router()

router.get("/viewCourse",authenticateUser,getAllCourse)
router.get("/myCourses",authenticateInstructor,getMyCourses)
router.post("/createCourse",authenticateInstructor,createCourse)
router.delete("/deleteCourse/:id",authenticateInstructor,deleteCourse)
router.put("/updateCourse/:id",authenticateInstructor,updateCourse)

module.exports=router