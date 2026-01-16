const Work = require("../model/WorkModel")

const createController = async(req,res)=>{
try{
    const {title,description,technologies,Year} = req.body
    const allowedFields = ['title','description','technologies','Year']
    const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key))
    
    if(extraFields.length > 0){
        return res.status(400).json({
            status:400,
            message:`Invalid fields: ${extraFields.join(', ')}`
        })
    }
    
    if(!title || !description || !technologies || !Year){
        return res.status(400).json({
            status:400,
            message:"Please provide all required fields"
        })
    }
    const work = await Work.create({
        title,
        description,
        technologies,
        Year
    })
    res.status(201).json({
        status:201,
        message:"Work created successfully",
        response:work
    })

}catch(error){
    res.status(500).json({
        status:500,
        message:"Internal server error"
    })
}
}

const getAllWorksController = async(req, res)=>{
try{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const skip = (page - 1) * limit
    
    const query = search ? {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    } : {}
    
    const works = await Work.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    const totalWorks = await Work.countDocuments(query)
    const totalPages = Math.ceil(totalWorks / limit)
    
    res.status(200).json({
        status:200,
        message:"Works fetched successfully",
        response:{
            works,
            totalWorks,
            currentPage:page,
            totalPages
        }
    })
}catch(error){
    res.status(500).json({
        status:500,
        message:"Internal server error"
    })
}
}

const getWorkByIdController = async(req, res)=>{
try{
    const {id} = req.params
    const work = await Work.findById(id)
    if(!work){
        return res.status(404).json({
            status:404,
            message:"Work not found"
        })
    }
    res.status(200).json({
        status:200,
        message:"Work fetched successfully",
        response:work
    })
}catch(error){
    res.status(500).json({
        status:500,
        message:"Internal server error"
    })
}
}

const updateWorkController = async(req, res)=>{
try{
    const {id} = req.params
    const {title,description,technologies,Year} = req.body
    const allowedFields = ['title','description','technologies','Year']
    const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key))
    
    if(extraFields.length > 0){
        return res.status(400).json({
            status:400,
            message:`Invalid fields: ${extraFields.join(', ')}`
        })
    }
    
    const work = await Work.findByIdAndUpdate(id,{
        title,
        description,
        technologies,
        Year
    },{new:true})
    if(!work){
        return res.status(404).json({
            status:404,
            message:"Work not found"
        })
    }
    res.status(200).json({
        status:200,
        message:"Work updated successfully",
        response:work
    })
}catch(error){
    res.status(500).json({
        status:500,
        message:"Internal server error"
    })
}
}

const deleteWorkController = async(req, res)=>{
try{
    const {id} = req.params
    const work = await Work.findByIdAndDelete(id)
    if(!work){
        return res.status(404).json({
            status:404,
            message:"Work not found"
        })
    }
    res.status(200).json({
        status:200,
        message:"Work deleted successfully",
        response:work
    })
}catch(error){
    res.status(500).json({
        status:500,
        message:"Internal server error"
    })
}
}

const workContoller = {
    createController,
    getAllWorksController,
    getWorkByIdController,
    updateWorkController,
    deleteWorkController
}

module.exports = workContoller