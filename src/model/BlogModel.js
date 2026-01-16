const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
technologies:{
    type:[String],
    required:true
},

},{timestamps:true,strict:true})

module.exports = mongoose.model("Blog",BlogSchema)