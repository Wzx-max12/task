<template>
    <div>
        <!-- 头部 -->
        <header class="header">
            <div>
                <h1>👥 用户管理系统</h1>
                <div class="sub">SpringBoot + Vue 3</div>
            </div>
            <div class="tab-btns">
                <el-button
                    :class="{ 'is-active': activeTab === 'list' }"
                    @click="activeTab = 'list'"
                    plain
                >
                    用户列表
                </el-button>
                <el-button
                    :class="{ 'is-active': activeTab === 'stats' }"
                    @click="activeTab = 'stats'"
                    plain
                >
                    数据统计
                </el-button>
            </div>
        </header>

        <!-- 列表 -->
        <div v-show="activeTab === 'list'">
            <div class="card-box">
                <UserTable
                    ref="tableRef"
                    v-model:query="query"
                    @add="openAddDialog"
                    @edit="openEditDialog"
                    @dataChanged="onDataChanged"
                />
            </div>
        </div>

        <!-- 统计 -->
        <div v-show="activeTab === 'stats'">
            <UserStats ref="statsRef" />
        </div>

        <!-- 弹窗 -->
        <UserForm
            v-model:visible="dialogVisible"
            :edit-data="editData"
            @success="onFormSuccess"
        />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import UserTable from './components/UserTable.vue'
import UserForm from './components/UserForm.vue'
import UserStats from './components/UserStats.vue'

const activeTab = ref('list')
const dialogVisible = ref(false)
const editData = ref(null)

const query = reactive({
    username: '',
    status: null,
    pageNum: 1,
    pageSize: 10
})

const tableRef = ref(null)
const statsRef = ref(null)

const openAddDialog = () => {
    editData.value = null
    dialogVisible.value = true
}

const openEditDialog = (row) => {
    editData.value = { ...row }
    dialogVisible.value = true
}

const onFormSuccess = () => {
    dialogVisible.value = false
    tableRef.value?.loadData()
    statsRef.value?.loadStats()
}

const onDataChanged = () => {
    statsRef.value?.loadStats()
}
</script>

<style scoped>
/* 头部 */
.header {
    background: linear-gradient(135deg, #409EFF, #2d6bb8);
    color: #fff;
    padding: 18px 30px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.header h1 {
    font-size: 22px;
}
.header .sub {
    font-size: 13px;
    opacity: 0.8;
}


/* 统计卡片 */
.stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}
.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 18px 22px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
}
.stat-card .label {
    font-size: 13px;
    color: #909399;
    white-space: nowrap;
}
.stat-card .value {
    font-size: 28px;
    font-weight: 700;
    white-space: nowrap;
}
.stat-card .value.green { color: #67C23A; }
.stat-card .value.orange { color: #E6A23C; }
.stat-card .value.blue { color: #409EFF; }
.stat-card .value.purple { color: #9B59B6; }
.stat-card .icon {
    font-size: 30px;
    opacity: 0.5;
}

/* 卡片容器 */
.card-box {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 搜索栏 */
.search-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
}
.search-bar :deep(.el-input) {
    width: 180px;
}

/* 操作栏 */
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
}

/* 分页 */
.pagination-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

/* 状态分布 */
.legend {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    padding: 10px 0;
}
.legend > div {
    white-space: nowrap;
}
.legend .dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 6px;
}
.legend .dot.green { background: #67C23A; }
.legend .dot.red { background: #F56C6C; }

.status-bar {
    display: flex;
    height: 12px;
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
    margin-top: 8px;
}
.status-bar .active { background: #67C23A; }
.status-bar .inactive { background: #F56C6C; }

/* 切换按钮 */
.tab-btns {
    display: flex;
    gap: 10px;
}
.tab-btns :deep(.el-button) {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
}
.tab-btns :deep(.el-button.is-active) {
    background: rgba(255, 255, 255, 0.2);
    border-color: #fff;
}
</style>
