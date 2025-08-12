import { Router } from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import { createBlog, deleteBlog, updateBlog } from "../controller/blog.js";

const router = Router()
router.post("/blog/new",isAuth,uploadFile,createBlog)
router.post("/blog/:id",isAuth,uploadFile,updateBlog)
router.delete("/blog/:id",isAuth,deleteBlog)


export default router