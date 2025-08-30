let StudyMaterial=require("../model/studyMaterialSchema")
const CustomError = require("../utils/customError")
let Course=require("../model/courceSchema")

module.exports.createStudyMaterial=async(req,res,next)=>{
    try {
        let { courseId } = req.params
        let { title, description, fileUrl, fileType } = req.body
        let course = await Course.findById(courseId)
        if (!course) return next(new CustomError("Course not Found", 400))
        let newStudyMaterial = await StudyMaterial.create({
            title, description, fileUrl, fileType,
            course: course._id

        })

        await course.studyMaterial.push(newStudyMaterial._id)
        await newStudyMaterial.save()
        await course.save()
        res.status(200).json({
            message: "Study Material Created Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

module.exports.deleteStudyMaterial=async(req,res,next)=>{
    try {
        let {studyMaterialId}=req.params
        let deleteStudyMaterial=await StudyMaterial.findByIdAndDelete(studyMaterialId)
        if(!deleteStudyMaterial)return next(new CustomError("Study Material not Found",400))
            let courseId=deleteStudyMaterial.course
        let course=await Course.findById(courseId)
        if(!course)return next(new CustomError("Course not Found",400))
            course.studyMaterial=course.studyMaterial.filter((item)=> item.toString() !== studyMaterialId.toString())
        await course.save()
        res.status(200).json({
            message:"Study Material deleted Successfully",
            course
        })
    } catch (error) {
        console.log(error)
        next(new CustomError(error.message,500))
    }
}

module.exports.updateStudyMaterial=async(req,res,next)=>{
    try {
        let {studyMaterialId}=req.params
        let { title, description, fileUrl, fileType } = req.body
        let studyMaterial=await StudyMaterial.findById(studyMaterialId)
        if(!studyMaterial)return next(new CustomError("Study Material not Found"))
            if(title)studyMaterial.title=title
            if(description)studyMaterial.description=description
            if(fileUrl)studyMaterial.fileUrl=fileUrl
            if(fileType)studyMaterial.fileType=fileType
            await studyMaterial.save()

            // check 
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