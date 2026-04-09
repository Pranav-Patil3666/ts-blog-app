import mongoose from 'mongoose';

const connectDb= async() =>{
    try{
        mongoose.connect(process.env.MONGO_URI as string,{
            dbName: "blog_user_service"
        })

        console.log("Connected to MongoDB")
    }catch(error){
            console.log(error);
    } 
};

export default connectDb;