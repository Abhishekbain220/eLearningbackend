let express=require("express")
const { createCourse, deleteCourse, updateCourse } = require("../controller/courseController")
const { authenticateUser } = require("../middleware/authMiddleware")
let router=express.Router()

router.post("/createCourse",authenticateUser,createCourse)
router.delete("/deleteCourse/:id",authenticateUser,deleteCourse)
router.put("/updateCourse/:id",authenticateUser,updateCourse)

module.exports=router