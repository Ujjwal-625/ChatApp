import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true, 
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    bio:{
        type:String,
        default:"Enjoying Life"
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }

},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
})

export const UserModel=mongoose.models.UserModel || mongoose.model("UserModel",userSchema);