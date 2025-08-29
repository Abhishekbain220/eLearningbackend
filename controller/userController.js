let User = require("../model/userSchema")
let CustomError = require("../utils/customError")

module.exports.currentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            user: req.user
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}

module.exports.signup = async (req, res, next) => {
    try {
        let {username,email,password,role}=req.body
        let existingUser=await User.findOne({email})
        if(existingUser)return next(new CustomError("User already exist",400))
            let user=await User.create({username,email,password,role})
        await user.save()

        let token=user.generateAuthToken()
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:1000*60*60*5,
            secure:true,
            sameSite:"None"
        })
        res.status(200).json({
            message:"User Successfully Created",
            token
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}

module.exports.login = async (req, res, next) => {
    try {
        let {email,password}=req.body
        let existingUser=await User.findOne({email})
        if(!existingUser) return next(new CustomError("User not Found",400))
            let user=await User.authenticate(email,password)
        let token=user.generateAuthToken()
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:1000*60*60*5,
            secure:true,
            sameSite:"None"
        })
        res.status(200).json({
            message:"Login Successful",
            token
        })
        
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        res.status(200).json({
            message: "Logout Successful",

        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error, 500))
    }
}

module.exports.updateUser = async (req, res, next) => {
    try {
        let { username, email, role, password } = req.body
        if (username) req.user.username = username
        if (email) req.user.email = email
        if (role) req.user.role = role
        if (password) req.user.password = password
        await req.user.save()

        res.status(200).json({
            message: "User Updated Successfully",
            user: req.user
        })


    } catch (error) {
        console.log(error)
        next(new CustomError(error.message, 500))
    }
}
