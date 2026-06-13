import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String,
    },
    assistantImage: {
        type: String,
    },
    history: [
        { type: String }
    ]
}, { timestamps: true })

const User = await mongoose.models.User || mongoose.model("User",userSchema)

export default User;