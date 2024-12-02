const errorMiddleware=(err,req,res,next)=>{
    // console.log(err.statusCode);
    err.message ||="Internal Server Error";
    err.statusCode ||= 500;

    if(err.code===11000){
        err.message ="Duplicate Feild Error "+Object.keys(err.keyPattern).join(",");
        err.statusCode =400
    }

    if(err.name==="CastError"){
        err.message =`invalid format of ${err.path}`
        err.statusCode=400
    }

    const response={
        success:false,
        message:err.message
    }
    if(process.env.NODE_ENV=="DEVOLOPMENT"){
        response.error=err
    }

    return res.status(err.statusCode).json(response)

}

const TryCatch=(passedfunction)=> async(req,res,next)=>{
   try{
    await passedfunction(req,res,next);
   }
   catch(error){
    console.log("error found in the try catch");
    console.log(error);
    next(error);
   }
}
export {errorMiddleware,TryCatch};