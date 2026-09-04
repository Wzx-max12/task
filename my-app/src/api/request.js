import axios from 'axios'

const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response) {
            const msg = error.response.data?.message || '请求失败'
            alert('错误：' + msg)
        } else {
            alert('网络连接失败，请检查后端是否启动')
        }
        return Promise.reject(error)
    }
)

export default request