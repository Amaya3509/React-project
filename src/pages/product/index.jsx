import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

// import Index from './index' 这样写会导致自己加载自己，陷入死循环
import Index from './index/index'
import SaveUpdate from './save-update'
import Detail from './detail'

export default class Product extends Component {
  render() {
    return <div>
      <Switch>
        <Route path="/product/index" component={Index}/>
        <Route path="/product/saveupdate" component={SaveUpdate}/>
        <Route path="/product/detail" component={Detail}/>
        <Redirect to="/product/index"/>
      </Switch>
    </div>;
  }
}