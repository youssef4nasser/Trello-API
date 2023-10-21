import express from 'express'
import { auth } from '../../middleware/middleWare.js';
import { changePassword, deleteUser, logOut, softDelete, upDateUser, userCoverImage, userProfileImage } from '../user/user.controller.js'
import { vaildation } from '../../middleware/validation.js';
import { validationUpdateUser, validationChangePassword, validationToken } from './validationUser.js';
import { fileUpload, fileValidation } from '../../utils/multer.cloud.js';
const uesrRouter = express.Router();

uesrRouter.put("/changePassword", auth, vaildation(validationChangePassword), changePassword)
uesrRouter.put("/updateuser", auth, vaildation(validationUpdateUser), upDateUser)
uesrRouter.delete("/deleteuser", auth, vaildation(validationToken), deleteUser)
uesrRouter.put("/softDelete", auth, vaildation(validationToken), softDelete)
uesrRouter.patch("/logOut", auth, vaildation(validationToken), logOut)

uesrRouter.patch("/profile/image", auth, fileUpload(fileValidation.image).single('image'), userProfileImage)
uesrRouter.patch("/profile/image/cover", auth, fileUpload(fileValidation.image).array('image', 5), userCoverImage)


export default uesrRouter
