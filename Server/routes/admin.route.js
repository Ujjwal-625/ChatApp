import express from "express"
import { adminLogin, adminLogout, getAdminData, getAllChats, getAllMessages, getAllusers, getDashboradStats } from "../controllers/admin.js";
import { adminLoginValidator, validatehandler } from "../lib/validators.js";
import { isAdmin } from "../middlewares/auth.js";

const app=express.Router();


app.post ("/verify",adminLoginValidator(),validatehandler,adminLogin);
app.use(isAdmin)

app.get("/",getAdminData);

app.get("/logout",adminLogout);
app.get("/users",getAllusers);
app.get("/chats",getAllChats);
app.get("/messages",getAllMessages);
app.get("/stats",getDashboradStats); 


export default app;