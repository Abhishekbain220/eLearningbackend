let express=require("express")
const { submitQuiz, getQuizResult, getAllQuizResult } = require("../controller/quizSubmissionController")
const { authenticateUser } = require("../middleware/authMiddleware")
const { authenticateStudent } = require("../middleware/studentMiddleware")
let router=express.Router()

router.post("/submitQuiz/:quizId",authenticateUser,authenticateStudent,submitQuiz)
router.get("/getQuizResult/:quizId",authenticateUser,authenticateStudent,getQuizResult)
router.get("/getAllQuizResult/:quizId",authenticateUser,getAllQuizResult)

module.exports=router