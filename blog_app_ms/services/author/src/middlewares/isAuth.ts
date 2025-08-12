import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
export interface IUser  extends Document {
    _id:string,
    name: string,
    email: string,
    image: string,
    instagram: string,
    facebook: string,
    linkedin: string,
    bio: string
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null,
      file?: any; 
}
export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({
                message: "Please login -no auth header"
            })
            return
        }
        const token = authHeader.split(" ")[1]
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({
                message: "Invalid token"
            })
            return
        }

        req.user = decodedValue.user
        next()
    } catch (error) {
        console.log("jwt verification error", error);
        res.status(401).json({
            message: "please login "
        })

    }
}