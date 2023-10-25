import { userModel } from "../../../dataBase/models/user.model.js";
import { sendEmail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { htmlCode } from "../../utils/htmlEmailCode.js";

export const signUp = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, age, gender, phone } = req.body;
        const chekUser = await userModel.findOne({ 
            $or: [
                { userName },
                { email }
            ]
         })
        if (chekUser) {
            if(chekUser.email == email) return next(new Error("email already exists"));
            if(chekUser.userName == userName) return next(new Error("userName already exists"))
        }

        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUED));
        const user = await userModel.create({ userName, email, password: hashPassword, age, gender, phone });

        const token = jwt.sign({id: user._id, email: user.email}, process.env.EMAIL_SIGNATURE, {expiresIn: 60 *  5})
        const tokenUnsubscribe = jwt.sign({id: user._id, email: user.email}, process.env.EMAIL_SIGNATURE, {expiresIn: 60 *  60})
        const nweConfirmEmailToken = jwt.sign({id: user._id, email: user.email}, process.env.EMAIL_SIGNATURE, {expiresIn: 60 *  60 * 24 * 30})

        const link = `${req.protocol}://${req.headers.host}/auth/confirmemail/${token}`
        const RequestNewEmailLink = `${req.protocol}://${req.headers.host}/auth/newconfirmemail/${nweConfirmEmailToken}`
        const unsubscribeEmailLink = `${req.protocol}://${req.headers.host}/auth/unsubscribeEmail/${tokenUnsubscribe}`
        const html = htmlCode(link, RequestNewEmailLink, unsubscribeEmailLink);

        await sendEmail({to:email, subject: "Confirm Email Saraha", html})
        return res.json({ message: "User created successfully" })
    }
)

export const confirmEmail = asyncHandler(
    async (req, res, next)=>{
        const {token} = req.params;
        const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE)
        const user = await userModel.findByIdAndUpdate(decoded.id, {confirmEmail: true})
        return user ? res.json({message: "success"}) : next(new Error("Not register account", {cause: 404}))
    }
)

export const newConfirmEmail = asyncHandler(
    async (req, res, next)=>{
        const {token} = req.params;
        const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE)
        const user = await userModel.findById(decoded.id)
        if(!user){
            return next(new Error("User is ont exist", {cause: 409}))
        }
        if(user.confirmEmail){
            return next(new Error("User is already confirm email", {cause: 409}))
        }

        const newToken = jwt.sign({id: user._id, email: user.email}, process.env.EMAIL_SIGNATURE, {expiresIn: 60 *  2})
        const html = `<a href="${req.protocol}://${req.headers.host}/auth/confirmemail/${newToken}">Click Here To Confirm your Email</a>`
        await sendEmail({to:user.email, subject: "Confirm Email Saraha", html})
        return res.json({message: "success chek your Email now"})
    }
)

export const unsubscribeEmail = asyncHandler(
    async (req, res, next)=>{
        const {token} = req.params;
        const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE)
        const user = await userModel.findById(decoded.id)
        if(!user){
            return next(new Error("User is ont exist", {cause: 409}))
        } 
        if(user.confirmEmail == true){
            return next(new Error("User is already confirm email", {cause: 409}))
        }
        await userModel.deleteOne({ _id: decoded.id });
        return res.json({message: "success"})
    }
)

export const logIn = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password } = req.body;
        const user = await userModel.findOne({
            $or: [
                { userName },
                { email }
            ]
        })
        if (!user) {
            return next(new Error("User is ont exist"))
        }
        const match = bcrypt.compareSync(password, user.password)
        if (!match) {
            return next(new Error("Password incorrect"))
        }
        let token = jwt.sign({id: user._id, userName: user.userName, email: user.email}, process.env.TOKEN_SIGNATURE)
        await userModel.updateOne({ _id: user._id }, { isOnline: true, isDeleted: false });
        return res.status(200).json({ message: "success", token})
    }
)

export const forgetPassword = asyncHandler(
    async(req,res, next)=>{
        const { email } = req.body;
        let user = await userModel.findOne({ email })
        if(!user)return next(new Error("This email not register in our system",{cause: 409}))
        // generate token for reset password
        const token = jwt.sign({email}, process.env.EMAIL_SIGNATURE)
        // endpoint reset password
        const resetPassword = `${req.protocol}://${req.headers.host}/auth/resetPassword/${token}`
        // html email body
        const html = `<a href=${resetPassword}>resetPassword</a>`
        //send mail to user with link for change password
        await sendEmail({to:email, subject: "Reset password saraha", html})
        return res.status(200).json({message:"check your email for reset password"})
    }
)

export const resetPassword = asyncHandler(
    async(req,res,next)=>{
        const token = req.params.token;
        const { newPassword } = req.body;
        
        const decodeToken = jwt.verify(token, process.env.EMAIL_SIGNATURE);

        await userModel.findOneAndUpdate({email: decodeToken.email},
              {password: bcrypt.hashSync(newPassword)})

        return res.status(200).json({message:"success"})
    }
)