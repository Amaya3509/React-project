import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd'

import { reqCategories, reqAddCategory } from '../../api'
import MyButton from '../../components/my-button'
import AddCategoryForm from './add-category-form'
// import UpdateCategoryNameForm from './update-category-name'
import './index.less';
import './index.less'

// const { Item }= Form
// const { Option } = Select

export default class Category extends Component {
  // 要把请求回来的一级分类列表显示出来，证明界面有变化了，就必须定义状态
  state = {
    categories: [], // 一级分类列表
    isShowAddCategory: false // 显示添加品类的对话框
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

  // 显示添加品类的对话框
  showAddCategory = () => {
      this.setState({
        isShowAddCategory: true
      })
  }

  // 隐藏添加品类的对话框
  hideAddCategory = () => {
    this.setState({
      isShowAddCategory: false
    })
  }

  // 点击确认按钮，1.表单校验-->2.收集表单数据-->3.发送请求，添加品类
  addCategory = () => {
    console.log(90);
    /*
    在AddCategoryForm组件的外面，却想要获取到该组件内部的from属性，该怎么办？
    不要采取给当前Category组件包裹Form.create()(Category)的方法，不靠谱，因为每一个form都相当于是一个独立的form，都与当前组件的表单相关，即使在Category中创建了form，也与点击'添加品类'出现的对话框中的表单没有任何关系，那么就不可以用Category中的form校验表单并收集数据了，必须用AddCategoryForm组件中的form
    解决:
      1.父组件传递一个函数给子组件，子组件调用该函数并把所需的from属性作为参数传给父组件
      2.给子组件添加标签属性wrappedComponentRef={(form) => this.form = form}，其中作为参数的form代表子组件的实例对象
    注意: wrappedComponentRef只能用于通过Form.create()()产生的组件，别的组件都用不鸟
    */

    // console.log(this.addCategoryForm); // AddCategoryForm组件的实例对象

    // validateFields方法是用来校验表单并获取表单的值
    this.addCategoryForm.props.form.validateFields(async (err, values) => {
      console.log(11);
      if(!err) {

        console.log(values); // 为什么打印不出来？？？？？
        // 校验通过，发送请求
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName)
        if(result) {
          // 添加品类成功，提示成功信息，对话框隐藏
          message.success('添加品类成功~', 2) // 提示时间2s
          this.setState({
            isShowAddCategory: false
          })
        }
      }
    })
  }

  render() {
    const { categories, isShowAddCategory } = this.state

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

    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.showAddCategory}><Icon type="plus" />添加品类</Button>}>
      {/*带边框的Table表格*/}
      <Table
        columns={columns}
        dataSource={categories}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true // 至少有2页才看得见
        }}
        rowKey="_id" // 解决报错 通过api接口可以看到请求回来的每个列表对应的对象都有个"_id"属性
      />

      <Modal
        title="Modal"
        visible={isShowAddCategory}
        onOk={this.addCategory}
        onCancel={this.hideAddCategory}
        okText="确认"
        cancelText="取消"
      >
        {/*使用表单项，可以收集数据*/}
        {/*wrappedComponentRef中的参数form代表AddCategoryForm组件的实例对象*/}
        <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
      </Modal>
    </Card>;
  }
}