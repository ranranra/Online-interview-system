const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const interviewerSchema=new Schema({
	key:{
		type:String,
		required:true
	},
	interviewName:{
		type:String,
		required:true
	},
	interviewTime:{
		type:String,
		required:true
	},
	interviewEmail:{
		type:String,
		required:true
	},
	interviewURL:{
		type:String,
		required:true
	},
	interviewerURL:{
		type:String,
		required:true
	},
	isInterviewerOK:{
		type:String,
		required:true
	}
},{collection:'interviewer'});

module.exports=interviewerSchema