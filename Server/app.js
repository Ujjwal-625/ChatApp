import express, { urlencoded } from "express";
import userRoute from "./routes/user.router.js";
import { connectdb } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config({
    path:"./.env",
})
const MongoUri=process.env.MONGO_URI;
connectdb(MongoUri);// db name is Provided in options
const port =process.env.PORT || 3000;


const app=express();

//using middlewares
app.use(express.json());
app.use(urlencoded({extended:true}))


//use this middleware at last
app.use("/user",userRoute);

//use this at last 
app.use(errorMiddleware);


app.listen(port,(err)=>{
    if(err){
        console.log(`failed to listen at port ${port}`);
    }
    else{
        console.log(`started to listen on the port ${port}`);
    }
})