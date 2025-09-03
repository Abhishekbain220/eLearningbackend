let express=require("express")
const { getAllUsers, deleteUser } = require("../controller/adminController")
const { authenticateUser } = require("../middleware/authMiddleware")
const { authenticateAdmin } = require("../middleware/adminMiddleware")
let router=express.Router()

router.get("/getAllUsers",authenticateUser,authenticateAdmin,getAllUsers,)
router.delete("/deleteUser/:userId",authenticateUser,authenticateAdmin,deleteUser)

module.exports=router