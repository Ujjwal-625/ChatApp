import express from "express";

import {login,newUser,logout,getProfile,searchUser} from "../controllers/user.js"
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";


const app =express.Router();

app.post("/login",login)
app.post("/new",singleAvatar,newUser);  

//user should logged in to access the below routes
// so create a middleware to check for the logged in user

app.use(isAuthenticated);// now all the routes below work only when you are logged in
app.get("/me",getProfile);
app.get("/logout",logout);
app.get("/search",searchUser);

export default app;