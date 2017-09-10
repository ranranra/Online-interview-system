const mongoose=require("mongoose");
const userSchema=require("../schema/userSchema.js");

const mon1=mongoose.createConnection("mongodb://localhost:27017/user")
const userModel=mon1.model("userModel",userSchema);
module.exports=userModel;