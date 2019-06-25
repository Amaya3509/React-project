import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

class AddCategoryForm extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired
  };

  // 自定义校验规则 只要Input中一输入值就会触发validator这个函数
  validator = (rule, value, callback) => {
    if (!value) return callback('请输入分类名称~');
    const result = this.props.categories.find((category) => value === category.name)
    if(result) return callback('输入的分类名称已存在，请重新输入')
  };

  render() {
    // getFieldDecorator也是一个高阶组件，用于和表单进行双向绑定
    const { getFieldDecorator } = this.props.form;

    return <Form>
      <Item label="所属分类:">
        {
          getFieldDecorator(
            'parentId', // 名字要和发请求的参数名称一致 参考api文档
            {
              // 这里校不校验都无所谓，因为有默认值
              initialValue: '0'
            }
          )(
            /*以这种方式接收，Select中的defaultValue="0"就不起作用了，可以删除。这时候是像上面那样通过initialValue: '0'自己设置默认项*/
            <Select style={{ width: '100%' }} onChange={this.handleChange}>
              <Option value="0" key="0">一级分类</Option>
              {
                this.props.categories.map((category) => {
                  return <Option value={category._id} key={category._id}>{category.name}</Option>
                })
              }
            </Select>
          )
        }
      </Item>
      <Item label="分类名称:">
        {
          getFieldDecorator(
            'categoryName',
            // 这里没有默认值，必须做校验
            {
              rules: [
                // {required: true, message: '请输入分类名称！'}
                {
                  validator: this.validator // 自定义校验规则
                }
              ]
            }
          )(
            <Input placeholder="请输入分类名称"/>
          )
        }
      </Item>
    </Form>
  }
}

// 向AddCategoryForm组件中传递form属性(this.props.form)
export default Form.create()(AddCategoryForm);