require("dotenv").config();
let db=require("./model/connect")
let express=require("express")
let cookieParser=require("cookie-parser")
let morgan=require("morgan")
let cors=require("cors")
let app=express()
let PORT=process.env.PORT || 3000
let {errorHandler}=require("./middleware/errorHandler")
let userRouter=require("./Routes/userRouter")
let courseRouter=require("./Routes/courseRouter")
let videoLectureRouter=require("./Routes/videoLectureRouter")
let studyMaterialRouter=require("./Routes/studyMaterialRouter")
let assignmentRouter=require("./Routes/assignmentRouter")
let quizRouter=require("./Routes/quizRouter")
let assignmentSubmissionRouter=require("./Routes/assignmentSubmissionRouter")
let quizSubmissionRouter=require("./Routes/quizSubmissionRouter")
let adminRouter=require("./Routes/adminRouter")
let generateCertificateRouter=require("./Routes/generateCertificateRouter")


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"))

let allowedOrigins=[
    "http://localhost:5173",
]
app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))

// Routes
app.use("/user",userRouter)
app.use("/course",courseRouter)
app.use("/videoLecture",videoLectureRouter)
app.use("/studyMaterial",studyMaterialRouter)
app.use("/assignment",assignmentRouter)
app.use("/quiz",quizRouter)
app.use("/assignmentSubmission",assignmentSubmissionRouter)
app.use("/quizSubmission",quizSubmissionRouter)
app.use("/admin",adminRouter)
app.use("/generateCertificate",generateCertificateRouter)


app.get("/",(req,res)=>{
    res.send("Backend is Running")
})

// Error Handling Middlewares
app.use((req,res,next)=>{
    res.status(404).json({
        success:false,
        message:"Route not Found"
    })
})

app.use(errorHandler)


// Listening the Server
app.listen(PORT,()=>{
    console.log("Server is Running on PORT",PORT)
})