import express, { urlencoded } from "express";
import { connectdb } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.router.js"
import chatRoute from "./routes/chat.route.js"
import { createGroupChats, createMessagesInAChat, createSingleChats, createUser } from "./seeders/user.seeder.js";


dotenv.config({
    path:"./.env",
})
const MongoUri=process.env.MONGO_URI;
connectdb(MongoUri);// db name is Provided in options
const port =process.env.PORT || 3000;

// creating Seeders for fake user to create groups
// createUser(10);//10 is number of fake users
//we have runned it once to create 10 users
//  createSingleChats(10);
//  createGroupChats(10);

// createMessagesInAChat("671d2dd85bb11bf24abea358",50);


const app=express();

//using middlewares
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send("hello");
})

//use this middleware at last
app.use("/user",userRoute);
app.use("/chat",chatRoute);

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