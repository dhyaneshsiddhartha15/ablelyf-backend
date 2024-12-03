import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "Username already exists"],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already registered"],
        match: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    },
    salutation: {
        type: String,
        enum: ['Mr', 'Ms', 'Dr', 'Prof', 'Mrs', ''],
        default: 'Mr'
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    mobile: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 20,
        sparse: true
    },
    address: {
        type: String,
        minlength: 10,
        maxlength: 200
    },
    zipcode: {
        type: String,
        minlength: 5,
        maxlength: 10
    },
   role:{
    type:String,
    enum: ['user', 'admin', 'provider'],
    default: 'user',
   },
    profileImage: {
        type: String,
        default: "https://avatar.iran.liara.run/public/boy"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isProvider: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false,
});

export default mongoose.model("User", UserSchema);