import React, { Component } from 'react';
import { Icon, Menu } from "antd";
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import menuList from '../../config/menu-config';

import './index.less';
import logo from '../../assets/images/logo.png';

const { SubMenu, Item } = Menu;

// pages中放的是路由组件，component中放的是非路由组件

class LeftNav extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired
  };

  createMenu = (menu) => {
    return <Item key={menu.key}>
      <Link to={menu.key}>
        <Icon type={menu.icon} />
        <span>{menu.title}</span>
      </Link>
    </Item>
  };

  // 在render方法之前生成菜单，并只执行一次(不写在render中是因为每次更新都会触发render方法，又得重新生成菜单，这不是我们想要的效果)
  // 这个生命周期回调函数的返回值是无法拿到的，因为不是由我们调用的
  componentWillMount() { // 初始化渲染中会触发该函数
    let { pathname } = this.props.location;

    /*
      pathname: '/product/saveupdate'  --> '/product'
                '/product/'  --> '/product'
     */

    const pathnameReg = /^\/product\//
    if(pathnameReg.test(pathname)) {
      pathname = '/product'
    }

    let isHome = true

    // 根据menuList生成菜单
    this.menus = menuList.map((menu) => {
      // 判断是一级菜单还是二级菜单
      // const children = menu.children;
      const { children } = menu

      if (children) {
        // 二级菜单
        return <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon} />
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            // JSX语法 返回一个数组，会自动展开里面的内容
            children.map((item) => {
              if (item.key === pathname) {
                // 说明当前地址是一个二级菜单，需要展开其对应的一级菜单
                // 初始化展开的菜单
                this.openKey = menu.key;
                isHome = false // 一旦二级菜单命中就将标识置为false
              }
              return this.createMenu(item);
            })
          }
        </SubMenu>;
      } else {
        // 一旦一级菜单命中也将标识置为false
        if(menu.key === pathname) isHome = false

        // 一级菜单
        return this.createMenu(menu);
      }
    });
    // 初始化选中的菜单
    /*
     有个bug: 在地址栏输入/，会重定向到/home(得到的pathname值还是'/')，输入/是初始化渲染，重定向到/home是更新组件，而当前代码在componentWillMount中，只会执行一次，pathname为'/'谁也匹配不上，所以'首页'这个菜单项并没有默认选中
     解决:
     /xxx匹配不上任何路由组件的时候，都会重定向到/home，这时候我们希望'首页'这个菜单项也会默认选中
     定义一个标识isHome
     */
    this.selectedKey = isHome ? '/home' : pathname;
  }

  render() {
    const { collapsed } = this.props;

    return <div>
      <Link className="left-nav-logo" to='/home'>
        <img src={logo} alt="logo"/>
        <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
      </Link>
      <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
        {
          this.menus
        }
        {/*这里不能写死，因为每个人的权限不一样，菜单显示的内容就不一样，需要动态生成*/}
        {/*<Item key="home">
          <Link to="/home">
            <Icon type="home" />
            <span>首页</span>
          </Link>
        </Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="appstore" />
              <span>商品</span>
            </span>
          }
        >
          <Item key="/category">
            <Link to="/category">
              <Icon type="bars" />
              <span>品类管理</span>
            </Link>
          </Item>
          <Item key="4">
            <Icon type="tool" />
            <span>商品管理</span>
          </Item>
        </SubMenu>
        <Item key="5">
          <Icon type="user" />
          <span>用户管理</span>
        </Item>
        <Item key="6">
          <Icon type="user" />
          <span>权限管理</span>
        </Item>
        <SubMenu
          key="sub2"
          title={
            <span>
                <Icon type="team" />
                <span>图形图表</span>
              </span>
          }
        >
          <Item key="7">
            <Icon type="team" />
            <span>柱形图</span>
          </Item>
          <Item key="8">
            <Icon type="team" />
            <span>折线图</span>
          </Item>
          <Item key="9">
            <Icon type="team" />
            <span>饼图</span>
          </Item>
        </SubMenu>*/}
      </Menu>
    </div>;
  }
}

// withRouter是一个高阶组件，向非路由组件传递三大属性：history、location、match
export default withRouter(LeftNav);