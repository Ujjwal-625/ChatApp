import mongoose from 'mongoose';

import jwt from "jsonwebtoken";


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

export { connectdb,sendToken };
