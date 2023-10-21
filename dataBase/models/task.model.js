import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in progress', 'done'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deadline: {
        type: Date,
        default: Date.toString
    },
    attachmentToTask:[{secure_url: String, public_id: String}]
},{
    timestamps: true
})

export const taskModel = mongoose.model('Task', taskSchema)
