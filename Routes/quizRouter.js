let express = require("express")
const { authenticateUser } = require("../middleware/authMiddleware")
const { createQuiz, deleteQuiz, updateQuiz, getAllQuiz } = require("../controller/quizController")
const { authenticateInstructor } = require("../middleware/instructorMiddleware")
let router = express.Router()

router.post("/createQuiz/:courseId", authenticateInstructor, createQuiz)
router.delete("/deleteQuiz/:quizId", authenticateInstructor, deleteQuiz)
router.put("/updateQuiz/:quizId", authenticateInstructor, updateQuiz)
router.get("/getAllQuiz/:courseId", authenticateUser, getAllQuiz)

module.exports = router