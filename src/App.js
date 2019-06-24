import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Login from './pages/login';
import Admin from './pages/admin'

// 没有state，也没用上除constructor/render以外的生命周期函数就可以定义成工厂函数组件(直接return，就不再render了)
export default function App() {
	// Switch 切换。 里面的组件有且只有一个生效（从上到下依次匹配）
	return <Switch>
		<Route path="/login" component={Login}/>
		<Route path="/" component={Admin}/>
	</Switch>;
}