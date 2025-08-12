import { Router } from "express";
import { getAllBlogs, getSingleBlog } from "../controllers/blog.js";

const router = Router()


router.get("/blogs/all",getAllBlogs)
router.get("/blogs/:id",getSingleBlog)

export default router