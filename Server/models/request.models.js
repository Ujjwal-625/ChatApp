import mongoose from "mongoose";

const requestSchema=new mongoose.Schema({
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel"
    },
    reciver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel"
    }

},{timestamps:true});


export const RequestModel=mongoose.models.RequestModel || mongoose.model("RequestModel",requestSchema);