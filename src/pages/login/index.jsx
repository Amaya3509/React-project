import React, { Component } from 'react'
import { Form, Icon, Input, Button, message} from 'antd'
import axios from 'axios'

// 引入图片资源：在React脚手架中图片必须引入才会打包
import logo from './logo.png'

// import语法必须写在最上面
import './index.less'

// 缓存一下
const Item = Form.Item

class Login extends Component {

	// 点击form表单中的提交按钮，会触发form表单的onSubmit事件
	login = (ev) => {
		ev.preventDefault()

		// validateFields方法是用来校验表单并获取表单的值
		this.props.form.validateFields((error, values) => {
			/*
			error 代表表单校验结果
					要么为null    代表校验通过
					要么为对象{}  代表校验失败，就不需要获取值了
					所以可以通过error来判断表单有没有通过验证
			*/
			// values --> {username: "1234", password: "3455"}
			// console.log(error, values)

			if(!error){
				// 校验通过
				const {username, password} = values

				// 发送请求，请求登录
                // yarn add axios 看api文档接口怎么发送请求，拿到api文档使用接口之前，记得测试一下(Postman工具，如果是测试post请求，记得选post --> Body --> x-www-form-urlencoded)
				axios.post('http://localhost:5000/login', {username, password})
                    .then((res) => {
                        // 获取请求回来的数据
                        const {data} = res.data

                    })
                    .catch(() => {

                    })


			} else {
				// 校验失败
				console.log('登录表单校验失败：', error); // 可以不写
			}
		})
	}

	// 自定义校验规则函数 只要Input中一输入值就会触发validator这个函数
	validator = (rule, value, callback) => {
		// 无论如何，callback必须调用

		// rule --> {validator: ƒ, field: "password", fullField: "password", type: "string"}
		// value --> "1" 代表Input输入框中输入的值
		// console.log(rule, value);

		const name = rule.fullField === 'username' ? '用户名' : '密码'

		if (!value) {
			// 没有输入
			callback(`必须输入${name}！`);
		} else if (value.length < 4) {
			callback(`${name}必须大于等于4位`);
		} else if (value.length > 15) {
			callback(`${name}必须小于等于15位`);
		} else if (!/^[a-zA-Z_0-9]+$/.test(value)) {
			callback(`${name}只能包含英文字母、数字和下划线`);
		} else {
			// 进入到else证明上面的校验都通过了
			// callback不传参代表校验通过，传参代表校验失败
			callback();
		}
	}

	render() {
		// getFieldDecorator也是一个高阶组件
		const {getFieldDecorator} = this.props.form

		return <div className="login">
			<header className="login-header">
				<img src={logo} alt="logo"/>
				<h1>React项目: 后台管理系统</h1>
			</header>
			<section className="login-content">
				<h2>用户登录</h2>
				<Form onSubmit={this.login} className="login-form">
					<Item>
						{
							getFieldDecorator(
								'username',
								{
									rules: [
										/*
										// 方法1:
										{required: true, message: '请输入用户名！'},
										{min: 4, message: '用户名必须大于4位'},
										{max: 15, message: '用户名必须小于15位'},
										{pattern: /^[a-zA-Z_0-9]+$/, message: '用户名只能包含英文字母、数字和下划线'}
										*/
										// 方法2: 函数可以代码复用
										{
											validator: this.validator
										}
									]
								}
							)(
									<Input className="login-input" prefix={<Icon type="user" />} placeholder="用户名"/>
							)
						}
					</Item>
					<Item>
						{
							getFieldDecorator(
								'password',
								{
									rules: [
										{
											validator: this.validator
										}
									]
								}
							)(<Input className="login-input" prefix={<Icon type="lock" />} placeholder="密码" type="password"/>)
						}
					</Item>
					<Item>
						<Button type="primary" htmlType="submit" className="login-btn">登录</Button>
					</Item>
				</Form>
			</section>
		</div>
	}
}

// 返回值是一个包装组件  <Form(Login)><Login></Login></Form(Login)>
// 通过Form(Login)包装组件向Login组件中传递form属性(this.props.form)
export default Form.create()(Login)