import type {Request, Response} from 'express';
import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import TryCatch from '../utils/TryCatch.js';
import type { AuthenticatedRequest } from '../middleware/isAuth.js';
import getBuffer from '../utils/dataUri.js';
import {v2 as cloudinary} from 'cloudinary';
import {oauth2client} from "../utils/GoogleConfig.js"
import axios from 'axios';



export const loginUser= async(req: Request,res: Response)=>{
    try{
        
        const {code}=req.body
        if(!code){
            res.status(400).json({
                message:"Authorization code is required"
            });
            return;
        }

        const googleRes= await oauth2client.getToken(code)

        oauth2client.setCredentials(googleRes.tokens)

        const userRes= await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)



        const {email,name,picture}=userRes.data;

        let user= await User.findOne({email});
        if(!user){
            user= await User.create({email,name,image:picture});
        }

        const token = jwt.sign({user}, process.env.JWT_SECRET as string,{expiresIn:"5d"});

        res.status(200).json({
            message:"Login successful",
            token,
            user
        })

    }catch(error: any){
        res.status(500).json({message: error.message})
    }
}

//we always have to define that req is of type request,and also we r using try-catch , so instead of typing it every single time - we can make a function for that in Utils 



export const myProfile= TryCatch(async(req: AuthenticatedRequest,res) =>{
    const user = req.user;

    res.json(user);

})

export const getUserProfile= TryCatch(async(req:Request,res:Response)=>{
    
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404).json({message:"User not found"});
        return;
    }
    res.json(user);
})

export const updateProfile= TryCatch(async(req: AuthenticatedRequest,res)=>{

    const {name,instagram,facebook, linkedn, bio}=req.body;

    const user = await User.findByIdAndUpdate(req.user?._id,{
        name,instagram,facebook, linkedn, bio
    },{new:true
    });

    //now new token to generate - why because we have updated the user and in the token we have the user details - so we need to update that as well

    const token = jwt.sign({user}, process.env.JWT_SECRET as string,{expiresIn:"5d"});

    res.json({
        message:"Profile updated successfully",
        user,
        token
    });

})


export const updateProfilePic= TryCatch(async(req:AuthenticatedRequest,res)=>{

    const file= req.file;

    if(!file){
        res.status(400).json({message:"No file uploaded"});
        return;
    }

    const fileBuffer= getBuffer(file);

    if(!fileBuffer || !fileBuffer.content){
        res.status(400).json({message:"Invalid file"});
        return;
  }

    const cloud= await cloudinary.uploader.upload(fileBuffer.content,{
        folder: "blogs",
    })

    const user = await User.findByIdAndUpdate(req.user?._id,{
        image: cloud.secure_url
    },{new:true})

    const token = jwt.sign({user}, process.env.JWT_SECRET as string,{expiresIn:"5d"});

    res.json({
        message:"Profile image updated successfully",
        user,
        token
    });
})