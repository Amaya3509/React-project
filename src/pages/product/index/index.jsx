import React, { Component } from 'react';
import { Card, Button, Icon, Table, Select, Input } from 'antd';

import MyButton from '../../../components/my-button';
import { reqProducts } from '../../../api';
import './index.less';

const { Option } = Select;

export default class Index extends Component {
  state = {
    products: [],
  };

  // 一点开就要发送请求，显示商品数据
  async componentDidMount() {
    const result = await reqProducts(1, 3) // 第1页 默认显示3条数据
    if(result){
      this.setState({
        products: result.list
      })
    }
  }

  render() {

    const { products } = this.state;

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        className: 'product-status',
        title: '状态',
        dataIndex: 'status',
        render: (status) => { // state要么为1，要么为2
          return status === 1
            ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        className: 'product-status',
        title: '操作',
        // 这里是固定写法的2个按钮，就不用写dataIndex了，写dataIndex主要是为了给下面的render指明参数为当前列表项的哪个属性，不写dataIndex，代表传入的参数为当前列表项对应的整个产品数据对象
        render: (product) => {
          return <div>
            <MyButton>详情</MyButton>
            <MyButton>修改</MyButton>
          </div>
        }
      },
    ];

    return <Card
      title={
        <div>
          <Select defaultValue={0}>
            <Option key={0} value={0}>根据商品名称</Option>
            <Option key={1} value={1}>根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" className="search-input"/>
          <Button type="primary">搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={this.showAddProduct}><Icon type="plus"/>添加产品</Button>}
    >
      <Table
        columns={columns}
        dataSource={products}
        bordered // 加上边框
        pagination={{ // 分页器
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          // total,
          // onChange: this.getProducts,
          // onShowSizeChange: this.getProducts
        }}
        rowKey="_id"
        // loading={loading}
      />
    </Card>;
  }
}