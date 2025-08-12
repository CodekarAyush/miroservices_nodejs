import express from "express";
import "dotenv/config"
import connectDb from "./utils/db.js";
import { v2 as cloudinary } from "cloudinary";

import userRoutes from "./routes/user.js"
const app = express()

const port = process.env.PORT || 5000

cloudinary.config({
    api_key:process.env.CLOUD_API_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_API_SECRET
})
connectDb()
app.use(express.json())

app.use("/api/v1",userRoutes)

app.listen(port, () => {
    console.log(`server started at port ${port}`);

})