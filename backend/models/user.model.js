import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        require: true
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
    }
});

const User = mongoose.model("User", UserSchema);

export default User;