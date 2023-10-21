import Joi from "joi";

export const validationSignup = Joi.object({
    userName: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: {
            allow: ["com", "net", "org", "eg", "me", "co", "io"],
         },
    }).required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    age: Joi.number().min(18).max(90).integer().positive().required(),
    gender: Joi.string().valid('male', 'female').required(),
    phone: Joi.string().required(),

}).required()

export const validationLogin = Joi.object({
    userName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
}).required().or('userName', 'email') // يجب إدخال userName أو email على الأقل.
.messages({
    'any.required': 'Please enter your userName or email',
});

export const validationEmail = Joi.object({
    token: Joi.string().required(),
})