import express from "express";
import "dotenv/config"
import { sql } from "./utils/db";
import blogRoutes from "./routes/blog"
import { v2 as cloudinary  } from "cloudinary";

const app = express()

const port = process.env.PORT 

app.use(express.json())

cloudinary.config({
    api_key:process.env.CLOUD_API_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_API_SECRET
})

async function init() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS blogs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
        
        await sql`
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userId VARCHAR(255) NOT NULL,
            username TEXT NOT NULL,
            blogId VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
        
        await sql`
        CREATE TABLE IF NOT EXISTS savedblogs (
            id SERIAL PRIMARY KEY,
            userId VARCHAR(255) NOT NULL,
            blogId VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `

        console.log("database initialise successfully");
        
    } catch (error) {
        console.log(error);
    }
}


app.use("/api/v1",blogRoutes)


init().then(()=>{
app.listen(port, () => {
    console.log(`server started at port ${port}`);

})
})

