import { compare } from "bcrypt";
import {UserModel} from "../models/user.models.js";
//create a new user and save it to db and also save in cookie
import {sendToken} from "../utils/features.js"
import {TryCatch} from "../middlewares/error.js"

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
     const user = await UserModel.findOne({username}).select("+password");
     console.log("User found:", user);
     if (!user) {
         return next(new Error("Invalid Message"));
         // return res.status(400).json({ message: "Invalid Username" });
     }
     const matching =await compare(password,user.password);
djflskdjfs
     if(!matching){
         return next(new Error("Wrong Password"));
         // return res.status(400).json({message:"Wrong Password"});
     }
     sendToken(res,user,200,`Welcome Back ${user.name}`);   
});


export {login,newUser};