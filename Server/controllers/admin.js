import jwt from "jsonwebtoken";
import { TryCatch } from "../middlewares/error.js";
import { ChatModel } from "../models/chat.models.js";
import { MessageModel } from "../models/message.models.js";
import { UserModel } from "../models/user.models.js";
import { ErrorHandler } from "../utils/utilty.js";
import { cookieOptions } from "../utils/features.js";
import { adminSecretKey } from "../app.js";


const getAllusers=TryCatch(async(req,res,next)=>{
    const allusers=await UserModel.find({});
    const transformedUsers=await Promise.all(allusers.map(async({name ,username,avatar,_id})=>{
        const [groups,friends]=await Promise.all([
            ChatModel.countDocuments({groupChat:true,members:_id}),
            ChatModel.countDocuments({groupChat:false,members:_id})
        ])
        return {
            name,
            username,
            _id,
            avatar:avatar.url,
            groups,
            friends
        }
    }))
    return res.status(200).json({
        success:true,
        AllUsers:transformedUsers
    })
})

const getAllChats=TryCatch(async(req,res,next)=>{
    const chats=await ChatModel.find({})
    .populate("members","name avatar")
    .populate("creater","name avatar")

    const tranformedChats=await  Promise.all(
        chats.map(async({members,_id,groupChat,creater,name})=>{
            const totalMessages=await MessageModel.countDocuments({chat : _id});
            return {
                _id,
                groupChat,
                name,
                avatar:members.slice(0,3).map(({avatar})=>avatar.url),
                members:members.map(({name,_id,avatar})=>({
                    _id,
                    name,
                    avatar:avatar.url
                })),
                creater:{
                    name:creater?.name || "none",
                    avatar:creater?.avatar || ""
                },
                totalMembers:members.length,
                totalMessages
            }
        })
    )
    return res.status(200).json({
        success:true,
        Chats:tranformedChats
    })
})

const getAllMessages=TryCatch(async(req,res,next)=>{
    const messages=await MessageModel.find({})
    .populate("chat","groupChat")
    .populate("sender","name avatar")

    const tranformedMessages=messages.map(({_id,chat ,sender,content,attachments,createdAt})=>({
        _id,
        content,
        attachments,
        groupChat:chat.groupChat,
        createdAt,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar
        },
    }))

    return res.status(200).json({
        success:true,
        message:tranformedMessages
    })
})

const getDashboradStats=TryCatch(async(req,res,next)=>{

    const [groupCount,userCount,messageCount,totalChatCount]=await Promise.all([
        ChatModel.countDocuments({groupChat:true}),
        UserModel.countDocuments({}),
        MessageModel.countDocuments({}),
        ChatModel.countDocuments({})
    ])

    const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await MessageModel.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const millisecondsInDay = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / millisecondsInDay;
    const index = Math.floor(indexApprox);

    messages[6 - index]++;
  });

    return res.status(200).json({
        success:true,
        data:{
            groupCount,
            userCount,
            messageCount,
            totalChatCount,
            messages
        }
    })
})

const adminLogin=TryCatch(async(req,res,next)=>{
    const {secretKey}=req.body;

    const isMaching = (adminSecretKey===secretKey);

    if(isMaching){
        const token=jwt.sign(secretKey,process.env.JWT_SECRET);
        return res.status(200).cookie("admin-cookie",token,{...cookieOptions,maxAge:60*1000*15})
        .json({
            success:true,
            message:"Admin Authenticated Succesfuly"
        })

    }
    else{
        return next(new ErrorHandler("Invalid Secret Key",401));
    }
})

const adminLogout=TryCatch(async(req,res,next)=>{
    return res.status(200)
    .cookie("admin-cookie","",{...cookieOptions,maxAge:0})
    .json({
        success:true,
        message:"admin Logout Succesfully"
    })
}) 

const getAdminData=TryCatch(async(req,res,next)=>{
    return res.status(200).json({
        admin:true
    })
})

export {getAllusers,getAllChats,getAllMessages,getDashboradStats,adminLogin,adminLogout,getAdminData}