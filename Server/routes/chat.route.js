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


const app =express.Router();
app.use(isAuthenticated);// now all the routes below work only when you are logged in

app.post("/new",newGroupChat)
app.get("/my",getMyChats);
app.get("/my/groups",getMyGroups);
app.put("/addmembers",addMembers);
app.delete("/removeMember",removeMember);
app.delete("/exitGroup/:id",exitGroup);
app.post("/message",attatchmentsMulter,sendAttatchments);// used to send attatcments
app.get("/message/:id",getMessages)

//get chat Details ,rename,delete
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;