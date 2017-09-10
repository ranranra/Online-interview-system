const mongoose=require("mongoose");
const interviewerSchema=require("../schema/interviewerSchema.js");

const mon2=mongoose.createConnection("mongodb://localhost:27017/interviewer");
const interviewerModel=mon2.model("interviewerModel",interviewerSchema);
module.exports=interviewerModel;