import mongoose from "mongoose"

const connectDb = ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI as string)
        console.log("db connection successful");
        
    } catch (error) {
        console.log(error);
        
    }

}

export default connectDb