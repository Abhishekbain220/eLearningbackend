let express=require("express")
const { submitQuiz, getQuizResult, getAllQuizResult } = require("../controller/quizSubmissionController")
const { authenticateUser } = require("../middleware/authMiddleware")
let router=express.Router()

router.post("/submitQuiz/:quizId",authenticateUser,submitQuiz)
router.get("/getQuizResult/:quizId",authenticateUser,getQuizResult)
router.get("/getAllQuizResult/:quizId",authenticateUser,getAllQuizResult)

module.exports=router