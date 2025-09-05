let express=require("express")
const { getAllUsers, deleteUser } = require("../controller/adminController")
const { authenticateUser } = require("../middleware/authMiddleware")
const { authenticateAdmin } = require("../middleware/adminMiddleware")
let router=express.Router()

router.get("/getAllUsers",authenticateAdmin,getAllUsers,)
router.delete("/deleteUser/:userId",authenticateAdmin,deleteUser)

module.exports=router