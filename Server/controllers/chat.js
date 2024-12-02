import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utilty.js";
import { ChatModel } from "../models/chat.models.js";
import { UserModel } from "../models/user.models.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { ALERT, NEW_ATTATCHMENT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import mongoose from "mongoose";
import { MessageModel } from "../models/message.models.js";

const newGroupChat=TryCatch(async(req,res,next)=>{
    const {name,members}=req.body;
    console.log(req.body);
    console.log("name",name);
    console.log("members",members);

    const allmembers=[...members,req.user];

    await ChatModel.create({
        name,
        groupChat:true,
        creater:req.user,
        members:allmembers
    })
    emitEvent(req,ALERT,allmembers,`Welcome to ${name} group`);
    emitEvent(req,REFETCH_CHATS,members);
    res.status(201).json({
        sucess:true,
        message:"group created"
    })
}) 

const getMyChats=TryCatch(async(req,res,next)=>{
    
    const chats=await ChatModel.find({members:req.user}).populate("members","name avatar");

    const transformedChat=chats.map(({_id,name,members,groupChat})=>{
        const otherMember=getOtherMember(members,req.user);

        return {
            _id,
            groupChat,
            avatar:groupChat?members.slice(0,3).map(({avatar})=>avatar.url):[otherMember.avatar.url],
            name:groupChat?name:otherMember.name,
            members:members.reduce((prev,curr)=>{
                if(curr._id.toString()!==req.user.toString){
                    prev.push(curr._id);
                }
                return prev;
            },[])

        }
    })

    
    res.status(200).json({
        sucess:true,
        chats:transformedChat,
        message:"Chats fetched"
    })
}) 

const getMyGroups=TryCatch(async(req,res,next)=>{
    const chats=await ChatModel.find({members:req.user,groupChat:true,creater:req.user})
    .populate("members","name avatar")

    const groups=chats.map(({_id,members,groupChat})=>{
        return {
            _id,
            groupChat,
            members,
            avatar:members.slice(0,3).map(({avatar})=>avatar.url)
        }
    })
    res.status(200).json({
        success:true,
        groups,
        message:"groups fetched"
    })
})

const addMembers = TryCatch(async (req, res, next) => {
    const { chatId, members } = req.body;
  
    if (!chatId || !members) {
      return next(new ErrorHandler("You must provide chatId and members to be added", 400));
    }
  
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      console.log("error in adding new member to (group in chat)");
      return next(new ErrorHandler("Chat not found in db", 404));
    }
    if (!chat.groupChat) {
      return next(new ErrorHandler("Group chat not found in db", 404));
    }
  
    if (chat.creater.toString() !== req.user.toString()) {
      return next(new ErrorHandler("You are not allowed to add members", 403));
    }
  
    const newMemberPromise = members.map((i) => UserModel.findById(i));

    const allmembers = await Promise.all(newMemberPromise);
  
    // Filter out any non-existent members
    const validMembers = allmembers.filter((ele) => !chat.members.includes(ele._id.toString()))
    .map((ele)=>ele._id);

    chat.members.push(...validMembers.map((ele) => ele._id));


  
    if (chat.members.length > 100) {
      return next(new ErrorHandler("You cannot add more than 100 members to the group", 400));
    }
  
    await chat.save();
  
    const allUserNames = validMembers.map((ele) => ele.name).join(",");
    emitEvent(req, ALERT, chat.members, `${allUserNames} have been added to ${chat.name} Group`);
    emitEvent(req, REFETCH_CHATS, chat.members);
  
    res.status(200).json({
      success: true,
      chat, // Respond with the chat object or other data as needed
      message: "Members added to the group successfully"
    });
  });
  

const removeMember=TryCatch(async(req,res,next)=>{

    const {userId,chatId}=req.body;
    if(!userId || !chatId){
        return next(new ErrorHandler("user must provide userId and chatId",400));
    }
    const [chat ,userToBeRemoved]=await Promise.all([ChatModel.findById(chatId)
        ,UserModel.findById(userId,"name")
    ])

    if (!chat) {
        console.log("error in adding new member to (group in chat)");
        return next(new ErrorHandler("Chat not found in db", 404));
      }
      if (!chat.groupChat) {
        return next(new ErrorHandler("Group chat not found in db", 404));
      }
    
      if (chat.creater.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not allowed to add members", 403));
      }

      if(chat.members.length <= 3){
        //we can't remove more members
        return next(new ErrorHandler("Group must have atleast 3 members",400))
      }

      const allmembers=chat.members.map((ele)=>ele.toString())

      chat.members=chat.members.filter(member=> member.toString()!==userId.toString());

      await chat.save();

      emitEvent(req,ALERT,chat.members,`${userToBeRemoved.name} has been removed from the group`)
      emitEvent(req,REFETCH_CHATS,allmembers);

      return res.status(200).json({
        success:true,
        message:"User removed succesfully"
      })
})

