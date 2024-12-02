import mongoose from 'mongoose';

import jwt from "jsonwebtoken";

import {v4 as uuid} from "uuid"
import {v2 as cloudinary} from "cloudinary"
import { getBase64, getSockets } from '../lib/helper.js';


const cookieOptions={
  secure:true,
  httpOnly:true,
  sameSite:"none",
  maxAge:24*60*60*1000
}
const connectdb = async (uri) => {
   try {
     const data = await mongoose.connect(uri, { dbName: "ChatApp" });
     console.log(`Connected to DB: ${data.connection.host}`);
   } catch (err) {
     console.error("Error in connecting to database from utils folder:", err.message);
     throw err;
   }
};

const sendToken=(res,user,code,message)=>{
  const token=jwt.sign({_id:user.id},process.env.JWT_SECRET);
  res.status(code).cookie("ChatApp",token,cookieOptions).json({
    success:true,
    token,
    message,
    user
  })
}

const emitEvent = (req,event,user,data)=>{

  const io=req.app.get("io");//set io in app
  const userSockets=getSockets(user);
  io.to(userSockets).emit(event,data);
  console.log("emitting event",event);
}



const uploadFilesToCloudinary=async(files=[])=>{
   const uploadPromises=files.map((file)=>{
    return new Promise((resolve,reject)=>{
      cloudinary.uploader.upload(
        getBase64(file),
        {
          //options
          resource_type:"auto",
          public_id:uuid()
        },
        (error,result)=>{
          if(error){
            return reject(error)
          }
          return resolve(result)
        }
      )
    })
   })

   try {
    const result= await Promise.all(uploadPromises);
    // console.log("feature.js",result)
    const formattedResult= result.map((ele)=>({
      public_id:ele.public_id,
      secretUrl:ele.secure_url
    }))
    return formattedResult;

   } catch (error) {
     throw new Error("Error in uploading files to cloudinary of new user",error)
   }
}

const deleteFilesFromCloudinary=async(publicIds)=>{

}
export { connectdb,sendToken,cookieOptions,emitEvent,deleteFilesFromCloudinary,uploadFilesToCloudinary };
