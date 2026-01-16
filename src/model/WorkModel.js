const mongoose = require("mongoose")


const WorkSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
technologies:{
    type:[String],
    required:true
},   Year:{
        type:Number,
        required:true
    },
   

},{timestamps:true, strict:true})

module.exports = mongoose.model("Work",WorkSchema)