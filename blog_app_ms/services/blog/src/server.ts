import express from "express";
import "dotenv/config"
import blogRoutes from "./routes/blog.js"
import cors from "cors"
import { createClient } from "redis";
const app = express()

const port = process.env.PORT 
app.use(express.json())
app.use(cors())

export const redisClient  = createClient({
    url:process.env.REDIS_URL
})

redisClient.connect().then(()=>{
    console.log("connected to redis");
    
}).catch(err=>{
    console.log(err);
    
})

app.use("/api/v1",blogRoutes)


app.listen(port, () => {
    console.log(`server started at port ${port}`);

}) 

 