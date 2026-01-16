const Blog = require('../model/BlogModel')

const createBlogController = async (req,res) => {
    try {
        const {title,content,technologies} = req.body
        const allowedFields = ['title','content','technologies']
        const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key))
        
        if(extraFields.length > 0){
            return res.status(400).json({
                status:400,
                message:`Invalid fields: ${extraFields.join(', ')}`
            })
        }
        
        if(!title || !content || !technologies){
            return res.status(400).json({
                status:400,
                message:"Please provide all required fields"
            })
        }

        if(!Array.isArray(technologies)){
            return res.status(400).json({
                status:400,
                message:"Technologies must be an array"
            })
        }

        if(technologies.length === 0){
            return res.status(400).json({
                status:400,
                message:"Please provide at least one technology"
            })
        }

        const blog = await Blog.create({
            title,
            content,
            technologies
        })

        res.status(201).json({
            status:201,
            message:"Blog created successfully",
            response:blog
        })

    } catch (error) {
        res.status(500).json({
            status:500,
            message:"Internal server error"
        })
    }
}

const getAllBlogsController = async (req, res) => {
    try {
        const {page=1,limit=10,search} = req.query
        const skip = (page-1)*limit

        const query = search ? {
            $or:[
                {title:{ $regex:search,$options:'i'}},
                {content:{ $regex:search,$options:'i'}},
                {technologies:{ $regex:search,$options:'i'}}
            ]
        }: {}

        const blogs = await Blog.find(query).skip(skip).limit(limit)
        const totalBlogs = await Blog.countDocuments(query)
        const totalPages = Math.ceil(totalBlogs/limit)

        res.status(200).json({
            status:200,
            message:"Blogs fetched successfully",
            response:{
                blogs,
                totalBlogs,
                currentPage:page,
                totalPages
            }
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:"Internal server error"
        })
    }
}

const getBlogByIdController = async (req, res) => {
    try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        if(!blog){
            return res.status(404).json({
                status:404,
                message:"Blog not found"
            })
        }
        res.status(200).json({
            status:200,
            message:"Blog fetched successfully",
            response:blog
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:"Internal server error"
        })
    }
}

const updateBlogController = async (req, res) => {
    try {
        const {id} = req.params
        const {title,content,technologies} = req.body
        const allowedFields = ['title','content','technologies']
        const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key))

        if(extraFields.length > 0){
            return res.status(400).json({
                status:400,
                message:`Invalid fields: ${extraFields.join(', ')}`
            })
        }

        const blog = await Blog.findByIdAndUpdate(id,{
            title,
            content,
            technologies
        },{new:true})

        if(!blog){
            return res.status(404).json({
                status:404,
                message:"Blog not found"
            })
        }

        res.status(200).json({
            status:200,
            message:"Blog updated successfully",
            response:blog
        })

    } catch (error) {
        res.status(500).json({
            status:500,
            message:"Internal server error"
        })
    }
}

const deleteBlogController = async (req, res) => {
    try {
        const {id} = req.params
        const blog = await Blog.findByIdAndDelete(id)
        if(!blog){
            return res.status(404).json({
                status:404,
                message:"Blog not found"
            })
        }
        res.status(200).json({
            status:200,
            message:"Blog deleted successfully",
            response:blog
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:"Internal server error"
        })
    }
}


const BlogController = {
    createBlogController,
    getAllBlogsController,
    getBlogByIdController,
    updateBlogController,
    deleteBlogController
}

module.exports = BlogController