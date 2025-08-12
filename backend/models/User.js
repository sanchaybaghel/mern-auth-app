const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        required:false
    },
    fcmToken: { type: String }
},{timestamps:true})
const User=mongoose.model('user',userSchema)
module.exports=User