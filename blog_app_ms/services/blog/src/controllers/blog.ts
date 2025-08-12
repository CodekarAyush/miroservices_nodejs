import axios from "axios";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { redisClient } from "../server.js";
import { json } from "express";

export const getAllBlogs = TryCatch(async (req, res) => {
    const { searchQuery="", category="" } = req.query
    let blogs
const cacheKey = `blogs:${searchQuery}:${category}`

const cached = await redisClient.get(cacheKey)

if (cached) {
    console.log("serving from redis");
    res.json(JSON.parse(cached))
    return
}
    if (searchQuery && category) {
        blogs = await sql`
    SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND category = ${category} ORDER BY created_at DESC
    `
    }
    else if (searchQuery) {
        blogs = await sql`
    SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"})  ORDER BY created_at DESC
    `
    }
    else {
        blogs = await sql`
    SELECT * FROM blogs ORDER BY created_at DESC
    `
    }
await redisClient.set(cacheKey,JSON.stringify(blogs),{
    EX:3600
})
    res.status(200).json(blogs)

})


export const getSingleBlog = TryCatch(async (req, res) => {
    const blog = await sql`
        SELECT * FROM blogs WHERE id = ${req.params.id}
    `;

    if (!blog.length) {
        return res.status(404).json({ message: "Blog not found" });
    }

    const authorResponse = await axios.get(
        `${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`
    );

    res.status(200).json({
        blog: blog[0],
        author: authorResponse.data
    });
});
