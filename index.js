import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import { connectDB } from './dataBase/connectionDB.js'
import uesrRouter from './src/modules/user/user.router.js'
import taskRouter from './src/modules/task/task.router.js'
import { globalErrorHandling } from './src/utils/errorHandling.js'
import authRouter from './src/modules/auth/auth.router.js'
import cors from 'cors'
const app = express()
const port = process.env.PORT || 5000
connectDB()

process.on('uncaughtException', ()=>{
    console.log("Uncaught Exception")
})

app.use(cors())
app.use(express.json())
app.use("/user", uesrRouter);
app.use("/auth", authRouter)
app.use("/task", taskRouter)
app.use("*", (req, res, next)=>{
    return res.json({message: "In-valid Routing"})
})

app.use(globalErrorHandling)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

process.on('unhandledRejection', (error)=>{
    console.log("Eroor", error)
})

