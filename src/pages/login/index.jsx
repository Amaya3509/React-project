import React from 'react'
import { Form, Icon, Input, Button } from 'antd'
// 因为是分别暴露，所以这里要通过对象的解构赋值引入
import { reqLogin } from '../../api' // index.js可以省略不写
import { setItem } from "../../utils/storage-tools";

// 引入图片资源：在React脚手架中图片必须引入才会打包
import logo from '../../assets/images/logo.png'

// import语法必须写在最上面
import './index.less'

// 缓存一下
const Item = Form.Item

function Login(props) {

	// 点击form表单中的提交按钮，会触发form表单的onSubmit事件
	const login = (ev) => {
		ev.preventDefault()

		// validateFields方法是用来校验表单并获取表单的值
		props.form.validateFields(async (error, values) => {
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
        // 为什么要用async await? reqLogin()返回值是一个promise对象，是异步的，如果直接写同步代码根本无法判断它的状态!
        const result = await reqLogin(username, password)

        if(result) {
          // 登录成功
          // 只有这里能拿到用户名密码。保存用户信息
          setItem(result)

          // 登录成功 跳转至主页面Admin
          /*
            跳转页面的2种方法:
              1.<Redirect to="/" /> 推荐使用在render方法中

              // 推荐使用在回调函数中
              // 会保留当前的历史记录，以便可以回退至本页面
              2.this.props.history.push('/')
                或
                this.props.history.replace('/') // 不会保留当前的历史记录
           */
          props.history.replace('/') // 不需要再返回至登录页面了
        } else {
          // 登录失败
          // 重置密码为空
          props.form.resetFields(['password'])
        }

			} else {
				// 校验失败
				console.log('登录表单校验失败：', error); // 可以不写
			}
		})
	}

	// 自定义校验规则函数 只要Input中一输入值就会触发validator这个函数
  const validator = (rule, value, callback) => {
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

  // getFieldDecorator也是一个高阶组件，用于和表单进行双向绑定
  const { getFieldDecorator } = props.form

  return <div className="login">
    <header className="login-header">
      <img src={logo} alt="logo"/>
      <h1>React项目: 后台管理系统</h1>
    </header>
    <section className="login-content">
      <h2>用户登录</h2>
      <Form onSubmit={login} className="login-form">
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
                    validator: validator
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
                    validator: validator
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

// 返回值是一个包装组件  <Form(Login)><Login></Login></Form(Login)>
// 通过Form(Login)包装组件向Login组件中传递form属性(this.props.form)
export default Form.create()(Login)