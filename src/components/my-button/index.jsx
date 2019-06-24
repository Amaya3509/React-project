import React from 'react';

import './index.less';

// 功能比较简单，定义成工厂函数组件就可以了
export default function MyButton(props) {
  // console.log(props); // {children: "退出"}
  // 组件内包含的内容会挂载到组件的 props.children
  return <button className="my-button" {...props}/>;
}