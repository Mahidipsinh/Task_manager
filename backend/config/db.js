import mongoose from "mongoose";

export const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO,{});
        console.log("mongodb connected");
    } catch (error) {
        console.log(error);
        process.exit(1);        
    }
}