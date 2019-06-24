import axios from 'axios'
import { message } from 'antd'

/*
 * 统一处理错误响应结果
 *
 * @param url
 * @param data
 * @param method
 * @returns 返回值一定是成功状态promise对象（请求成功里面有数据，请求失败里面没有）
 */

export default function ajax(url, data = {}, method = 'GET') { // 给形参赋默认值
  // 发送请求，请求登录
  // yarn add axios 看api文档接口怎么发送请求，拿到api文档使用接口之前，记得测试一下(Postman工具，如果是测试post请求，记得选post --> Body --> x-www-form-urlencoded)

  let reqParams = data
  method = method.toLowerCase()
  if(method === 'get') {
    reqParams = {
      params: data
    }
  }

  // ajax()返回值是后面表达式axios.post()的值
  // axios.post()的整体结果看then/catch中回调函数的返回值
  return axios[method](url, reqParams)
    .then((res) => {
      // console.log(res);

      // 获取请求回来的数据
      // const data = res.data
      const {data} = res

      if (data.status === 0) {
        // 请求成功
        // 返回一个成功状态的promise对象，内部有return后面的数据(data.data)
        return data.data;
      } else {
        // 请求失败  给用户提示错误信息
        message.error(data.msg, 2);
      }
    })
    .catch((err) => {
      // 请求失败: 网络错误、服务器内部错误等
      message.error('网络出现异常，请刷新重试~', 2)
    })
}