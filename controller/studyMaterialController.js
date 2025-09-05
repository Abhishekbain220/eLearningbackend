let StudyMaterial=require("../model/studyMaterialSchema")
const CustomError = require("../utils/customError")
let Course=require("../model/courceSchema")

// 📌 Create new study material for a course
module.exports.createStudyMaterial=async(req,res,next)=>{
    try {
        let { courseId } = req.params
        let { title, description, fileUrl, fileType } = req.body

        // 🔎 Check if course exists
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))

        // ✅ Create new study material linked to course & instructor
        let newStudyMaterial = await StudyMaterial.create({
            title, description, fileUrl, fileType,
            course: course._id,
            instructor: req.user._id,
        })

        // 📌 Push studyMaterial ref to both course & user
        await course.studyMaterial.push(newStudyMaterial._id)
        await newStudyMaterial.save()
        await course.save()
        await req.user.studyMaterial.push(newStudyMaterial._id)
        await req.user.save()

        res.status(200).json({
            message: "Study Material Created Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

// 📌 Delete a study material by ID
module.exports.deleteStudyMaterial=async(req,res,next)=>{
    try {
        let {studyMaterialId}=req.params

        // 🔎 Delete from DB
        let deleteStudyMaterial=await StudyMaterial.findByIdAndDelete(studyMaterialId)
        if(!deleteStudyMaterial)return next(new CustomError("Study Material not Found",400))

        // 📌 Remove reference from course
        let courseId=deleteStudyMaterial.course
        let course=await Course.findById(courseId)
        if(!course)return next(new CustomError("Course not Found",400))

        course.studyMaterial=course.studyMaterial.filter((item)=> item.toString() !== studyMaterialId.toString())
        await course.save()

        // 📌 Remove reference from user
        req.user.studyMaterial=req.user.studyMaterial.filter((item)=> item.toString() !== studyMaterialId.toString())
        await req.user.save()

        res.status(200).json({
            message:"Study Material deleted Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

// 📌 Update study material fields
module.exports.updateStudyMaterial=async(req,res,next)=>{
    try {
        let {studyMaterialId}=req.params
        let { title, description, fileUrl, fileType } = req.body

        // 🔎 Check if material exists
        let studyMaterial=await StudyMaterial.findById(studyMaterialId)
        if(!studyMaterial)return next(new CustomError("Study Material not Found"))

        // ✅ Update only provided fields
        if(title)studyMaterial.title=title
        if(description)studyMaterial.description=description
        if(fileUrl)studyMaterial.fileUrl=fileUrl
        if(fileType)studyMaterial.fileType=fileType

        await studyMaterial.save()

        // ⚠️ Debug: returning all study materials instead of just updated one
        let studyMaterials=await StudyMaterial.find()
        res.status(200).json({
            message:"Study Material Updated Successfully",
            studyMaterials
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

// 📌 Get all study materials for a specific course
module.exports.getAllStudyMaterial=async(req,res,next)=>{
    try {
        let {courseId}=req.params

        // 🔎 Fetch all materials of a course
        let allStydyMaterials=await StudyMaterial.find({course:courseId})

        // ⚠️ `find()` always returns an array (even if empty),
        // so you should check `if (allStydyMaterials.length === 0)` instead
        if(!allStydyMaterials)return next(new CustomError("No Study Materials Found",400))

        res.status(200).json({
            message:"All Study Materials Fetched Successfully",
            allStydyMaterials
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}
