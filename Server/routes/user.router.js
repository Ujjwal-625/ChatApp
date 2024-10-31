import express from "express";

import {login,newUser,logout,getProfile,searchUser, sendRequest, acceptRequest, getAllNotifications, getMyFriends} from "../controllers/user.js"
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidator, validatehandler, loginValidator, sendRequestValidator, acceptRequestValidator } from "../lib/validators.js";


const app =express.Router();
//loginValidator() and regitster Validator return array
app.post("/login",loginValidator(),validatehandler,login)
app.post("/new",singleAvatar,registerValidator(),validatehandler,newUser);  

//user should logged in to access the below routes
// so create a middleware to check for the logged in user

app.use(isAuthenticated);// now all the routes below work only when you are logged in
app.get("/me",getProfile);
app.get("/logout",logout);
app.get("/search",searchUser);
app.put("/sendrequest",sendRequestValidator(),validatehandler,sendRequest)
app.put("/acceptrequest",acceptRequestValidator(),validatehandler,acceptRequest)
app.get("/notifications",getAllNotifications)
app.get("/friends",getMyFriends)

export default app;