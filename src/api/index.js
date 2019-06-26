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
 * 请求天气接口的实现(用jsonp发送请求，可以在github中搜封装好的库)
 * jsonp只能发get请求!
 * @returns {Promise<any>}
 */
export const reqWeather = function () {
  let cancelFn = null
  // 执行31行代码的时候会直接立即执行里面的回调函数-->发送请求-->return返回值，这些都是同步代码，请求发送成功后会触发回调函数function(err, data){}，这个回调函数是异步的，异步代码要等同步代码全部执行完毕才会执行
  // 想要得到异步方法的返回值 --> 包裹一层Promise对象
  const promise =  new Promise((resolve, reject) => {
    // jsonp这个方法的返回值是一个函数，调用该函数可以取消正在进行的json请求
    cancelFn = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2', {}, function (err, data) {
      if(!err) {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]

        resolve({
          weatherImg: dayPictureUrl,
          weather
        })
      } else {
        message.error('请求天气信息失败~请刷新试试~')
        resolve() // 还是得调用resolve()，否则外面会卡死，只是里面不传任何数据(不让promise变为成功状态的话，await会一直等，后面的代码(只针对当前async函数中await后面的代码会等，函数外的不会等)不会执行)
      }
    })
  })

  return {
    promise,
    cancelFn
  }
}

// 请求商品/品类管理的数据列表
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId}) // 默认就是get请求

// 请求添加品类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')

// 请求更改分类名称
export const reqRenameCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

// 请求删除品类
export const reqDeleteCategory = (categoryId) => ajax('/manage/category/delete', {categoryId}, 'POST')

