import React,{Component} from 'react'
import {Router, Route, hashHistory} from 'react-router'
import {render} from 'react-dom'
import User from './user.js'
import Success from './success.js'
import Chatting from './chatting.js'

import '../sass/index.scss'

export default class App extends Component{
	render(){
		return (
			<Router history={hashHistory}>
				<Route path="/" component={User}></Route>
				<Route path="/success" component={Success}></Route>
				<Route path="/chat" component={Chatting}></Route>
			</Router>
		)
	}
}

render(
	<App/>
	,document.getElementById("main"))