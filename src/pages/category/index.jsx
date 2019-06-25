import React, { Component } from 'react';
import { Card, Button, Icon, Table } from 'antd'

import { reqCategories } from '../../api'
import MyButton from '../../components/my-button'
import './index.less'

export default class Category extends Component {
  // 要把请求回来的一级分类列表显示出来，证明界面有变化了，就必须定义状态
  state = {
    categories: [] // 一级分类列表
  }

  // 发送请求 只执行一次
  async componentDidMount(){
    const result = await reqCategories('0') // parentId: "0" 代表一级分类列表
    if(result) { // 如果有值说明请求成功
      this.setState({
        categories: result
      })
    }
  }

  render() {
    // 决定表头内容
    const columns = [
      {
        title: '品类名称',
        // dataIndex: 'categoryName', // 该值为data中的属性名
        dataIndex: 'name', // 要和api接口的取名一样，否则数据出不来
      },
      {
        title: '操作',
        className: 'category-operation', // 可以根据类名给表头添加样式
        dataIndex: 'operation',
        // 改变当列的显示
        render: text => {
          // 多个虚拟DOM对象必须要有一个根标签包裹
          return <div>
            <MyButton>修改名称</MyButton>
            <MyButton>查看其子品类</MyButton>
          </div>
        }
      }
    ];
    // 决定表格里面的数据
    /*const data = [
      {
        key: '1',
        categoryName: '手机',
        // operation: 'xxxxx',
      },
      {
        key: '2',
        categoryName: '电脑',
        // operation: 'yyyyy',
      },
      {
        key: '3',
        categoryName: '耳机',
        // operation: 'zzzzz',
      },
      {
        key: '4',
        categoryName: '键盘',
        // operation: 'zzzzz',
      }
    ];*/

    return <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus" />添加品类</Button>}>
      {/*带边框的Table表格*/}
      <Table
        columns={columns}
        dataSource={this.state.categories}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true // 至少有2页才看得见
        }}
      />
    </Card>;
  }
}