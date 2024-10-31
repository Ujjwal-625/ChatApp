import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {newGroupChat,
    getMyChats,
    getMyGroups,
    addMembers, 
    removeMember,
    exitGroup,
    sendAttatchments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
} from "../controllers/chat.js";
import { attatchmentsMulter } from "../middlewares/multer.js";
import {addmembersValidator,
     deleteChatValidator,
     exitGroupValidator,
     getChatDetailsValidator,
     getMessagesValidator,
     newGroupValidator,
     removemembersValidator,
     renameGroupValidator,
     sendAttachmentsValidator,
     validatehandler
} from "../lib/validators.js";


const app =express.Router();
app.use(isAuthenticated);// now all the routes below work only when you are logged in

app.post("/new",newGroupValidator(),validatehandler,newGroupChat)
app.get("/my",getMyChats);
app.get("/my/groups",getMyGroups);
app.put("/addmembers",addmembersValidator(),validatehandler,addMembers);
app.delete("/removeMember",removemembersValidator(),validatehandler,removeMember);
app.delete("/exitGroup/:id",exitGroupValidator(),validatehandler,exitGroup);
app.post("/message",attatchmentsMulter,sendAttachmentsValidator(),validatehandler,sendAttatchments);// used to send attatcments
app.get("/message/:id",getMessagesValidator(),validatehandler,getMessages)

//get chat Details ,rename,delete
app.route("/:id").get(getChatDetailsValidator(),validatehandler,getChatDetails)
.put(renameGroupValidator(),validatehandler,renameGroup)
.delete(deleteChatValidator(),validatehandler,deleteChat);

export default app;