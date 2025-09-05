let express=require("express")
const { generateCertificate } = require("../controller/generateCertificateController")
const { authenticateUser } = require("../middleware/authMiddleware")
const { authenticateAdmin } = require("../middleware/adminMiddleware")
const { authenticateStudent } = require("../middleware/studentMiddleware")
let router=express.Router()

router.post("/generateCertificate/:courseId",authenticateStudent,generateCertificate)

module.exports=router