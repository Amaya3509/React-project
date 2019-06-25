import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'

import MyButton from '../my-button';
import { getItem, removeItem } from "../../utils/storage-tools";
import { reqWeather } from "../../api";
import menuList from '../../config/menu-config'

import './index.less';

class HeaderMain extends Component {
  state = { // 必须要更新状态，页面才会有变化
    sysTime: Date.now(),
    weather: '晴',
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png'
  }

  // 只执行一次
  componentWillMount() {
    this.username = getItem().username // 只需读取一次
    this.title = this.getTitle(this.props)
  }

  // 发送请求首先考虑在componentDidMount中发
  async componentDidMount() {
    setInterval(() => {
      this.setState({
        sysTime: Date.now(),
      })
    }, 1000)

    // 发送请求，请求天气
    const result = await reqWeather()
    if(result) {
      // 请求成功
      this.setState(result)
    }
  }

  // 父组件重新渲染会触发，state更新不会触发
  componentWillReceiveProps(nextProps) {
    // 这里getTitle方法中的pathname还是上一次的值(最新的props在nextProps上，上一次的值在props上，所以默认得到的是上一次的值)
    this.title = this.getTitle(nextProps)
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

  /*
   * 获取title
   * @returns {string|*}
   */
  getTitle = (nextProps) => {
    // 获取当前路径
    const { pathname } = nextProps.location

    // menuList.find((menu) => menu.key === pathname) 该方法只能找到一级菜单
    // 用for循环可以控制找到了就终止，而forEach实现不鸟，所以这里用for循环
    for(let i=0; i<menuList.length; i++) {
      const menu = menuList[i]
      if(menu.children){
        for(let j=0; j<menu.children.length; j++) {
          const item = menu.children[j]
          if(item.key === pathname){
            return item.title
          }
        }
      } else {
        if(menu.key === pathname){
          return menu.title
        }
      }
    }
  }

  render() {
    /*
    倒三角上的文字，在初始化渲染和更新(这里的更新指得是点击左侧菜单会导致地址发生变化从而导致父组件withRouter重新渲染，从而导致当前组件的props中location中pathname变化)中都涉及到，则首先考虑定义在render中，但由于时间不停变化，state不停改变，会不断触发render，会导致不停的获取title

    解决: 分别在componentWillMount和componentWillReceiveProps中调用this.getTitle()
    */
    // const title = this.getTitle()

    const { sysTime, weather, weatherImg } = this.state

    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg} alt=""/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(HeaderMain)