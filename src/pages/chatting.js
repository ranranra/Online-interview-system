import React,{Component} from 'react'
import $ from 'jquery'

const socket=require("socket.io-client").connect()
export default class Chatting extends Component{
	constructor(){
		super()
		this.state={
			interviewName:'',
			anotherName:'',
			leftName:''
		}
	}

	componentDidMount(){
		const that=this
		socket.on("write1",function(data){
			that.text.value=data
		})

        const getUserMedia=(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia);
        if(getUserMedia){
        	getUserMedia.call(navigator,{
	        	video:true,
	        	audio:true
	        },function(localMediaStream){
	        	if(that.state.interviewName!=='面试官'){
	        		that.video.src=window.URL.createObjectURL(localMediaStream)
	        		that.video.onloadedmetadata = function(e) {
			            console.log("AudioTracks" , localMediaStream.getAudioTracks());
			            console.log("VideoTracks" , localMediaStream.getVideoTracks());
			            console.log(e)
			            const videoMedia=localMediaStream.getVideoTracks()
				        var blob=new Blob(videoMedia)
				        console.log(blob)
		        		socket.emit("videos",blob)
			        };
			        
	        	}else{
	        		/*that.video.src=window.URL.createObjectURL(localMediaStream)*/
	        		socket.on("callVideo",function(data){
	        			console.log(666666666)
	        			console.log(data)
	        			/*that.video.src=window.URL.createObjectURL(data)*/
	        		})
	        	}
	        	
	        },function(e){
	        	console.log(e)
	        })
        }else{
        	alert("浏览器版本不支持！")
        }

        

		$.ajax({
			url:'/interviewer',
			type:'post',
			dataType:'json',
			data:{
				url:window.location.href
			},
			success:function(data){
				that.setState({
					interviewName:data.interviewName
				})

				if(data.interviewName!=='面试官'){
					$.ajax({
						url:'/setText',
						type:'post',
						dataType:'text',
						data:{
							interviewName:data.interviewName
						}
					})
				}

				socket.emit("userJoined",that.state.interviewName)
				socket.on("joined",function(data){
					that.setState({
						anotherName:data
					})
				})
				
			},
			error:function(){
				alert("失败")
			}
		})

		socket.on("userLeft",function(data){
			that.setState({
				leftName:data
			})
		})

		window.addEventListener("unload",function(){
			if(that.state.interviewName!=='面试官'){
				$.ajax({
					url:'/setTexts',
					type:'post',
					data:{interviewName:that.state.interviewName},
					dataType:'text'
				})
			}
		})
	}

	handleKeyUp(){
		socket.emit("write",this.text.value)
		const that=this
		socket.on("write1",function(data){
			that.text.value=data
		})
	}

	render(){
		const interviewName=this.state.interviewName!==''?<p><strong>{this.state.interviewName}</strong>进入房间</p>:''
		const anotherName=this.state.anotherName!==''?<p><strong>{this.state.anotherName}</strong>进入房间</p>:''
		const leftName=this.state.leftName!==''?<p><strong>{this.state.leftName}</strong>离开房间</p>:''
		return (
			<div style={{width: 800,height: 400,position: "absolute",left: 0,top: 0,right: 0,bottom: 0,margin: "auto"}}>
				<textarea style={{width: 600,height: 400,resize: "none",float:'left',outline: "none",padding: 20,background: "#000",color: "#fff"}} autoFocus="autofocus" ref={(text)=>this.text=text} onKeyUp={this.handleKeyUp.bind(this)}></textarea>
				<div style={{padding:20,border:"solid 1px #a9a9a9",borderLeft:'none',background:"#eee",width:200,float:'right',height:400}}>
					<video ref={(video)=>this.video=video} autoPlay style={{width:200,height:150,marginTop:-20,marginLeft:-21}}></video>
					<h2>欢迎进入面试房间</h2>
					{interviewName}
					{anotherName}
					{leftName}
				</div>
			</div>
		)
	}
}