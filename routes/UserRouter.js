const express = require('express');
const { register, login, logout, fetchProfile } = require('../controllers/Users/User');

const userRouter=express.Router();
userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/logout',logout);
userRouter.get('/get-details',fetchProfile);

module.exports=userRouter;