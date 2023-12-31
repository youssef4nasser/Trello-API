import Joi from "joi";

export const validationChangePassword = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
      'any.only': 'Confirm Password must match the New Password',
    }).required(),
}).required()

export const validationUpdateUser = Joi.object({
    userName: Joi.string().alphanum().min(3).max(20).required(),
    age: Joi.number().integer().min(18).max(95).required(),
});
