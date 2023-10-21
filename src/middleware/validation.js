

export const vaildation = (joiSchema) =>{
    return (req, res, next)=>{
        const allDataFromAllMethods = {...req.body, ...req.params, ...req.query}
        const validationResult = joiSchema.validate(allDataFromAllMethods, {abortEarly: false})
        if(validationResult.error){
            return res.status(400).json({message: "validation Error", Err: validationResult.error.details})
        }
        next()
    }
}