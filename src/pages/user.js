import React,{Component} from 'react'
import $ from 'jquery'
import {Row, Col, Tabs, Card, Form, Icon, Input, Button, Checkbox} from 'antd';
import {hashHistory} from 'react-router'

import 'antd/dist/antd.css';

const TabPane=Tabs.TabPane;
const FormItem = Form.Item;

class LoginAndLogout extends Component{
	constructor(){
		super();
		this.state={
			confirmDirty: false,
			i:1
		}
	}

	componentDidMount(){
		const that=this
		$.ajax({
			url:'/maxUserKey',
			type:'get',
			dataType:'json',
			success:function(data){
				that.setState({
					i:parseInt(data[0].key)+1
				})
			}
		})
	}

	handleChange(){
		console.log("change")
	}

	handleLogin(ev){
		var formData=this.props.form.getFieldsValue();
		$.ajax({
			url:'/login',
			type:'post',
			dataType:'json',
			data:{
				userName:formData.userName,
				userPassword:formData.passWord
			},
			success:function(data){
				if(data.code==1){
					alert("登陆成功！")
					hashHistory.push("/success")
				}else if(data.code==0){
					alert("用户名或密码错误！")
				}else{
					alert("登录失败！")
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				alert("登录失败！");
			}
		})
	}
	handleRegister(ev){
		var formData=this.props.form.getFieldsValue();

		const data={
			key:this.state.i,
			userName:formData.username,
			userPassword:formData.password,
			Email:formData.email
		}
		const that=this
		$.ajax({
			url:"/register",
			type:'post',
			dataType:'json',
			data:data,
			success:function(data){
				if(data.code==1){
					alert("注册成功！")
				}else if(data.code==0){
					alert("用户名已存在！")
				}else{
					alert("注册失败！")
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert("注册失败！")
			}
		})
	}

	handleConfirmBlur(e){
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}
	checkPassword(rule, value, callback){
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	}
	checkConfirm(rule, value, callback){
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			}
		};
		return (
			<Row>
				<Col span={8}></Col>
				<Col span={8}>
					<Card title="用户中心" style={{marginTop:140}}>
						<Tabs defaultActiveKey="1" type="card" onChange={this.handleChange.bind(this)}>
							<TabPane tab="登录" key="1">
								<Form className="login-form">
									<FormItem>
										{getFieldDecorator('userName', {
										rules: [{ required: true, message: 'Please input your username!' }],
										})(
										<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
										)}
									</FormItem>
									<FormItem>
										{getFieldDecorator('passWord', {
										rules: [{ required: true, message: 'Please input your Password!' }],
										})(
										<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
										)}
									</FormItem>
									<FormItem style={{marginBottom:0}}>
										{getFieldDecorator('remember', {
										valuePropName: 'checked',
										initialValue: true,
										})(
										<Checkbox>Remember me</Checkbox>
										)}
										<br/>
										<Button type="primary" style={{width:'100%'}} className="login-form-button" htmlType="button" onClick={this.handleLogin.bind(this)}>
								            Log in
								        </Button>
									</FormItem>
								</Form>
							</TabPane>
							<TabPane tab="注册" key="2">
								<Form className="login-form register">
							        <FormItem {...formItemLayout} label="username" hasFeedback >
								        {getFieldDecorator('username', {
									        rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
									        })(
									        <Input />
								        )}
							        </FormItem>
									<FormItem {...formItemLayout} label="E-mail" hasFeedback>
										{getFieldDecorator('email', {rules: [{
											type: 'email', message: 'The input is not valid E-mail!',
											}, {
											required: true, message: 'Please input your E-mail!',
											}],
											})(
											<Input />
										)}
									</FormItem>
									<FormItem {...formItemLayout} label="Password" hasFeedback >
								        {getFieldDecorator('password', {
									        rules: [{
									        required: true, message: 'Please input your password!',
									        }, {
								            	validator: this.checkConfirm.bind(this),
								            }],
									        })(
									        <Input type="password" />
								        )}
							        </FormItem>
							        <FormItem {...formItemLayout} label="Confirm Password" hasFeedback >
								        {getFieldDecorator('confirm', {
									        rules: [{
									        required: true, message: 'Please confirm your password!',
									        }, {
								            	validator: this.checkPassword.bind(this),
								            }],
									        })(
									        <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} />
								        )}
							        </FormItem>
							        <FormItem style={{marginBottom:0}}>
							          <Button type="primary" style={{width:'100%'}} size="large" htmlType="button" onClick={this.handleRegister.bind(this)}>Register</Button>
							        </FormItem>
								</Form>
							</TabPane>
						</Tabs>
					</Card>
				</Col>
				<Col span={8}></Col>
			</Row>
		)
	}
}

const User=Form.create({})(LoginAndLogout);
export default User;
