import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utilty.js";

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

export {isAuthenticated}