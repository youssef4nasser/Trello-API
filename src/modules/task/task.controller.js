import { taskModel } from "../../../dataBase/models/task.model.js";
import { userModel } from "../../../dataBase/models/user.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addTask = asyncHandler(
    async (req, res, next) => {
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const { title, description, deadline, assignTo } = req.body;

        const userId = await userModel.findById(assignTo);
        if (!userId) {
          return next(new Error(`User with id ${assignTo} does not exist`, 404));
        }
        const deadlineDate = new Date(deadline);
        if (deadlineDate.getTime() <= new Date()) {
          return next(new Error(`Invalid deadline date: ${deadline}`));
        }
        const newTask = await taskModel.create({
            title,
            description,
            deadline,
            assignTo,
            createdBy: req.user._id,
        });
        return res.status(201).json({message: "Task added successfully", newTask});
    }
)

export const getAllTasks = asyncHandler(
    async (req, res, next) => {
    if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
        return next(new Error("User is deleted, logIn First"))
    }
    if(req.user.isOnline == false ){
        return next(new Error("User is offline, logIn First"))
    }
    const tasks = await taskModel.find().populate({
      path: 'assignTo',
      select: '_id userName email gender',
    }).populate({
      path: 'createdBy',
      select: '_id userName email gender',
    });
    return res.status(200).json({ message: 'Tasks fetched successfully', tasks });
});
  
export const getAllCreatedtasks = asyncHandler(
    async (req, res, next) => {
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const tasks = await taskModel.find({ createdBy: req.user._id }).populate({
            path: 'assignTo',
            select: '_id userName email gender',
        }).populate({
            path: 'createdBy',
            select: '_id userName email gender',
        });
        return res.status(200).json({ message: 'Tasks fetched successfully', tasks });
    }
)

export const getAllTasksAssignToMe = asyncHandler(
    async (req, res, next) => {
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const tasks = await taskModel.find({ assignTo: req.user._id }).populate({
            path: 'assignTo',
            select: '_id userName email gender',
        }).populate({
            path: 'createdBy',
            select: '_id userName email gender',
        });
        return res.status(200).json({ message: 'Tasks fetched successfully', tasks });
    }
)

export const getAllLateTasks = asyncHandler(
    async (req, res, next) => {
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const tasks = await taskModel.find({ deadline: { $lt: new Date() } })
        .populate({
            path: 'assignTo',
            select: '_id userName email gender',
            }).populate({
                path: 'createdBy',
                select: '_id userName email gender',
            });
            return res.status(200).json({ message: 'Tasks fetched successfully', tasks });
    }
)

export const getTasksAssignToAnyOne = asyncHandler(
    async (req, res, next) => {
    if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
        return next(new Error("User is deleted, logIn First"))
    }
    if(req.user.isOnline == false ){
        return next(new Error("User is offline, logIn First"))
    }
    const { id } = req.params;
    const tasks = await taskModel.find({ assignTo: { $in: [id] } })
      .populate({
        path: 'assignTo',
        select: '_id userName email gender',
      })
      .populate({
        path: 'createdBy',
        select: '_id userName email gender',
      });
    return res.status(200).json({ message: 'Tasks fetched successfully', tasks });
});

export const updateTask = asyncHandler(
    async (req, res, next) => {
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const { id } = req.params;
        const { title, description, status, assignTo, deadline } = req.body;
        const task = await taskModel.findById(id);
        if (!task) {
            return next(new ErrorResponse(`Task with id ${id} not found`, 404));
        }
        
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not authorized to update this task' });
        }
        const assignToId = await userModel.findById(assignTo);
        if (!assignToId) {
             return next(new Error(`User not found with ID ${assignTo}`));
        }
        await taskModel.updateOne({_id: id}, {
            title,
            description,
            status,
            assignTo,
            deadline,
        })
        return res.status(200).json({ message: 'Task updated successfully' });
    }
)

export const deleteTask = asyncHandler(
    async (req, res, next) => {
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        }
        const { id } = req.params;
        const task = await taskModel.findById(id);
        if (!task) {
            return next(new ErrorResponse(`Task with id ${id} not found`, 404));
        }
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not authorized to delete this task' });
        }

        for (const file of task.attachmentToTask) {
            await cloudinary.uploader.destroy(file.public_id)
        }
        await taskModel.deleteOne({ _id: id });
        return res.status(200).json({ message: 'Task deleted successfully' });
    }
)

export const attachmentToTask = asyncHandler(
    async (req, res, next) =>{
        if(req.user.isDeleted == true ){  // if isDeleted == true that means => user Deleted
            return next(new Error("User is deleted, logIn First"))
        }
        if(req.user.isOnline == false ){
            return next(new Error("User is offline, logIn First"))
        } 
        const { id } = req.params;
        const task = await taskModel.findById(id);
        if (!task) {
            return next(new ErrorResponse(`Task with id ${id} not found`, 404));
        }
        const attachmentToTask = []
        for (const file of req.files) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {folder: `user/task/${req.user._id}`})
            attachmentToTask.push( {secure_url, public_id})
        }
        await taskModel.findByIdAndUpdate(
            id,
            {attachmentToTask},
        )
        return res.json({message: "success"})
    }
)