import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import MyButton from '../my-button';
import { getItem, removeItem } from "../../utils/storage-tools";

import logo from '../../assets/images/logo.png';
import './index.less';

class HeaderMain extends Component {
  state = { // 必须要更新状态，页面才会有变化
    sysTime: Date.now()
  }

  // 只执行一次
  componentWillMount() {
    this.username = getItem().username // 只需读取一次
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        sysTime: Date.now()
      })
    }, 1000)
  }

  // 登出函数
  logout = () => {
    Modal.confirm({
      title: '您确定要退出登录吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => { // 要把onOk改为箭头函数，onOk里面的this才指向为组件的实例对象
        // 先清空本地数据
        removeItem()
        // 再退出登录(要执行以下代码记得用withRouter包装一下当前组件，这样才可以给当前组件传路由组件的三大属性: history、location、match)
        this.props.history.replace('/login')
      }
    });
  }

  render() {
    const { sysTime } = this.state

    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">用户管理</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={logo} alt=""/>
          <span>晴</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(HeaderMain)