<template>
    <div>
        <!-- 统计卡片 -->
        <div class="stat-cards">
            <div class="stat-card">
                <div>
                    <div class="label">👤 总用户数</div>
                    <div class="value blue">{{ stats.total }}</div>
                </div>
                <span class="icon">👥</span>
            </div>
            <div class="stat-card">
                <div>
                    <div class="label">✅ 启用用户</div>
                    <div class="value green">{{ stats.active }}</div>
                </div>
                <span class="icon">✔️</span>
            </div>
            <div class="stat-card">
                <div>
                    <div class="label">⛔ 禁用用户</div>
                    <div class="value orange">{{ stats.inactive }}</div>
                </div>
                <span class="icon">🚫</span>
            </div>
            <div class="stat-card">
                <div>
                    <div class="label">📅 7日新增</div>
                    <div class="value purple">{{ stats.recentWeek }}</div>
                </div>
                <span class="icon">🆕</span>
            </div>
        </div>

        <!-- 状态分布 -->
        <div class="card-box">
            <h3 style="margin-bottom:12px;">📊 用户状态分布</h3>
            <div class="legend">
                <div>
                    <span class="dot green"></span> 启用
                    <strong>{{ stats.active }}</strong> 人
                    <span style="color:#909399;font-size:13px;">({{ getPercent('active') }})</span>
                </div>
                <div>
                    <span class="dot red"></span> 禁用
                    <strong>{{ stats.inactive }}</strong> 人
                    <span style="color:#909399;font-size:13px;">({{ getPercent('inactive') }})</span>
                </div>
                <div style="color:#909399;">
                    总用户：<strong>{{ stats.total }}</strong>
                </div>
            </div>
            <div class="status-bar">
                <div class="active" :style="{ width: getPercent('active') }"></div>
                <div class="inactive" :style="{ width: getPercent('inactive') }"></div>
            </div>
            <div style="margin-top:16px;">
                <el-button type="primary" @click="loadStats">刷新统计</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getStatsSummary } from '../api/user.js'
const stats = reactive({
    total: 0,
    active: 0,
    inactive: 0,
    recentWeek: 0
})

const loadStats = async () => {
    try {
        const res = await getStatsSummary()
        if (res.code === 200) {
            const d = res.data || {}
            stats.total = d.total ?? 0
            stats.active = d.active ?? 0
            stats.inactive = d.inactive ?? 0
            stats.recentWeek = d.recentWeek ?? 0
        }
    } catch (err) {
        console.error('统计加载失败', err)
    }
}

const getPercent = (type) => {
    if (stats.total === 0) return '0%'
    const count = type === 'active' ? stats.active : stats.inactive
    return ((count / stats.total) * 100).toFixed(1) + '%'
}

defineExpose({ loadStats })

onMounted(() => {
    loadStats()
})
</script>