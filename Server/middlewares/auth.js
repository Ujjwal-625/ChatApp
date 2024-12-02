import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utilty.js";
import { adminSecretKey } from "../app.js";
import { ChatApp_token } from "../constants/config.js";
import { UserModel } from "../models/user.models.js";

const isAuthenticated=(req,res,next)=>{
    //since we are not using res so in place of  res we can also use _ for standard practice
    // console.log(req.cookies);
    const token=  req.cookies["ChatApp"];
    if(!token){
        return next(new ErrorHandler("Please login to access this route ",401));
    }
    // console.log(token);
    const decodedData=jwt.verify(token ,process.env.JWT_SECRET);
    // console.log(decodedData);
    req.user=decodedData._id;// now after this middlware i can access _id in any middleware after this middleware
    next();
}

const isAdmin=(req,res,next)=>{
    const token=  req.cookies["admin-cookie"];
    if(!token){
        return next(new ErrorHandler("Only admin can access this route",401));
    }
    const secretKey=jwt.verify(token ,process.env.JWT_SECRET);
    
    const isMaching= secretKey ===adminSecretKey

    if(!isMaching){
        return next(new ErrorHandler("Only admin can access this route",401));
    }
    next();
}

const socketAuthenticator = async (err, socket, next) => {
    try {
      if (err) return next(err);
  
      const authToken = socket.request.cookies[ChatApp_token];
  
      if (!authToken)
        return next(new ErrorHandler("Please login to access this route", 401));
  
      const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
  
      const user = await UserModel.findById(decodedData._id);
  
      if (!user)
        return next(new ErrorHandler("Please login to access this route", 401));
  
      socket.user = user;
  
      return next();
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Please login to access this route", 401));
    }
  };

export {isAuthenticated,isAdmin,socketAuthenticator}