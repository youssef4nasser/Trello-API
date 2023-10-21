import { userModel } from "../../../dataBase/models/user.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcrypt from 'bcryptjs'


export const changePassword = asyncHandler(
    async (req, res, next) =>{
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const {oldPassword, newPassword, cPassword} = req.body;
        // console.log(req.headers)
        const {password, _id} = req.user;
        const hashPassword = bcrypt.hashSync(newPassword, 8);
        const match = bcrypt.compareSync(oldPassword, password)
        if (!match) {
            return next(new Error("Old Password incorrect"))
        }
        await userModel.updateOne({_id}, {password: hashPassword})
        return res.json({ message: "success" })
    }
)

export const upDateUser = asyncHandler(
    async (req, res, next) =>{
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const {userName, age} = req.body;
        const { _id } = req.user;
        await userModel.updateOne({_id}, {userName, age})
        return res.json({ message: "success" })
    }
)

export const deleteUser = asyncHandler(
    async (req, res, next) =>{
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }

        for (const file of req.user.coverImages) {
            await cloudinary.uploader.destroy(file.public_id)
        }
        await cloudinary.uploader.destroy(req.user.profileImage.public_id)
        await userModel.deleteOne(req.user._id)
        return res.json({ message: "success"})
    }
)

export const softDelete = asyncHandler(
    async (req, res, next) =>{
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const { _id } = req.user;
        await userModel.updateOne({_id}, {isDeleted: true})
        return res.json({ message: "success" })
    }
)

export const logOut = asyncHandler(
    async (req, res, next) =>{
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const { _id } = req.user;
        await userModel.updateOne({_id}, {isOnline: false})
        return res.json({ message: "success" })
    }
)

export const userProfileImage = asyncHandler(
    async (req, res, next) =>{
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder: `user/${req.user._id}/profile`})
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {profileImage: {secure_url, public_id}},
        )
        return res.json({message: "success", flie: req.file})
    }
)

export const userCoverImage = asyncHandler(
    async (req, res, next) =>{

        const coverImages = []
        for (const file of req.files) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {folder: `user/${req.user._id}/cover`})
            coverImages.push( {secure_url, public_id})
        }
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {coverImages},
        )
        return res.json({message: "success", flie: req.files})
    }
)