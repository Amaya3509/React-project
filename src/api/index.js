import ajax from "./ajax";
import jsonp from 'jsonp'
import { message } from 'antd'

// export const reqLogin = (data) => ajax('/login', data, 'POST')

// 请求参数3-4个以上使用
// export const reqLogin = ({username,passsword}) => ajax('/login', {username,passsword}, 'POST') // 传一个参数，参数是一个对象

// 请求参数1-2个使用
/**
 * 请求登录函数
 * @param username 用户名
 * @param password 密码
 * @returns {返回值一定成功状态promise（请求成功里面有数据，请求失败里面没有）}
 */
// 分别暴露
export const reqLogin = (username,password) => ajax('/login', {username,password}, 'POST')

/*
 * 请求验证用户信息
 * @param id
 * @returns {返回值一定成功状态promise（请求成功里面有数据，请求失败里面没有）}
 */
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST')

/*
 * 请求天气(用jsonp发送请求，可以在github中搜封装好的库)
 * jsonp只能发get请求!
 * @returns {Promise<any>}
 */
export const reqWeather = function () {
  jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2', {}, function (err, data) {
    if(!err) {
      const { dayPictureUrl, weather } = data.results[0].weather_data[0]

      // 这样写
      return {
        weatherImg: dayPictureUrl,
        weather
      }
    } else {
      message.error('请求天气信息失败~请刷新试试~')
    }
  })
}

