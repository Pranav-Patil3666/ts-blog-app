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

export const updateBlog= TryCatch(async(req: AuthenticatedRequest,res)=>{

  const {id}=req.params;

  const {title,description,blogContent,Category}=req.body;

  const file=req.file

  const blog = await sql`SELECT * FROM blogs where id=${id}`;
  const blogData = blog[0];       //sql (Neon) returns an array ,Even if no rows found → returns: []

  if(!blogData){                
    res.status(404).json({
      message:"Blog id is invalid"
    });
    return;
  }

  if(blogData.author !== req.user?._id){
    res.status(401).json({
      message:"You are not author of this blog"
    })
    return;
  }

  let imageUrl= blogData.image
  if(file){
    const fileBuffer= getBuffer(file)

      if(!fileBuffer || !fileBuffer.content){
        res.status(400).json({message:"Invalid file"});
        return;
    }

    const cloud= await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder:"blogs"
     })

    imageUrl= cloud.secure_url;
  }

  const updatedBlog= await sql` UPDATE blogs SET 
  title=${title ?? blogData.title},
  description=${description ?? blogData.description},
  blogcontent=${blogContent ?? blogData.blogcontent},
  image=${imageUrl},
  category=${Category ?? blogData.category}
  WHERE id=${id} RETURNING * `;
  
  res.json({
    message:"Blog updated",
    blog: updatedBlog[0]
  })
  
})

export const deleteBlog =TryCatch(async(req:AuthenticatedRequest,res)=>{

  const blog= await sql`SELECT * FROM blogs WHERE id=${req.params.id}`;

  const blogData = blog[0];       //sql (Neon) returns an array ,Even if no rows found → returns: []

  if(!blogData){                
    res.status(404).json({
      message:"Blog id is invalid"
    });
    return;
  }

  if(blogData.author !== req.user?._id){
    res.status(401).json({
      message:"You are not author of this blog"
    })
    return;
  }

  await sql`DELETE FROM savedblogs WHERE blogid=${req.params.id} `;
  await sql`DELETE FROM comment WHERE blogid=${req.params.id} `;
  await sql`DELETE FROM blogs WHERE id=${req.params.id}`;

  res.json({
    message: "Blog deleted"
  })
})