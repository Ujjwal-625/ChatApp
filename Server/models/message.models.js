import mongoose from "mongoose";
import { required } from "nodemon/lib/config";

const messageSchema=new mongoose.Schema({
    content:String,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChatModel",
        required:true
    },
    attachments:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }

},{timestamps:true});


export const MessageModel=mongoose.models.MessageModel || mongoose.model("MessageModel",messageSchema);