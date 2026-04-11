import dotenv from "dotenv";
dotenv.config();
import express from "express";
import blogRoutes from "./routes/blog.js";

const app=express();

const PORT=process.env.PORT 

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/v1", blogRoutes);

app.listen(PORT,()=>{
    console.log(`Blog service is running on  http://localhost:${PORT}`);
})