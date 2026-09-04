<template>
    <div>
        <!-- 搜索栏 -->
        <div class="action-bar">
            <div class="search-bar">
                <el-input
                    v-model="searchUsername"
                    placeholder="搜索用户名"
                    clearable
                    @clear="handleSearch"
                    @keyup.enter="handleSearch"
                />
                <el-select
                    v-model="searchStatus"
                    placeholder="全部状态"
                    clearable
                    @change="handleSearch"
                >
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                </el-select>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </div>
            <el-button type="primary" @click="emit('add')">
                + 新增用户
            </el-button>
        </div>

        <!-- 表格 -->
        <el-table
            :data="tableData"
            border
            stripe
            v-loading="loading"
            style="width: 100%"
        >
            <el-table-column type="index" label="#" width="55" />
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="nickname" label="昵称" width="120" />
            <el-table-column prop="phone" label="电话" width="130" />
            <el-table-column prop="email" label="邮箱" min-width="170" />
            <el-table-column prop="status" label="状态" width="80" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                        {{ row.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="160">
                <template #default="{ row }">
                    {{ formatTime(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right" align="center">
                <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="emit('edit', row)">
                        编辑
                    </el-button>
                    <el-button type="danger" link size="small" @click="handleDelete(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-box">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 50]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="loadData"
                @current-change="loadData"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getUserPage, deleteUser } from '../api/user.js'

// ===== props =====
const props = defineProps({
    query: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['add', 'edit', 'dataChanged', 'update:query'])

// ===== 状态 =====
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const pageNum = ref(props.query.pageNum || 1)
const pageSize = ref(props.query.pageSize || 10)
const searchUsername = ref(props.query.username || '')
const searchStatus = ref(props.query.status ?? null)

// ===== 方法 =====
const loadData = async () => {
    loading.value = true
    try {
        const params = {
            username: searchUsername.value,
            status: searchStatus.value,
            pageNum: pageNum.value,
            pageSize: pageSize.value
        }
        const res = await getUserPage(params)
        if (res.code === 200) {
            tableData.value = res.data?.list || []
            total.value = res.data?.total || 0
            // 同步到父组件
            emit('update:query', params)
        }
    } catch (err) {
        // 错误已在拦截器中处理
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    pageNum.value = 1
    loadData()
}

const resetSearch = () => {
    searchUsername.value = ''
    searchStatus.value = null
    pageNum.value = 1
    loadData()
}

const formatTime = (t) => {
    if (!t) return '-'
    return t.replace('T', ' ').slice(0, 16)
}

const handleDelete = (row) => {
    if (!confirm(`确定要删除用户「${row.username}」吗？`)) return

    deleteUser(row.id).then((res) => {
        if (res.code === 200) {
            alert('删除成功！')
            loadData()
            emit('dataChanged')
        } else {
            alert(res.message || '删除失败')
        }
    }).catch(() => {})
}

// 暴露给父组件
defineExpose({ loadData })

// 监听父组件 query 变化
watch(() => props.query, (newVal) => {
    if (newVal) {
        searchUsername.value = newVal.username || ''
        searchStatus.value = newVal.status ?? null
        pageNum.value = newVal.pageNum || 1
        pageSize.value = newVal.pageSize || 10
    }
}, { deep: true, immediate: true })
</script>