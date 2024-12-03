const mongoose = require("mongoose");
require('dotenv').config();
exports.connect= ()=>{
    mongoose.connect(process.env.MONGODB_URL,{}).then(console.log("Database connected Successfully")).catch((error=>{
        console.log("Database connection error");
        console.log(error);
        process.exit(1);
    }))
}