import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom'

import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';

import {reqValidateUserInfo} from "../../api";
import { getItem } from "../../utils/storage-tools";

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  async componentWillMount() {
    // 获取登录数据
    const user = getItem()

    /*
        // 下面会涉及到的验证用户信息 - 服务器代码  位置：routers/index.js
        router.post('/validate/user', (req, res) => {
          const { id } = req.body;

          UserModel.findById({_id: id}, (err, user) => {
            if (!err && user) {
              // 找到了用户数据
              res.json({
                status: 0,
                data: {}
              });
            } else {
              // 没有找到或者报错了
              res.json({
                status: 1,
                msg: '没有找到该用户'
              })
            }
          })
        })
       */

    /*
    if(!user || !user._id) {
      this.props.history.replace('/login') // 没有登录(比如地址栏直接输入地址)就要返回至登录界面
    } else {
      /!*
        有可能是直接设置localstorage里的值伪造(user._id是伪造不出来的)进来的，就需要进一步验证。
        如果是伪造的数据，则result就为undefined，则需要退回到登录界面
        reqValidateUserInfo()返回的是成功状态的promise对象，而result是代表这个promise对象里面的数据，要么是{}，要么是undefined
       *!/
      const result = await reqValidateUserInfo(user._id)
      // console.log(result); // {} / undefined

      if(!result) {
        this.props.history.replace('/login')
      }
    }
    */

    // 以上代码可简写为:
    if(user && user._id) {
      const result = await reqValidateUserInfo(user._id) // 记得一定要来气
      if(result) return // 不用跳转至登录界面
    }
    this.props.history.replace('/login') // 由于后面render中的<Redirect to="/home" />，所以就算退回到登录页面，也会立马变为/home页面 解决: 添加一个标识
  }

  render() {
    const { collapsed } = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '25px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/category" component={Category}/>
                <Route path="/product" component={Product}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/charts/line" component={Line}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Redirect to="/home" />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}