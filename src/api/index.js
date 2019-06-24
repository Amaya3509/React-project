import ajax from "./ajax";

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