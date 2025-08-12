import { NextFunction, RequestHandler, Response,Request } from "express";

const TryCatch  = (handler:RequestHandler):RequestHandler =>{
return async (req:Request,res:Response,next:NextFunction)=>{
    try {
        await handler (req,res,next)
    } catch (error:any) {
        console.log(error);
        
            res.status (500).json({
        message:error.message
    })
    }
}
}

export default TryCatch