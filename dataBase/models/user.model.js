import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: String,
    age: Number,
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
    },
    phone: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    isOnline:{
        type: Boolean,
        default: false
    },
    confirmEmail:{
        type: Boolean,
        default: false
    },
    profileImage: {secure_url: String, public_id: String},
    coverImages: [{secure_url: String, public_id: String}]
})

export const userModel = mongoose.model('User', userSchema)
