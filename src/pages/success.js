import React,{Component} from 'react'
import $ from 'jquery'
import { Layout, Menu, Icon, Row, Col, Table, Button, Modal, Form, Input} from 'antd';
const { Header, Sider, Content } = Layout;

const FormItem = Form.Item;
import 'antd/dist/antd.css';

import CollectionsPage from './add.js'

export default class Success extends React.Component {
	constructor(){
		super()
		this.state = {
			collapsed: false,
			height:0,
			key:1,
			users:[]
		};
	}

	componentDidMount(){
		const height=document.documentElement.clientHeight;
		this.setState({
			height:height
		})
		this.getUserinfo()
	}

	getUserinfo(){
		const fetchOptions={
			method:'GET'
		}
		fetch("/allUser",fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			this.setState({
				users:json
			})
		})
	}

	toggle(){
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}
	handleChange(item){
		this.setState({
			key:item.key
		})
	}

	handleRemove(id){
		const that=this;
		$.ajax({
			url:'/removeUser',
			type:'post',
			dataType:'json',
			data:{
				key:id
			},
			success:function(){
				alert("删除用户信息成功")
				that.getUserinfo()
			},
			error:function(){
				alert("删除用户信息失败")
			}
		})
	}

	render() {
		const columns = [
			{
				title: 'userName',
				dataIndex: 'userName',
				key: 'userName',
				render: text => <a href="#">{text}</a>,
			}, {
				title: 'userPassword',
				dataIndex: 'userPassword',
				key: 'userPassword',
			}, {
				title: 'userEmail',
				dataIndex: 'Email',
				key: 'Email',
			}, {
				title: 'Action',
				key: 'action',
				render: (text, record) => (
					<span>
						<a onClick={this.handleRemove.bind(this,record.key)}>Delete</a>
					</span>
				),
			}
		];

		const data = this.state.users.length?this.state.users:[];

		let content;
		if(this.state.key==1){
			content=<Table columns={columns} dataSource={data} />
		}else if(this.state.key==2){
			content=<div>					
						<CollectionsPage num={this.state.key}/>
					</div>
		}else if(this.state.key==3){
			content=<div>content3</div>
		}

		return (
			<Row>
				<Col span={24}>
					<Layout style={{height:this.state.height}}>
						<Sider trigger={null} collapsible collapsed={this.state.collapsed}>
							<div className="logo" />
							<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleChange.bind(this)}>
								<Menu.Item key="1">
									<Icon type="user" />
									<span>用户管理</span>
								</Menu.Item>
								<Menu.Item key="2">
									<Icon type="video-camera" />
									<span>nav 2</span>
								</Menu.Item>
								<Menu.Item key="3">
									<Icon type="upload" />
									<span>nav 3</span>
								</Menu.Item>
							</Menu>
						</Sider>
						<Layout>
							<Header style={{ background: '#fff', padding: 0 }}>
								<Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle.bind(this)} />
							</Header>
							<Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
								{content}
							</Content>
						</Layout>
					</Layout>
				</Col>
			</Row>
		);
	}
}