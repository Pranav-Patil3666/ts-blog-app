
import TryCatch from "../utils/TryCatch.js";
import {sql} from "../utils/db.js"
import axios from "axios";
import {redisClient} from "../server.js";


//in this redis implemented
export const getAllBlogs = TryCatch(async(req,res)=>{

    const {searchQuery="", category=""} = req.query;

    const cacheKey= `blogs:${searchQuery}:${category}`;
    
    const cached= await redisClient.get(cacheKey)
    if(cached){
        console.log("Serving from Redis Cache");
        res.json(JSON.parse(cached));   //This converts:string → object, as in redis we store as string, correct JSON structure
        return;
    }
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
    }else if(category){
        blogs= await sql `SELECT * FROM blogs 
        WHERE 
        category = ${category}
        ORDER BY createdAt DESC`;
    }
    else{
        blogs= await sql `SELECT * FROM blogs ORDER BY createdAt DESC`;
    }

    console.log("Serving data from DB")

    //once db se data liya toh redisClient mein save kr
    await redisClient.set(cacheKey, JSON.stringify(blogs),{EX: 3600})

    res.json(blogs);
});

export const getSingleBlog=TryCatch(async(req,res)=>{
    
    const blogid= req.params.id;
    const cacheKey= `blog:${blogid}`

    const cached = await redisClient.get(cacheKey)
    if(cached){
        console.log("data coming from Redis ")
        res.json(JSON.parse(cached))
        return
    }

    
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
    console.log("Service coming from DB")
    
    const responseData= {blog:blog[0],author:data};
    await redisClient.set(cacheKey, JSON.stringify(responseData), {EX: 10})
    
    return res.json({
        blog:blog[0],
        author:data
    });
   }

  return res.json({
    message:"No blog found with this id"
   });

    
})