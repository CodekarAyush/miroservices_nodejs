import { Response, Request } from "express"
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import TryCatch from "../utils/TryCatch.js"
import { AuthenticatedRequest } from "../middleware/isAuth.js"
import getBuffer from "../utils/dataUri.js"

import { v2 as cloudinary } from "cloudinary"

export const login = TryCatch(async (req, res) => {
    const { email, name, image } = req.body

    let user = await User.findOne({ email })

    if (!user) {
        user = await User.create({
            name,
            email,
            image
        })

    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '5d'
    })

    res.status(200).json({
        message: "login successfull",
        token,
        user
    })

})


export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user
    res.json(user)

})

export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({
            message: "no user with this id found"
        })
    }
    res.status(200).json({
        user
    })
})


export const updateUser = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body
    const user = await User.findByIdAndUpdate(req.user?._id, {
        name,
        bio,
        linkedin,
        facebook,
        instagram
    }, {
        new: true
    })

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '5d'
    })

    res.json({
        message: "user updated",
        token,
        user
    })
})


export const updateProfilePic = TryCatch(async (req: AuthenticatedRequest, res) => {
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
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    })
    const user = await User.findByIdAndUpdate(req.user?._id, {
        image: cloud.secure_url
    }, {
        new: true
    })

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '5d'
    })

    res.json({
        message: "user updated",
        token,
        user
    })
}) 