var express = require('express');
var router = express.Router();
var user=require("../src/models/userModel.js")
var interviewer=require('../src/models/interviewerModel.js')

router.get('/getAllInterviewer',function(req,res,next){
	interviewer.find({}).sort({'key':-1}).exec((err,interviewerInfo)=>{
		if(err){
			console.log(err)
		}else{
			res.json(interviewerInfo)
		}
	})
})

router.post("/addInterview",function(req,res,next){
	const newInterview=req.body
	interviewer.find({'interviewEmail':newInterview.interviewEmail},function(err,interviewerInfo){
		if(err){
			console.log(err)
		}else{
			if(interviewerInfo.length!=0){
				console.log("信息重复输入，请检查")
				res.json({'code':'0','msg':'信息重复输入，请检查'})
			}else{
				interviewer.create(newInterview,(err)=>{
					if(err){
						console.log("添加失败")
						console.log(err)
						res.json({'code':'-1','msg':'添加失败'})
					}else{
						console.log("添加成功")
						res.json({'code':'1','msg':'添加成功'})
					}
				})
			}
		}
	})
})

router.get("/maxInterviewKey",function(req,res,next){
	interviewer.find({}).sort({'key':-1}).limit(1).exec((err,interviewerInfo)=>{
		if(err){
			console.log(err)
		}else{
			res.json(interviewerInfo)
		}
	})
})

router.post("/interviewer",function(req,res,next){
	const url=req.body.url
	interviewer.find({'interviewerURL':url}).exec((err,interviewer)=>{
		if(err){
			console.log(err)
		}else{
			if(interviewer.length!=0){
				res.json({"interviewName":interviewer[0].interviewName})
			}else{
				res.json({"interviewName":"面试官"})
			}
		}
	})
})

router.post("/setText",function(req,res,text){
	const interviewName=req.body.interviewName
	interviewer.update({'interviewName':interviewName},{'isInterviewerOK':'进入面试房间(等待中……)'},function(err){
		if(err){
			console.log(err)
		}
	})
})

router.post("/setTexts",function(req,res,text){
	const data=req.body.interviewName
	interviewer.update({'interviewName':data},{'isInterviewerOK':'进入面试房间'},function(err){
		if(err){
			console.log(err)
		}
	})
})


router.get('/', function(req, res, next) {
  res.render('index');
});

router.post("/register",function(req,res,next){
	let newUser=req.body
	user.findOne({'userName':newUser.userName},function(err,userInfo){
		if(err){
			console.log(err)
		}else{
			if(userInfo!==null&&userInfo!==''){
				console.log("用户名被占用")
				res.json({'code':'0','msg':'用户名已注册'})
			}else{
				user.create(newUser,(err)=>{
					if(err){
						console.log(err)
						res.json({'code':'-1','msg':'注册失败'})
					}else{
						console.log("注册成功！")
						res.json({'code':'1','msg':'注册成功'})
					}
				})
			}
		}
	})
})

router.post("/login",function(req,res,next){
	let userName=req.body.userName;
	let userPassword=req.body.userPassword;
	user.findOne({"userName":userName,"userPassword":userPassword},function(err,userInfo){
		if(err){
			console.log(err)
			res.json({"code":'-1',"mes":'登录失败'})
		}else{
			if(userInfo!==null&&userInfo!==''){
				console.log("成功！")
				res.json({"code":'1',"mes":'登录成功'})
			}else{
				console.log("失败！")
				res.json({"code":'0',"mes":'用户名或密码错误'})
			}
		}
	})
})

router.get('/allUser',function(req,res,next){
	user.find({}).sort({'key':-1}).exec((err,users)=>{
		if(err){
			console.log(err)
		}else{
			res.json(users)
		}
	})
})

router.get("/maxUserKey",function(req,res,next){
	user.find({}).sort({'key':-1}).limit(1).exec((err,userInfo)=>{
		if(err){
			console.log(err)
		}else{
			res.json(userInfo)
		}
	})
})

router.post('/removeUser',function(req,res,next){
	const key=req.body.key
	user.remove({'key':key},function(err,userInfo){
		if(err){
			console.log(err)
		}else{
			res.json(userInfo)
		}
	})
})



module.exports = router;
