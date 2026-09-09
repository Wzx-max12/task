import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器：自动携带 token
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            const { status, data } = error.response
            const msg = data?.message || '请求失败'

            // 401 未授权：跳转登录
            if (status === 401) {
                localStorage.removeItem('token')
                ElMessage.error('登录已过期，请重新登录')
            } else {
                ElMessage.error(msg)
            }
        } else {
            ElMessage.error('网络连接失败，请检查后端是否启动')
        }
        return Promise.reject(error)
    }
)

export default request
