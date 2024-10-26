import { compare } from "bcrypt";
import {UserModel} from "../models/user.models.js";
//create a new user and save it to db and also save in cookie
import {cookieOptions, sendToken} from "../utils/features.js"
import {TryCatch} from "../middlewares/error.js"
import { ErrorHandler } from "../utils/utilty.js";

const newUser=async(req,res)=>{
    const {name ,username,password ,bio,email}=req.body;
    const avatar={
        public_id:"random",
        url:"randomurl"
    }
   const user= await UserModel.create({
        avatar,
        name,
        username,
        password,
        bio,
        email
    })

   sendToken(res,user,201,"user Created");
}

const login = TryCatch(async (req, res,next) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username }).select("+password");
  
    if (!user) return next(new ErrorHandler("Invalid Username or Password",404));
  
    const isMatch = await compare(password, user.password);
  
    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 404));
  
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

const searchUser=TryCatch((req,res,next)=>{
    const {user}=req.query;
    res.status(200).json({
        success:true,
        data:user
    });
}
)

export {login,newUser,getProfile,logout,searchUser};