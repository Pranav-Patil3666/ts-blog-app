import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import type { IUser } from "../model/User.js";

export interface AuthenticatedRequest extends Request{
    user?: IUser | null;
}

// Define your JWT structure
interface AuthPayload {  //This tells TypeScript: “My JWT contains a user field with this structure.”
user: IUser;
}

/* WITHOUT it
const decoded = jwt.verify(token, secret);

TypeScript infers:
decoded: string | JwtPayload

And JwtPayload is basically:

interface JwtPayload {
  iat?: number;
  exp?: number;
}

👉 No user field*/

export const isAuth= async(
    req:AuthenticatedRequest, // this is a custom request because typescript does not know that we will be adding a user property to the request object, so we need to define a custom request type that extends the original request type and adds the user property to it
    res: Response, 
    next: NextFunction) :Promise<void>=>{   //promise void is used here because this function does not return anything, it just calls the next function if the user is authenticated, and promise next is used here because this function is asynchronous and we want to wait for the authentication process to complete before calling the next function'

    try{

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
             res.status(401).json({
                message:"Please login : no auth header"
            })
            return;
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            res.status(401).json({ message: "Invalid auth header" });
            return;
        }

        const token = parts[1];
        if (!token) {
            res.status(401).json({ message: "Token missing" });
            return;
            }

        const decoded=jwt.verify(token, process.env.JWT_SECRET as string) ;
        
        if(typeof decoded === "string"){  //it can't be a string because we are expecting an object with a user property, so if it is a string, it means that the token is invalid
            res.status(401).json({
                message:"Invalid token"
            })
            return;
        }

       const payload= decoded as AuthPayload; // we are asserting that the decoded token is of type AuthPayload, which is an object with a user property
      
       req.user = payload.user; // we are adding the user property to the request object, so that we can access it in the next middleware or route handler
       next();


    }catch(error:any){
        console.log("JWT verification error:",error);

        res.status(401).json({message: "Unauthorized"});
    }

}