import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import { v2 as cloudinary } from "cloudinary";

export const createBlog = TryCatch(async (req:AuthenticatedRequest,res)=>{
const {title , description, blogcontent , category} = req.body
const file = req.file 
    if (!file) {
        res.status(400).json({
            message: "no file to upload"
        })
        return
    }
    const fileBuffer = getBuffer(file)
    if (!fileBuffer || !fileBuffer.content) {

        res.status(400).json({
            message: "failed to generate file buffer "
        })
        return
    }

    const cloud  = await cloudinary.uploader.upload(fileBuffer.content,{
folder:"blogs"
    })
    const result = await sql `
    INSERT INTO BLOGS (title , description , image , blogcontent , category , author) values 
    (${title}, ${description},${cloud.secure_url},${blogcontent}, ${category},${req.user?._id})
    RETURNING * 
    ` 
    res.status(200).json({
        message:"Blog created ",
        blog : result[0]
    })
})

export const updateBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, blogcontent, category } = req.body;
  const file = req.file;

  const rows = await sql`SELECT * FROM blogs WHERE id = ${id}`;
  const blogRow = rows[0];

  // agar blog nahi mila
  if (!blogRow) {
    return res.status(404).json({ message: "No blog with this id" });
  }

  // author check
  if (blogRow.author !== req.user?._id) {
    return res.status(401).json({ message: "Unauthorised activity!" });
  }

  // agar naya file aaya to upload kar ke imageUrl set karo
  let imageUrl = blogRow.image;
  if (file) {
    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
      return res.status(400).json({ message: "Failed to generate file buffer" });
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, { folder: "blogs" });
    imageUrl = cloud.secure_url;
  }

  const updatedRows = await sql`
    UPDATE blogs SET
      title = ${title ?? blogRow.title},
      description = ${description ?? blogRow.description},
      blogcontent = ${blogcontent ?? blogRow.blogcontent},
      category = ${category ?? blogRow.category},
      image = ${imageUrl}
    WHERE id = ${id}
    RETURNING *
  `;

  return res.json({
    message: "Blog updated",
    blog: updatedRows[0]
  });
});


export const deleteBlog = TryCatch(async (req:AuthenticatedRequest,res)=>{

  const rows = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;
  const blogRow = rows[0];

  // agar blog nahi mila
  if (!blogRow) {
    return res.status(404).json({ message: "No blog with this id" });
  }

  // author check
  if (blogRow.author !== req.user?._id) {
    return res.status(401).json({ message: "Unauthorised activity!" });
  }

  await sql`
  DELETE FROM savedblogs WHERE blogid= ${req.params.id}
  `
  await sql`
  DELETE FROM savedblogs WHERE blogid= ${req.params.id}
  `
    await sql`
  DELETE FROM blogs WHERE id= ${req.params.id}
  `
  res.status(200).json({
    message:"blog deleted "
  })
})