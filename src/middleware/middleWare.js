import { userModel } from "../../dataBase/models/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import jwt from "jsonwebtoken";

export const auth = asyncHandler(async (req, res, next)=>{
    const {token} = req.headers;
    if(!token.startsWith(process.env.TOKEN_BEARER)){
        return next(new Error("token is required or In-valid Bearer Key", {cause: 400}))
    }

    const splitToken = token.split(process.env.TOKEN_BEARER)[1]
    if(!splitToken){
        return next(new Error("token is required", {cause: 400}))
    }

    const decoded = jwt.verify(splitToken, process.env.TOKEN_SIGNATURE)
    if(!decoded?.id){
        return next(new Error("In-valid token payload", {cause: 400}))
    }

    const user = await userModel.findById(decoded.id)
    if(!user){
        return next(new Error("User not found", {cause: 404}))
    }
    if(user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
        return next(new Error("User is deleted, logIn First"))
    }
    if(user.isOnline == false ){
        return next(new Error("User is offline, logIn First"))
    }
    req.user = user;
    return next()
})
