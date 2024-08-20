const errorMiddleware=(err,req,res,next)=>{
    err.message ||="Internal Server Error";
    err.status ||= 500;
    res.status(err.status).json({
        message:err.message,
        success:false
    })

}

const TryCatch=(passedfunction)=> async(req,res,next)=>{
   try{
    await passedfunction(req,res,next);
   }
   catch(error){
    next(error);
   }
}
export {errorMiddleware,TryCatch};