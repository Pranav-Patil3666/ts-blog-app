import mongoose, {Document,Schema}from 'mongoose';

export interface IUser extends mongoose.Document{
    name: string,
    email: string,
    image:string,
    instagram?: string,
    facebook?: string,
    linkedn?: string,
    bio?: string
}

const schema: Schema<IUser> = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    instagram: String,
    facebook: String,
    linkedn: String,
    bio: String
},{
    timestamps:true,
});

const User= mongoose.model<IUser>("User",schema);

export default User;
