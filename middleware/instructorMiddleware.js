let jwt = require("jsonwebtoken")
let User = require("../model/userSchema")

exports.authenticateInstructor = async (req, res, next) => {
    try {
        let token = req.cookies.token
        if (!token) return res.status(401).json({ message: "Unauthorised token" })
        let decoded = jwt.verify(token, process.env.KEY)
        let user = await User.findById(decoded.id)
        if (!user) return res.status(401).json({ message: "Unauthorised" })
            req.user=user
            if(user.role!=="instructor" && user.role!=="admin") return res.status(401).json({message:"This is Protected Route for Instructor and Admin only"})
        
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}