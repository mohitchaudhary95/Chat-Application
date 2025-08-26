import User  from "../models/UserModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const maxAge=3*24*60*60;

const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge});
}

export const signup=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password are required");
        }
        const user=await User.create({email,password});
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None",
        })

        return res.status(201).json({
            user:{
                id:user._id,
                email:user.email,
                // firstName:user.firstName,
                // lastName:user.lastName,
                // color:user.color,
                // image:user.image,
                profileSetup:user.profileSetup,
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}

export const login=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password are required");
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).send("User does not exist");
        }
        const auth= await bcrypt.compare(password,user.password);
        if(!auth){
            return res.status(400).send("invalid credentials");
        }
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None",
        })

        return res.status(200).json({
            user:{
                id:user._id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                color:user.color,
                image:user.image,
                profileSetup:user.profileSetup,
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}

export const getUserInfo=async(req,res,next)=>{
    try{
        const userData=await user.findById(req.userId);
        if(!userData){
            return res.status(404).send("User not found");
        }
        return res.status(201).json({
                id:userData._id,
                email:userData.email,
                firstName:userData.firstName,
                lastName:userData.lastName,
                color:userData.color,
                image:userData.image,
                profileSetup:userData.profileSetup,
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}