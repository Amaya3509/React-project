import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

class RenameCategoryForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  };

  validator = (rule, value, callback) => {
    if (!value) {
      callback('请输入分类名称');
    } else if (value === this.props.categoryName) {
      callback('请不要输入之前名称~');
    } else {
      callback(); // 输入的值正确也要调用callback
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return <Form>
      <Form.Item>
        {
          getFieldDecorator(
            'categoryName',
            {
              initialValue: this.props.categoryName, // 默认值
              rules: [{
                validator: this.validator
              }]
            }
          )(
            <Input />
          )
        }
      </Form.Item>
    </Form>;
  }
}

export default Form.create()(RenameCategoryForm);