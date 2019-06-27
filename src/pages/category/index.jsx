import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd'

import { reqCategories, reqAddCategory, reqRenameCategory, reqDeleteCategory } from '../../api'
import MyButton from '../../components/my-button'
import AddCategoryForm from './add-category-form'
import RenameCategoryForm from './rename-category-form'
import './index.less';
import './index.less'

// const { Item }= Form
// const { Option } = Select

export default class Category extends Component {
  // 要把请求回来的一级分类列表显示出来，证明界面有变化了，就必须定义状态
  state = {
    categories: [], // 一级分类列表
    subCategories: [], // 二级分类列表
    isShowSubCategories: false, // 是否显示二级分类列表数据
    isShowAddCategory: false, // 是否显示添加品类的对话框
    isShowRenameCategory: false, // 是否显示修改品类名称的对话框
    isLoading: true // 是否显示loading
  }

  // 刚开始this.category会为undefined，undefined.name会报错，所以这里赋初始值
  category = {} // 这样定义就是直接添加到this上的

  // 发送请求 只执行一次
  componentDidMount(){
    this.fetchCategories('0')
  }

  // isLoading在componentDidMount和showSubCategory中都要用到，所以这里就抽取成一个方法
  // 发送请求，获取分类数据
  fetchCategories = async (parentId) => {
    this.setState({
      isLoading: true
    })

    const result = await reqCategories(parentId) // parentId: "0" 代表一级分类列表

    if(result) { // 如果有值说明请求成功
      if(parentId === '0'){
        this.setState({
          categories: result // 请求回来的分类列表的数据
        })
      } else {
        this.setState({
          isShowSubCategories: true,
          subCategories: result
        })
      }
    }

    // 无论数据有没有请求回来，都要将isLoading置为false
    this.setState({
      isLoading: false
    })
  }

  /*
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

  // 显示修改分类名称的对话框
  showRenameCategory = () => {
    this.setState({
      isShowRenameCategory: true
    })
  }

  // 隐藏修改分类名称的对话框
  hideRenameCategory = () => {
    this.setState({
      isShowRenameCategory: false
    })
  }
  */

  // 优化上述的代码，将显示/隐藏定义成一个方法
  // 我们自己要传参，一般来说传参之后会立马调用，但这又是回调函数，点击的时候才会被调用，所以该方法里面要返回一个函数
  // 切换显示
  toggleDisplay = (stateName, stateValue) => {
    return () => {
      this.setState({
        [stateName]: stateValue
      })
    }
  }

  // '修改分类名称'对话框的取消按钮的点击事件
  cancelRenameCategory = () => {
    // 清空表单项(这样就可以实现即便你先修改了名称再点的取消，下次再点进去的时候，显示的还是RenameCategoryForm组件中设置的默认值，即还是会显示你所点击的列表项的默认名称。若掉了此步，则实现不鸟，效果会有问题
    const { form } = this.renameCategoryForm.props
    form.resetFields(['categoryName'])

    // 隐藏'修改分类名称'对话框
    this.setState({
      isShowRenameCategory: false
    })
  }

