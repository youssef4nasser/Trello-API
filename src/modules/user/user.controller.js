import { userModel } from "../../../dataBase/models/user.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcrypt from 'bcryptjs'

export const changePassword = asyncHandler(
    async (req, res, next) =>{
        const {oldPassword, newPassword} = req.body;
        const {password, _id} = req.user;
        const match = bcrypt.compareSync(oldPassword, password)
        if (!match) {
            return next(new Error("Old Password incorrect"))
        }
        const hashPassword = bcrypt.hashSync(newPassword, 8);
        await userModel.updateOne({_id}, {password: hashPassword})
        return res.json({ message: "success" })
    }
)

export const upDateUser = asyncHandler(
    async (req, res, next) =>{
        const {userName, age} = req.body;
        const { _id } = req.user;
        await userModel.updateOne({_id}, {userName, age})
        return res.json({ message: "success" })
    }
)

export const deleteUser = asyncHandler(
    async (req, res, next) =>{
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
        const { _id } = req.user;
        await userModel.updateOne({_id}, {isDeleted: true})
        return res.json({ message: "success" })
    }
)

export const logOut = asyncHandler(
    async (req, res, next) =>{
        const { _id } = req.user;
        await userModel.updateOne({_id}, {isOnline: false})
        return res.json({ message: "success" })
    }
)

export const userProfileImage = asyncHandler(
    async (req, res, next) =>{
        // Upload the new image
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
              {folder: `user/${req.user._id}/profile`})
        
        // Destroy the old image
        if (req.user.profileImage) {
            await cloudinary.uploader.destroy(req.user.profileImage.public_id);
        }

        // Update the user's profile image
        await userModel.findByIdAndUpdate(
            req.user._id,
            {profileImage: {secure_url, public_id}},
            {new: true}
        )

        return res.json({message: "success"})
    }
)

export const userCoverImage = asyncHandler(
    async (req, res, next) =>{
        const user = await userModel.findById(req.user._id)

        for (const file of req.files) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(file.path,
                  {folder: `user/${req.user._id}/cover`})
                user.coverImages.push({secure_url, public_id})
        }
        await user.save()
        return res.json({message: "success", user})
    }
)