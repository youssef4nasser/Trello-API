
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            return next(new Error(error))
        })
    }
}

export const globalErrorHandling = (error, req, res, next) => {
	process.env.MODE == "prod" ?
      		res.json({ errMsg: error.message,}) :
       		res.json({ errMsg: error.message, stack: error.stack})
}
