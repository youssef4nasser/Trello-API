import { vaildation } from "../../middleware/validation.js";
import { confirmEmail, logIn, newConfirmEmail, signUp, unsubscribeEmail } from "./auth.controller.js";

import express from 'express'
import { validationEmail, validationLogin, validationSignup } from "./validation.js";
const authRouter = express.Router();

authRouter.post("/signup", vaildation(validationSignup), signUp)
authRouter.post("/login", vaildation(validationLogin), logIn)
authRouter.get("/confirmemail/:token", vaildation(validationEmail), confirmEmail)
authRouter.get("/newconfirmemail/:token", vaildation(validationEmail), newConfirmEmail)
authRouter.get("/unsubscribeEmail/:token", vaildation(validationEmail), unsubscribeEmail)

export default authRouter

