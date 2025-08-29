let express=require("express")
const { currentUser, signup, login, logout, updateUser } = require("../controller/userController")
const { authenticateUser } = require("../middleware/authMiddleware")
let router=express.Router()

router.get("/currentUser",authenticateUser,currentUser)
router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",authenticateUser,logout)
router.put("/updateUser",authenticateUser,updateUser)


module.exports=router