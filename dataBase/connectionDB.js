

import mongoose from "mongoose";

export const connectDB = async () =>{
    return await mongoose.connect(process.env.DB_ONLINE).then(()=>{
        console.log("connected to DB")
    }).catch((err)=>{
        console.log("fail to connected to DB", err)
    })
}