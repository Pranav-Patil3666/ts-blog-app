import type {AuthenticatedRequest} from "../middlewares/isAuth.js";
import getBuffer from '../utils/dataUri.js'
import TryCatch from "../utils/TryCatch.js";
import cloudinary from 'cloudinary'; 
import {sql} from "../utils/db.js"


export const createBlog= TryCatch(async(req: AuthenticatedRequest,res)=>{
    
    const {title,description,blogContent,Category}=req.body;
    
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

  const cloud= await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder:"blogs"
  })

  const result= await sql `INSERT INTO blogs(title,description,blogContent,image,category,author)
  VALUES (${title}, ${description}, ${blogContent}, ${cloud.secure_url}, ${Category}, ${req.user?._id}) RETURNING * `;

  res.json({
    message:"Blog cretaed",
    blog: result[0]
  })

})