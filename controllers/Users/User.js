const { User } = require('../../models/User');
const AppError = require('../../utils/appError');
const successResponse = require('../../utils/successResponse');
const catchAsync=require('./utils/catchAsync');
const bcrypt = require("bcrypt");

const jwt=require('jsonwebtoken');
exports.register=catchAsync(async (req,res,next)=>{
    const {username,email,password,  firstName, lastName,role}=req.body;
if(!firstName || !lastName || !username || !email || !password){
    return res.status(400).json({error:'All fields are required'})
}

const existUser=await User.findOne({username:username,email:email});

if(existUser){
    return res.status(400).json({error:'Username or Email already exists'})
}

const hashPassword=await bcrypt.hash(password,10);

console.log("Hash Password: " + hashPassword);

const newUser=new User({
    username,
    email,
    password:hashPassword,
    firstName,
    lastName,
    role
})


await newUser.save();

return successResponse(res,"User created successfully",{user:newUser});
})

exports.login=catchAsync(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        const error=new AppError("Please enter details",400);
        console.log("Error coming from server",error);
        return next(error);

    }
    
    const user=await User.findOne({email}).select('+password');
    if(!user){
        const error=new AppError("User not found",401);
        console.log("Error coming from server",error);
        return next(error);
    }

if(await bcrypt.compare(password,user.password)){
    const payload={
        email:user?.email,
        id:user?._id,
        firstName:user?.firstName,
        lastName:user?.lastName,
        role:user?.role
    };

    const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:'24h'
    });
    console.log("Token is",token);
    const options={
        expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly:true,
    };
    return res.cookie("token",token,options).json({
        success:true,
        message:"User Logged in Successfully,"
    })
}
})

exports.logout=catchAsync(async(req,res,next) =>{
    return res.clearCookie("token").json({
        success:true,
        message:"User Logged out Successfully,"
    })
})
exports.fetchProfile=catchAsync(async(req,res,next) =>{
const id=req.userid;
console.log("Fetching profile of id " +id);


const userDetails=await User.findById(id);
console.log("Fetching profile from controller is",userDetails);

if(!userDetails){
    const error=new AppError("User not found",404);
    console.log("Error coming from server",error);
    return next(error);
 
}

return successResponse(res,"Profile fetched successfully",{user:userDetails});
});