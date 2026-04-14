import type {AuthenticatedRequest} from "../middlewares/isAuth.js";
import getBuffer from '../utils/dataUri.js'
import TryCatch from "../utils/TryCatch.js";
import cloudinary from 'cloudinary'; 
import {sql} from "../utils/db.js"
import {invalidateCacheJob} from "../utils/rabbitmq.js"


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

  //INAVLIDATING CACHE
  await invalidateCacheJob(["blogs:*"]);

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

  //INAVLIDATING CACHE
  await invalidateCacheJob(["blogs:*", `blog:${id}`]);
  
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

    //INAVLIDATING CACHE
  await invalidateCacheJob(["blogs:*", `blog:${req.params.id}`]);

  res.json({
    message: "Blog deleted"
  })
})

export const addComment = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { comment, blogid } = req.body;

    if (!comment || !blogid) {
      res.status(400).json({ message: "Comment and blog ID are required" });
      return;
    }

    const user = req.user;

    const result = await sql`
      INSERT INTO comment (comment, userid, username, blogid)
      VALUES (${comment}, ${user?._id}, ${user?.name}, ${String(blogid)})
      RETURNING *
    `;

    res.status(201).json({
      message: "Comment added successfully",
      comment: result[0],
    });
  }
);


export const getComments = TryCatch(
  async (req, res) => {
    const { blogid } = req.params;

    if (!blogid) {
      res.status(400).json({ message: "Blog ID is required" });
      return;
    }

    const comments = await sql`
      SELECT * FROM comment
      WHERE blogid = ${String(blogid)}
      ORDER BY createdAt DESC
    `;

    res.json(comments);
  }
);

export const saveBlog = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { blogid } = req.body;

    if (!blogid) {
      res.status(400).json({ message: "Blog ID is required" });
      return;
    }

    const user = req.user;

    // prevent duplicate saves
    const existing = await sql`
      SELECT * FROM savedblogs
      WHERE userid = ${user?._id} AND blogid = ${String(blogid)}
    `;

    if (existing.length > 0) {
      res.status(400).json({ message: "Blog already saved" });
      return;
    }

    const result = await sql`
      INSERT INTO savedblogs (userid, blogid)
      VALUES (${user?._id}, ${String(blogid)})
      RETURNING *
    `;

    res.status(201).json({
      message: "Blog saved successfully",
      saved: result[0],
    });
  }
);


export const getSavedBlogs = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    const saved = await sql`
      SELECT b.*
      FROM savedblogs s
      JOIN blogs b ON b.id = s.blogid::int
      WHERE s.userid = ${user?._id}
      ORDER BY s.createdAt DESC
    `;

    res.json(saved);
  }
);