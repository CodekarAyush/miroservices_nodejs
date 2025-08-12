import { Router } from "express";
import { getUserProfile, login, myProfile, updateProfilePic, updateUser } from "../controller/user";
import { isAuth } from "../middleware/isAuth";
import uploadFile from "../middleware/multer";

const router = Router()
router.post("/login",login)
router.get("/me",isAuth,myProfile)
router.get("/user/:id",getUserProfile)
router.post("/user/update",isAuth,updateUser)
router.post("/user/update/pic",isAuth,uploadFile,updateProfilePic)

export default router