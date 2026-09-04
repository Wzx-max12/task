import request from './request.js'

// 分页查询
export const getUserPage = (params) => {
    return request.get('/user/page', { params })
}

// 新增
export const registerUser = (data) => {
    return request.post('/user/register', data)
}

// 修改
export const updateUser = (data) => {
    return request.put('/user/update', data)
}

// 删除
export const deleteUser = (id) => {
    return request.delete(`/user/${id}`)
}

// 统计
export const getStatsSummary = () => {
    return request.get('/user/stats/summary')
}