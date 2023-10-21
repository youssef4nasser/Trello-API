
import express from 'express'
import { addTask, attachmentToTask, deleteTask, getAllCreatedtasks, getAllLateTasks, getAllTasks, getAllTasksAssignToMe, getTasksAssignToAnyOne, updateTask } from './task.controller.js';
import { auth } from '../../middleware/middleWare.js';
import { vaildation } from '../../middleware/validation.js';
import { validationAddTask, validationDeleteTask, validationGetTasksAssignToAnyOne, validationTokenTasks, validationUpdateTask } from './validationTask.js';
import { fileUpload, fileValidation } from '../../utils/multer.cloud.js';
const taskRouter = express.Router();

taskRouter.post("/addtask", auth, vaildation(validationAddTask), addTask)
taskRouter.get("/getalltasks", vaildation(validationTokenTasks), getAllTasks)
taskRouter.get("/getAllCreatedtasks", auth, vaildation(validationTokenTasks), getAllCreatedtasks)
taskRouter.get("/getAllTasksAssignToMe", auth, vaildation(validationTokenTasks), getAllTasksAssignToMe)
taskRouter.get("/getAllLateTasks", auth, vaildation(validationTokenTasks), getAllLateTasks)
taskRouter.get("/getTasksAssignToAnyOne/:id", auth, vaildation(validationGetTasksAssignToAnyOne), getTasksAssignToAnyOne)
taskRouter.put("/updatetask/:id", auth, vaildation(validationUpdateTask), updateTask)
taskRouter.delete("/deletetask/:id", vaildation(validationDeleteTask), auth, deleteTask)

taskRouter.patch("/attachmentToTask/:id", auth, fileUpload(fileValidation.image).array('image', 10), attachmentToTask)

export default taskRouter

