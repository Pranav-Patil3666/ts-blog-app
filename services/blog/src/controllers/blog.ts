import TryCatch from "../utils/TryCatch.js";
import {sql} from "../utils/db.js"
import axios from "axios";

export const getAllBlogs = TryCatch(async(req,res)=>{

    const {searchQuery, category} = req.query;

    let blogs

    if(searchQuery && category){
        blogs= await sql `SELECT * FROM blogs 
        WHERE 
        (title ILIKE ${"%" + searchQuery  + "%"}
        OR 
        description ILIKE ${"%" + searchQuery + "%"})
        AND 
           category = ${category}  
        ORDER BY createdAt DESC`;
    }else if(searchQuery){
       blogs= await sql `SELECT * FROM blogs 
        WHERE 
        (title ILIKE ${"%" + searchQuery  + "%"}
        OR 
        description ILIKE ${"%" + searchQuery + "%"}) 
        ORDER BY createdAt DESC`;
    }else{
        blogs= await sql `SELECT * FROM blogs ORDER BY createdAt DESC`;
    }

    

    res.json(blogs);
});

export const getSingleBlog=TryCatch(async(req,res)=>{
    const blog= await sql `SELECT * FROM blogs WHERE id=${req.params.id}`;

    
    //but in blog we didnt save author data only id so we need to fetch author data from users table using the author id that we have in blogs table

    //You CANNOT do SQL JOIN across different databases/
    /*Approach 1: Backend-to-backend call (Recommended)
Flow:
Client → Blog Service → calls User Service → returns merged data

*/

   if(blog[0]){
     const {data} = await axios.get(
        `${process.env.USER_SERVICE}/api/users/user/${blog[0].author}`
    )
    return res.json({
        blog:blog[0],
        author:data
    });
   }

  return res.json({
    message:"No blog found with this id"
   });

    
})