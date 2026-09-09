<template>
    <div>
        <!-- 搜索栏 -->
        <div class="action-bar">
            <div class="search-bar">
                <el-input
                    v-model="searchUsername"
                    placeholder="搜索用户名"
                    clearable
                    @keyup.enter="handleSearch"
                />
                <el-select
                    v-model="searchStatus"
                    placeholder="全部状态"
                    clearable
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
            @sort-change="handleSortChange"
        >
            <el-table-column type="index" label="#" width="55" />
            <el-table-column prop="username" label="用户名" width="120" sortable="custom" />
            <el-table-column prop="nickname" label="昵称" width="120" />
            <el-table-column prop="phone" label="电话" width="130" />
            <el-table-column prop="email" label="邮箱" min-width="170" />
            <el-table-column prop="status" label="状态" width="80" align="center" sortable="custom">
                <template #default="{ row }">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                        {{ row.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="160" sortable="custom">
                <template #default="{ row }">
                    {{ formatTime(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="160" sortable="custom">
                <template #default="{ row }">
                    {{ formatTime(row.updateTime) }}
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
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserPage, deleteUser } from '../api/user.js'

const props = defineProps({
    query: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['add', 'edit', 'dataChanged', 'update:query'])

// 搜索条件
const pageNum = ref(props.query.pageNum || 1)
const pageSize = ref(props.query.pageSize || 10)
const searchUsername = ref(props.query.username || '')
const searchStatus = ref(props.query.status ?? null)
const sortField = ref(props.query.sortField || '')
const sortOrder = ref(props.query.sortOrder || '')

const searchParams = computed(() => ({
    username: searchUsername.value,
    status: searchStatus.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value
}))

// 数据状态
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

// 加载数据
const loadData = async () => {
    const params = searchParams.value
    loading.value = true

    try {
        const res = await getUserPage(params)
        if (res.code === 200) {
            const { list = [], total: totalCount = 0 } = res.data || {}
            tableData.value = list
            total.value = totalCount
            emit('update:query', params)
        }
    } catch (err) {
        console.error('加载失败:', err)
    } finally {
        loading.value = false
    }
}

// 搜索
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

// 排序
const handleSortChange = ({ prop, order }) => {
    sortField.value = order ? prop : ''
    sortOrder.value = order || ''
    pageNum.value = 1
    loadData()
}

// 格式化时间
const formatTime = (t) => {
    if (!t) return '-'
    return t.replace('T', ' ').slice(0, 16)
}

// 删除
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户「${row.username}」吗？`,
            '提示',
            { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        )
    } catch {
        return // 取消删除
    }

    try {
        const res = await deleteUser(row.id)
        if (res.code === 200) {
            ElMessage.success('删除成功！')
            loadData()
            emit('dataChanged')
        } else {
            ElMessage.error(res.message || '删除失败')
        }
    } catch (err) {
        console.error('删除报错：', err)
    }
}

// 暴露给父组件
defineExpose({ loadData })

// 监听父组件 query 变化（脏检查避免循环触发）
watch(() => props.query, (newVal) => {
    if (!newVal) return
    const changes = []
    if (searchUsername.value !== (newVal.username || '')) changes.push(() => { searchUsername.value = newVal.username || '' })
    if (searchStatus.value !== (newVal.status ?? null)) changes.push(() => { searchStatus.value = newVal.status ?? null })
    if (pageNum.value !== (newVal.pageNum || 1)) changes.push(() => { pageNum.value = newVal.pageNum || 1 })
    if (pageSize.value !== (newVal.pageSize || 10)) changes.push(() => { pageSize.value = newVal.pageSize || 10 })
    changes.forEach(fn => fn())
}, { deep: true })

// 首次加载
onMounted(() => {
    loadData()
})
</script>
