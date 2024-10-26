const errorMiddleware=(err,req,res,next)=>{
    // console.log(err.statusCode);
    err.message ||="Internal Server Error";
    err.statusCode ||= 500;
    return res.status(err.statusCode).json({
        errorMessage:err.message,
        success:false
    })

}

const TryCatch=(passedfunction)=> async(req,res,next)=>{
   try{
    await passedfunction(req,res,next);
   }
   catch(error){
    console.log("error found in the try catch");
    // console.log(error);
    next(error);
   }
}
export {errorMiddleware,TryCatch};