const exitGroup=TryCatch(async(req,res,next)=>{
  // console.log("Recieved");
  const chatId=req.params.id;
  // console.log(chatId);
  if(!chatId){
    return next(new ErrorHandler("ChatId not provided ",403));
  }
  const chat =await ChatModel.findById(chatId);

  if (!chat.groupChat) {
    return next(new ErrorHandler("Group chat not found in db", 404));
  }


  const remainingMembers=chat.members.filter((member)=>member.toString()!== req.user.toString());

  if(remainingMembers.length<3){
    return next(new ErrorHandler("Group must have atleat 3 members",401));
  }

  if(chat.creater.toString()===req.user.toString()){
    //admin is leaving the group create new Admin
    chat.creater=remainingMembers[0];
  }

  chat.members=remainingMembers;
  const user=await UserModel.findById(req.user,"name");
  await chat.save();  
  emitEvent(req,ALERT,chat.members,`${user.name} has left the group`)

  return res.status(200).json({
    success:true,
    message:"You have Succefully exited the group Chat"
  })

})

const sendAttatchments=TryCatch(async(req,res,next)=>{

  const { chatId } = req.body;

  const file=req.files || [];

  if(file.length<1 ){
    return next(new ErrorHandler("Please upload Attachments",400))
  }
  if(file.length >5){
    return next (new ErrorHandler("You can upload atmax 5 Attachments only",400))
  }

  if(!chatId){
    return next(new ErrorHandler("Provide chat Id"),400)
  }

  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please Upload Attachments", 400));

  if (files.length > 5)
    return next(new ErrorHandler("Files Can't be more than 5", 400));

  const [chat, me] = await Promise.all([
    ChatModel.findById(chatId),
    UserModel.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (files.length < 1)
    return next(new ErrorHandler("Please provide attachments", 400));

  //   Upload files here


 const tempattachments = await uploadFilesToCloudinary(files);
 const attachments= tempattachments.map((ele)=>({
  public_id:ele.public_id,
  url:ele.secretUrl
 }))
//  console.log("attachments",attachments)
  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await MessageModel.create(messageForDB);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
})

const getChatDetails=TryCatch(async(req,res,next)=>{
  // console.log("hi");
  
  if(req.query.populate==="true"){

    const chat=await ChatModel.findById(req.params.id).populate("members","name avatar").lean()
    //by using lean it will not effect our  db and chat.members will be simple object
    if(!chat ){
      return next(new ErrorHandler("Chat not found ",404))
    }

    chat.members=chat.members.map(({_id,name,avatar})=>({_id,name,avatar:avatar.url}))

    return res.status(200).json({
      success:true,
      chat,
    })
  }
  else {
    // console.log('inside');
    const chat=await ChatModel.findById(req.params.id)
    if(!chat ){
      return next(new ErrorHandler("Chat not found ",404))
    }
    return res.status(200).json({
      success:true,
      chat
    })
  }
})

const renameGroup=TryCatch(async(req,res,next)=>{
  const {name}=req.body;
  const chatId=req.params.id;

  const chat =await ChatModel.findById(chatId);
  if (!chat || !name) {
    return next(new ErrorHandler("Chat not found in db", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("Group chat not found in db", 404));
  }

  if (chat.creater.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not allowed to change the group name", 403));
  }

  chat.name=name|| chat.name;
  await chat.save();

  emitEvent(req,REFETCH_CHATS,chat.members);

  return res.status(200).json({
    success:true,
    message:"Renamed the group succefully"
  })
})

const deleteChat=TryCatch(async(req,res,next)=>{
  const chatId=req.params.id;

  const chat =await ChatModel.findById(chatId);
  if(!chat){
    return next(new ErrorHandler("No chat found",404));
  }

  if(chat.groupChat && req.user.toString() !== chat.creater.toString()){
    return next(new ErrorHandler("You don't have access to delete the group",401));
  }
  
  if(!chat.groupChat && !chat.members.includes(req.user.toString()) ){
    return next(new ErrorHandler("You don't have access to delete the group",401));
  }

  //remove attachments from cloudinary

  const messagesWithAttachments=await MessageModel.find({chat:chatId,attachments:{$exists:true,$ne:[]}})

  const publicIds=[];

  messagesWithAttachments.forEach(({attachments})=>{
    attachments.forEach(({publicId})=>{
      publicIds.push(publicId);
    })
  })

  await Promise.all([
    deleteFilesFromCloudinary(publicIds),
    chat.deleteOne(),
    MessageModel.deleteMany({chat:chatId})
  ])

  emitEvent(req,REFETCH_CHATS,chat.members)

  return res.status(200).json({
    success:true,
    message:"Group deleted succesfuly",
  })
  
})


const getMessages=TryCatch(async(req,res,next)=>{
  const chatId=req.params.id;
  const {page=1}=req.query;
  const limit =20;
  const skip =(page-1)*limit
  
  const chat=await ChatModel.findById(chatId);
  
   if(!chat ){
    return next(new ErrorHandler("No Chat found with given id ",401));
   }

   if(!chat.members.includes(req.user.toString())){
    return next(new ErrorHandler("You are not member of this chat ",401));
   }

  const [message ,totalMessageCount]=await Promise.all([
    MessageModel.find({chat : chatId})
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limit)
      .populate("sender","name")
      .lean()
    ,MessageModel.countDocuments({chat : chatId})
  ])

  const totalPage=Math.ceil(totalMessageCount/limit);

  return res.status(200).json({
    success:true,
    message:message.reverse(),
    totalPage
  })
})


export {newGroupChat,
        getMyChats,
        getMyGroups,
        addMembers,
        removeMember,
        exitGroup,
        sendAttatchments,
        getChatDetails,
        renameGroup,
        deleteChat,
        getMessages
}