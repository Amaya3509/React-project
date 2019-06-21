import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import Login from './pages/login';
import Admin from './pages/admin'

export default class App extends Component {
	render() {
		// Switch 切换。 里面的组件有且只有一个生效（从上到下依次匹配）
		return <Switch>
			<Route path="/login" component={Login}/>
			<Route path="/" component={Admin}/>
		</Switch>;
	}
}