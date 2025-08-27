// import User  from "../models/UserModel.js";
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
// import {renameSync, unlinkSync} from "fs";

// const maxAge=3*24*60*60;

// const createToken=(email,userId)=>{
//     return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge});
// }

// export const signup=async(req,res,next)=>{
//     try{
//         const {email,password}=req.body;
//         if(!email || !password){
//             return res.status(400).send("Email and Password are required");
//         }
//         const user=await User.create({email,password});
//         res.cookie("jwt",createToken(email,user.id),{
//             maxAge,
//             secure:true,
//             sameSite:"None",
//         })

//         return res.status(201).json({
//             user:{
//                 id:user._id,
//                 email:user.email,
//                 // firstName:user.firstName,
//                 // lastName:user.lastName,
//                 // color:user.color,
//                 // image:user.image,
//                 profileSetup:user.profileSetup,
//             }
//         })
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).send("Internal server error");
//     }
// }

// export const login=async(req,res,next)=>{
//     try{
//         const {email,password}=req.body;
//         if(!email || !password){
//             return res.status(400).send("Email and Password are required");
//         }
//         const user=await User.findOne({email});
//         if(!user){
//             return res.status(404).send("User does not exist");
//         }
//         const auth= await bcrypt.compare(password,user.password);
//         if(!auth){
//             return res.status(400).send("invalid credentials");
//         }
//         res.cookie("jwt",createToken(email,user.id),{
//             maxAge,
//             secure:true,
//             sameSite:"None",
//         })

//         return res.status(200).json({
//             user:{
//                 id:user._id,
//                 email:user.email,
//                 firstName:user.firstName,
//                 lastName:user.lastName,
//                 color:user.color,
//                 image:user.image,
//                 profileSetup:user.profileSetup,
//             }
//         })
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).send("Internal server error");
//     }
// }

// export const getUserInfo=async(req,res,next)=>{
//     try{
//         const userData=await User.findById(req.userId);
//         if(!userData){
//             return res.status(404).send("User not found");
//         }
//         return res.status(200).json({
//                 id:userData._id,
//                 email:userData.email,
//                 firstName:userData.firstName,
//                 lastName:userData.lastName,
//                 color:userData.color,
//                 image:userData.image,
//                 profileSetup:userData.profileSetup,
//         });
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).send("Internal server error");
//     }
// }

// export const updateProfile=async(req,res,next)=>{
//     try{
//         const {userId}=req;
//         const {firstName,lastName,color}=req.body;
//         if(!firstName || !lastName){
//             return res.status(400).send("All fields are required");
//         }
//         const userData=await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new:true,runValidators:true});
//         if(!userData){
//             return res.status(404).send("User not found");
//         }
//         return res.status(200).json({
//                 id:userData._id,
//                 email:userData.email,
//                 firstName:userData.firstName,
//                 lastName:userData.lastName,
//                 color:userData.color,
//                 image:userData.image,
//                 profileSetup:userData.profileSetup,
//         });
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).send("Internal server error");
//     }
// }


// export const addProfileImage=async(req,res,next)=>{
//     try{
//         if(!req.file){
//             return res.status(400).send("File is required");
//         }
//         const date=Date.now();
//         let fileName="uploads/profiles"+date+req.file.originalname;
//         renameSync(req.file.path,fileName);

//         const updatedUser=await User.findByIdAndUpdate(
//             req.userId,  
//             {image:fileName},
//             {new:true,runValidators:true}
//         );

//         return res.status(200).json({
//                 image:updatedUser.image,
//         });
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).send("Internal server error");
//     }
// }

// export const removeProfileImage=async(req,res,next)=>{
//     try{
//         const {userId}=req;
//         const user=await User.findById(userId);
//         if(!user){
//             return res.status(400).send("User not found");
//         }
//         if(!user.image){
//             unlinkSync(user.image);
//         }
//         user.image="";
//         await user.save();
//         return res.status(200).send("Profile image removed successfully");
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).send("Internal server error");
//     }
// }

import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { renameSync, unlinkSync, existsSync, mkdirSync } from "fs";
import path from "path";

const maxAge = 3 * 24 * 60 * 60;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

// --- Improved Signup with existing user check and better cookies ---
export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send("Email is already registered.");
        }
        const user = await User.create({ email, password });
        res.cookie("jwt", createToken(email, user._id), {
            maxAge: maxAge * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: "strict",
        });
        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).send("Invalid email or password");
        }
        res.cookie("jwt", createToken(email, user._id), {
            maxAge: maxAge * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: "strict",
        });
        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.color,
                image: user.image,
                profileSetup: user.profileSetup,
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User not found");
        }
        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            color: userData.color,
            image: userData.image,
            profileSetup: userData.profileSetup,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

// --- No changes needed for updateProfile ---
export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).send("All fields are required");
        }
        const userData = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true });
        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            color: userData.color,
            image: userData.image,
            profileSetup: userData.profileSetup,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

// --- Corrected addProfileImage function ---
export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }
        const date = Date.now();
        const uploadsDir = "uploads";
        const profilesDir = path.join(uploadsDir, "profiles");

        // Ensure the directories exist
        if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);
        if (!existsSync(profilesDir)) mkdirSync(profilesDir);

        // FIXED: Added a path separator (/) and used path.join for safety
        let fileName = path.join("uploads", "profiles", date + req.file.originalname);
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            image: updatedUser.image,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

// --- Corrected removeProfileImage function ---
export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // FIXED: The logic was reversed. This now correctly checks IF an image exists before trying to delete it.
        if (user.image) {
            // Also check if the file physically exists before trying to delete
            if (existsSync(user.image)) {
                unlinkSync(user.image);
            }
        }

        user.image = null; // Use null instead of an empty string
        await user.save();
        return res.status(200).send("Profile image removed successfully");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
