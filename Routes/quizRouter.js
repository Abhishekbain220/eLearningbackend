let express=require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createQuiz, deleteQuiz, updateQuiz } = require("../controller/quizController")
let router=express.Router()

router.post("/createQuiz/:courseId",authenticateUser,createQuiz)
router.delete("/deleteQuiz/:quizId",authenticateUser,deleteQuiz)
router.put("/updateQuiz/:quizId",authenticateUser,updateQuiz)

module.exports=router