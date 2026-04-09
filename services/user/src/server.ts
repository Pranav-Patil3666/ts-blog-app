import express from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRoutes from './routes/user.js';
import {v2 as cloudinary} from 'cloudinary';


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.CLOUD_API_KEY!,
    api_secret: process.env.CLOUD_API_SECRET!
})

 //  ! or you can use as string -- as ts expects string but we know it will be there so we can use ! to tell ts that it will be there

const app =express();

connectDb();
const port = process.env.PORT

app.use(express.json());
app.use('/api/users',userRoutes);

app.listen(port,()=>{
    console.log(`User service is running on http://localhost:${port}`);
})