import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { sql } from './utils/db.js';



const app = express();

const port = process.env.PORT || 5001;

async function initDB(){
    try{

        await sql`
            CREATE TABLE IF NOT EXISTS blogs(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                Description VARCHAR(255) NOT NULL,
                blogcontent TEXT NOT NULL,
                image VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS comment(
                id SERIAL PRIMARY KEY,
                comment VARCHAR(255) NOT NULL,
                userID VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                blogid VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS savedblogs(
                id SERIAL PRIMARY KEY,
                userid VARCHAR(255) NOT NULL,
                blogid VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialised succesfully");
    }catch(error:any){
        console.log("DB init error", error);
    }
}

initDB().then(()=>{
        app.listen(port, ()=>{
            console.log(`Author service is running on port ${port}`);
        })

})

