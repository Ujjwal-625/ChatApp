import { compare } from "bcrypt";
import {UserModel} from "../models/user.models.js";
//create a new user and save it to db and also save in cookie
import {cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary} from "../utils/features.js"
import {TryCatch} from "../middlewares/error.js"
import { ErrorHandler } from "../utils/utilty.js";
import { ChatModel } from "../models/chat.models.js";
import { RequestModel } from "../models/request.models.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

const newUser=TryCatch(async(req,res,next)=>{
    const {name ,username,password ,bio,email}=req.body;
    const file=req.file;
    if(!file){
        return next (new ErrorHandler("Please Provide avatar",404))
    }
    const result=await uploadFilesToCloudinary([file]);
    // console.log(result)
    const avatar={
        public_id:result[0].public_id,
        url:result[0].secretUrl
    }
    // console.log(avatar);
   const user= await UserModel.create({
        avatar,
        name,
        username,
        password,
        bio,
        email
    })

   sendToken(res,user,201,"user Created");
})

const login = TryCatch(async (req, res,next) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username }).select("+password");
  
    if (!user) return next(new ErrorHandler("Invalid Username or Password",401));
  
    const isMatch = await compare(password, user.password);
  
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 401));
  
    sendToken(res, user, 200, `Welcome Back, ${user.name}`);  
});

const getProfile=TryCatch( async(req,res)=>{
    //in the previous middleware isAuthenticate we added id in the req.user field now we can access it further middlewares
    const user =await UserModel.findById(req.user);
    // and by default password is not selected so it will not come in user 
    res.status(200).json({
        success:true,
        data:user
    });
})

const logout=(req,res,next)=>{
    res.status(200).cookie("ChatApp","",{...cookieOptions,maxAge:0}).json({
        success:true,
        message :"logout success and cookie also deleted"
    })

}

const sendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;

    if(req.user.toString()=== userId){
        console.log("You can't send request to yourself");
        return next(new ErrorHandler("You can't send request to yourself",400));
    }

    const request = await RequestModel.findOne({
        $or: [
            { $and: [{ sender: req.user }, { reciver: userId }] },
            { $and: [{ sender: userId }, { reciver: req.user }] }
        ]
    });
    

    if (request) {
        if(request.sender._id.toString()===req.user.toString())
        return next (new ErrorHandler("Friend request Already Sent",400));
        else
        return next (new ErrorHandler("This user has Already sent You Request",400));

    }

    const newRequest = await RequestModel.create({
        sender: req.user,
        reciver:userId
    });

    if (newRequest) {
        emitEvent(req, NEW_REQUEST, [userId]);
    }

    res.status(200).json({
        success: true,
        message: "Friend request sent"
    });
});

const acceptRequest=TryCatch(async(req,res,next)=>{
    const {requestId,accept}=req.body;

    const request =await RequestModel.findById(requestId).populate("sender","name")
    .populate("reciver","name")

    if(!request){
        return next(new ErrorHandler("Invalid request Id Provided",404))
    }

    // console.log(req.user,request.reciver);
    if(req.user.toString()!==request.reciver._id.toString() ){
        return next (new ErrorHandler("You are not authorized to accept this request",401));

    }

    if(!accept){
        //delete the request
        await request.deleteOne();
        return res.status(200).json({
            success:true,
            message:"request Rejected"
        })
    }

        const members=[request.reciver._id,request.sender._id];
        await Promise.all([
            ChatModel.create({
                name:`${request.sender.name}-${request.reciver.name}`,
                members
            }),
            request.deleteOne()
        ])

        emitEvent(req,REFETCH_CHATS,members)

    return res.status(200).json({
        success:true,
        message:"friend request accepted",
        senderId:request.sender._id
    })

    
})

const getAllNotifications=TryCatch(async(req,res,next)=>{

    const requests=await RequestModel.find({reciver:req.user}).
    populate("sender","name avatar")

    const allRequest=requests.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url
        }
    }))
    console.log(allRequest);

    return res.status(200).json({
        success:true,
        allRequest
    })

})
const searchUser=TryCatch(async(req,res,next)=>{
    const {name}=req.query;

    const myChats=await ChatModel.find({groupChat:false,members:req.user});

    const allUsersFromMyChat=myChats.map((ele)=>ele.members).flat();

    const allUserExeptMeAndFriends=await UserModel.find({
       _id:{$nin:allUsersFromMyChat},
       name:{$regex: name, $options: "i"}
    })

    const users=allUserExeptMeAndFriends.map(({_id,name,avatar})=>(
        {
            _id,
            name,
            avatar:avatar.url
        }
    ))

    res.status(200).json({
        success:true,
        users
    });
}
)

const getMyFriends=TryCatch(async(req,res,next)=>{
    const {chatId}=req.query;

    const chat =await ChatModel.find({members:req.user,groupChat:false})
    .populate("members","name avatar");

    const friends=chat.map(({members})=>{
        const otherUser=getOtherMember(members,req.user);
        return {
            _id:otherUser._id,
            name:otherUser.name,
            avatar:otherUser.avatar.url
        }
    })

    if(chatId){
        const chat =await ChatModel.findById(chatId);

        const availableFriends=friends.filter((friend)=>(
            !chat.members.includes(friend._id)
        ))

        res.status(200).json({
            success:true,
            availableFriends
        })
    }
    else {
        return res.status(200).json({
            success:true,
            friends
        })
    }

})

export {login,
    newUser,
    getProfile,
    logout,
    searchUser,
    sendRequest,
    acceptRequest,
    getAllNotifications,
    getMyFriends
};