const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
	key:{
		type:String,
		required:true
	},
	userName:{
		type:String,
		required:true
	},
	userPassword:{
		type:String,
		required:true
	},
	Email:{
		type:String,
		required:true
	}
},{collection:'user'})
module.exports=userSchema;