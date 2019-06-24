const USER_KEY = 'USER_KEY'; // 可以随便写，只是习惯这样的写法
const USER_TIME = 'USER_TIME'
const EXPIRES_IN = 1000 * 3600 * 24 * 7 // 过期时间 7天

// 存储登录数据 localstorage/session(关闭浏览器数据就没有了)

export const setItem = function (data) {
  // 储存用户第一次登录时间
  localStorage.setItem(USER_TIME, Date.now())
  // 储存用户数据
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const getItem = function () {
  const startTime = localStorage.getItem(USER_TIME)

  if(Date.now() - startTime > EXPIRES_IN) {
    // 过期了~清除用户信息
    removeItem()
    return {}
  }
  // 没有过期   记得要转化为对象
  return JSON.parse(localStorage.getItem(USER_KEY))
}

export const removeItem = function () {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(USER_TIME)
}