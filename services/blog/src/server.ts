import dotenv from "dotenv";
dotenv.config();
import express from "express";
import blogRoutes from "./routes/blog.js";
import {createClient} from "redis";

const app=express();

const PORT=process.env.PORT 

if(!process.env.REDIS_URL){
    throw new Error("Redis URL is not defined")
}
export const redisClient= createClient({
    url: process.env.REDIS_URL ,
});

redisClient.connect().then(()=>console.log("Connected to redis")).catch(console.error);

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/v1", blogRoutes);

app.listen(PORT,()=>{
    console.log(`Blog service is running on  http://localhost:${PORT}`);
})