import mongoose from "mongoose";

const chatSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    groupChat:{
        type:Boolean,
        default:false
    },
    creater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel"
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserModel"
        }
    ],

},{timestamps:true});


export const ChatModel=mongoose.models.ChatModel || mongoose.model("ChatModel",chatSchema);