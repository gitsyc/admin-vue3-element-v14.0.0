import request from '@/utils/http'
import { mockLogin, mockGetUserInfo } from '@/mock/auth'

// 是否使用 Mock 模式（产品经理演示模式，无需后端）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  // Mock 模式：返回符合 HTTP 响应格式的 Mock 数据
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const result = mockLogin(params.userName, params.password)
        if (result) {
          // 返回符合 HTTP 响应格式的数据
          resolve({
            code: 200,
            data: result,
            message: '登录成功'
          })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 500) // 模拟网络延迟
    })
  }

  // 真实 API 模式
  return request.post<Api.Auth.LoginResponse>({
    url: '/admin/login',
    params
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  // Mock 模式：返回符合 HTTP 响应格式的 Mock 数据
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const userInfo = mockGetUserInfo(token)
          if (userInfo) {
            // 返回符合 HTTP 响应格式的数据
            resolve({
              code: 200,
              data: userInfo,
              message: '获取用户信息成功'
            })
          } else {
            reject(new Error('Token 无效'))
          }
        } else {
          reject(new Error('未登录'))
        }
      }, 300) // 模拟网络延迟
    })
  }

  // 真实 API 模式
  return request.get<Api.Auth.UserInfo>({
    url: '/admin/user/info'
  })
}
