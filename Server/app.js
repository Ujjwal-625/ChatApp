import express, { urlencoded } from "express";
import { connectdb } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server, Socket } from "socket.io";
import {createServer} from "http"
import { v4 as uuid} from "uuid";
import cors from "cors";
import {v2 as cloudinary} from "cloudinary"

import userRoute from "./routes/user.router.js"
import chatRoute from "./routes/chat.route.js"
import adminRoute from "./routes/admin.route.js"
import { createGroupChats, createMessagesInAChat, createSingleChats, createUser } from "./seeders/user.seeder.js";
import { getSockets } from "./lib/helper.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { MessageModel } from "./models/message.models.js";
import { compareSync } from "bcrypt";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

export const userSocketIDs=new Map();

dotenv.config({
    path:"./.env",
})
const MongoUri=process.env.MONGO_URI;
connectdb(MongoUri);// db name is Provided in options
const port =process.env.PORT || 3000;

export const adminSecretKey=process.env.ADMIN_SECRET_KEY || "fjdslfjsdljflsfuio";

//configuring cloudinary

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLODINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// creating Seeders for fake user to create groups
// createUser(10);//10 is number of fake users
//we have runned it once to create 10 users
//  createSingleChats(10);
//  createGroupChats(10);
// createMessagesInAChat("671d2dd85bb11bf24abea358",50);


const app=express();
const server=createServer(app)
const io=new Server(server,{
    cors:corsOptions
})

app.set("io",io);

//using middlewares
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cookieParser());

app.use(cors(corsOptions))


app.get("/",(req,res)=>{
    res.send("hello");
})

//use this middleware at last
app.use("/api/v1/user",userRoute);
app.use("/api/v1/chat",chatRoute);
app.use("/api/v1/admin",adminRoute);

//middleware for socket
io.use((Socket,next)=>{
    const func=cookieParser();
    func(Socket.request,Socket.request.res, async (err)=>{
    await socketAuthenticator(err,Socket,next)
    })

})

io.on("connection",(socket)=>{

    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);
  
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
  
      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };
  
      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime,
      });
      io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
  
      try {
        await MessageModel.create(messageForDB);
      } catch (error) {
        throw new Error(error);
      }
    });

    socket.on(START_TYPING,({members,chatId})=>{
      
      const memberSocket=getSockets(members);
      // console.log("start typing");
      socket.to(memberSocket).emit(START_TYPING,{chatId})
    })
    socket.on(STOP_TYPING,({members,chatId})=>{
      
      const memberSocket=getSockets(members);
      // console.log("stop typing");
      socket.to(memberSocket).emit(STOP_TYPING,{chatId})
    })
  
    
})

//use this at last 
app.use(errorMiddleware);


server.listen(port,(err)=>{
    if(err){
        console.log(`failed to listen at port ${port} on ${process.env.NODE_ENV} mode`);
    }
    else{
        console.log(`started to listen on the port ${port} on ${process.env.NODE_ENV} mode`);
    }
})