  // 点击确认按钮，1.表单校验-->2.收集表单数据-->3.发送请求，添加品类
  addCategory = () => {
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
    const { form } = this.addCategoryForm.props
    form.validateFields(async (err, values) => {
      if(!err) {
        // console.log(values); // {parentId: "0", categoryName: "111"}
        // 校验通过，发送请求
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName)
        if(result) {
          // 添加品类成功，提示成功信息，清空表单项数据，对话框隐藏，并显示在分类列表的最后面，
          message.success('添加品类成功~', 2) // 提示时间2s
          // 清空表单数据
          form.resetFields(['categoryName'])

          /*
            如果添加的是一级分类：就在一级分类列表中展示
            如果添加的是二级分类：
              若当前显示的是一级分类，则不需要展示
              若当前显示的是二级分类，还需要满足添加二级分类的一级分类和当前显示的一级分类一致，一致才显示，否则不显示
           */

          const options = {
            isShowAddCategory: false // 对话框隐藏
          }

          const { isShowSubCategories } = this.state

          if(result.parentId === '0') { // 添加的是一级分类
            options.categories = [...this.state.categories, result]
          } else if(isShowSubCategories && result.parentId === this.parentCategory._id){ // 添加的是二级分类
            options.subCategories = [...this.state.subCategories, result]
          }

          // 说明添加的是一级分类 --> 展示在分类列表的最后
          this.setState(options) // 统一更新

          /*
            上面更新了两次状态，会重新渲染两次吗？
               不会。React自己做的优化: 在一个很短时间内，多次的更新会合并为一次更新，所以只会渲染一次。
               当然，还可以定义一个options，自己做合并
           */
        }
      }
    })
  }

  // 点击'修改名称'这个按钮，既要显示修改分类名称的对话框，又要获取到当前点击的列表项的信息
  saveCategoryInfo = (category) => {
    return () => {
      // 保存当前点击的列表项的信息(刚开始this.category会为undefined）
      this.category = category // 覆盖操作
      this.setState({
        isShowRenameCategory: true
      })
    }
  }

  // 点击确认按钮，1.表单校验-->2.收集表单数据-->3.发送请求，修改分类名称
  renameCategory = () => {
    const { form } = this.renameCategoryForm.props
    form.validateFields(async (err, values) => {
      if(!err) {
        // console.log(values); // {categoryName: "耳机111"}
        // 校验通过，发送请求
        const categoryId = this.category._id
        const { categoryName } = values;
        const result = await reqRenameCategory(categoryId, categoryName)
        if(result) {
          const { parentId } = this.category

          let categoryData = this.state.categories
          let stateName = 'categories'

          if(parentId !== '0'){ // 二级分类
            categoryData = this.state.subCategories
            stateName = 'subCategories'
          }

          // 清空表单数据
          form.resetFields(['categoryName'])

          this.setState({
            isShowRenameCategory: false,
            // 修改数组中满足条件的某一个对象的name属性，不影响原数组，即产生一个新数组，只要不影响原数据，新数组里的对象和原数组里的对象存在引用关系也没事
            [stateName]: categoryData.map((category) => {
              let { _id, name, parentId } = category
              if(_id === categoryId) {
                name = categoryName

                return { // 对象的简写
                  _id,
                  name,
                  parentId
                }
              }
              // 没有修改的数据直接返回
              return category
            })
          })

          // 提示成功信息
          message.success('修改品类名称成功~', 2) // 提示时间2s
        }
      }
    })
  }

  deleteCategory = (category) => {
    return async () => {
      const result = await reqDeleteCategory(category._id)
      // console.log(result);
      if(result) {
        if(result.parentId === '0'){
          this.setState({
            categories: this.state.categories.filter((item) => item._id !== category._id)
          })
        }else {
          this.setState({
            subCategories: this.state.subCategories.filter((item) => item._id !== category._id)
          })
        }

        // 删除品类成功，对话框隐藏，删除列表项，提示成功信息
        message.success('删除品类成功~', 2) // 提示时间2s
      }
    }
  }

  // '查看其子品类'按钮的点击事件
  showSubCategory = (category) => {
    return async () => {
      // 存储二级分类的一级分类对象 --> category --> 到时候点击'查看其子品类'按钮进入二级分类显示页后，如果要添加分类的话就会用上！
      this.parentCategory = category

      // 请求二级分类数据
      this.fetchCategories(category._id)
    }
  }

  // 在二级分类显示界面，点击'一级分类'按钮，返回至一级分类列表即显示一级分类列表
  goBack = () => {
    this.setState({
      isShowSubCategories: false,
    })
  }

  render() {
    const {
      categories,
      subCategories,
      isShowSubCategories,
      isShowAddCategory,
      isShowRenameCategory,
      isLoading
    } = this.state

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
        // dataIndex: '_id', // 这句话如果不写，下面的category为当前页分类项的整个对象，如果这里写的是dataIndex: '_id'，下面的category就为当前页分类项的对象中_id的值

        // 改变当列的显示
        render: category => {
          // {parentId: "0", _id: "5d11816402e1ce1090ed8fbf", name: "电脑", __v: 0}
          // console.log(category); // 当前页分类项有几个，就会一次性显示几个对象
          // this.category = category // 不能在这存信息，因为当前页分类项有几个，这句话就会执行几次，导致最后只存了当前页最后一个列表项的对象数据。在'修改名称'按钮的点击事件里面存

          // 多个虚拟DOM对象必须要有一个根标签包裹
          return <div>
            <MyButton onClick={this.saveCategoryInfo(category)}>修改名称</MyButton>
            {
              isShowSubCategories? null : <MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>
            }
            <MyButton onClick={this.deleteCategory(category)}>删除品类</MyButton>
          </div>
        }
      }
    ];

    // 决定表格里面的数据
    /*const data = [
      {
        key: '1',
        name: '手机',
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

    return <Card title={isShowSubCategories? <div><MyButton onClick={this.goBack}>一级分类</MyButton><Icon type="arrow-right" />&nbsp;{this.parentCategory.name}</div> : "一级分类列表"} extra={<Button type="primary" onClick={this.toggleDisplay('isShowAddCategory', true)}><Icon type="plus" />添加品类</Button>}>
      {/*带边框的Table表格*/}
      <Table
        columns={columns}
        dataSource={isShowSubCategories? subCategories : categories} // 展示数据
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true // 至少有2页才看得见
        }}
        rowKey="_id" // 解决报错 通过api接口可以看到请求回来的每个列表对应的对象都有个"_id"属性
        loading={isLoading}
      />

      <Modal
        title="添加分类"
        visible={isShowAddCategory}
        onOk={this.addCategory}
        onCancel={this.toggleDisplay('isShowAddCategory', false)}
        okText="确认"
        cancelText="取消"
      >
        {/*使用表单项，可以收集数据*/}
        {/*wrappedComponentRef中的参数form代表AddCategoryForm组件的实例对象*/}
        <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
    </Modal>

      <Modal
        title="修改分类名称"
        visible={isShowRenameCategory}
        onOk={this.renameCategory}
        onCancel={this.cancelRenameCategory}
        okText="确认"
        cancelText="取消"
        width={300} // 修改对话框的宽度
      >
        {/*使用表单项，可以收集数据*/}
        {/*wrappedComponentRef中的参数form代表AddCategoryForm组件的实例对象*/}
        <RenameCategoryForm categoryName={this.category.name} wrappedComponentRef={(form) => this.renameCategoryForm = form}/>
      </Modal>
  </Card>;
  }
}