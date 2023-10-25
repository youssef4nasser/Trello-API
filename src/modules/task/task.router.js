import express from 'express'
import { addTask, attachmentToTask, deleteTask, getAllCreatedtasks, getAllLateTasks, getAllTasks, getAllTasksAssignToMe, getTasksAssignToAnyOne, updateTask } from './task.controller.js';
import { auth } from '../../middleware/middleWare.js';
import { vaildation } from '../../middleware/validation.js';
import { validationAddTask, validationDeleteTask, validationGetTasksAssignToAnyOne, validationUpdateTask } from './validationTask.js';
import { fileUpload, fileValidation } from '../../utils/multer.cloud.js';

const taskRouter = express.Router();

taskRouter.post("/addtask", auth, vaildation(validationAddTask), addTask)
taskRouter.get("/getalltasks", getAllTasks)
taskRouter.get("/getAllCreatedtasks", auth, getAllCreatedtasks)
taskRouter.get("/getAllTasksAssignToMe", auth, getAllTasksAssignToMe)
taskRouter.get("/getAllLateTasks", auth, getAllLateTasks)
taskRouter.get("/getTasksAssignToAnyOne/:id", auth, vaildation(validationGetTasksAssignToAnyOne), getTasksAssignToAnyOne)
taskRouter.put("/updatetask/:id", auth, vaildation(validationUpdateTask), updateTask)
taskRouter.delete("/deletetask/:id", vaildation(validationDeleteTask), auth, deleteTask)

taskRouter.patch("/attachmentToTask/:id", auth, fileUpload(fileValidation.image).array('image', 10), attachmentToTask)

export default taskRouter
