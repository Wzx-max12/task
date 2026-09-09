<template>
    <div>
        <!-- 统计卡片 -->
        <div class="stat-cards">
            <div class="stat-card">
                <div>
                    <span class="label">👤 总用户数</span>
                    <span class="value blue">{{ stats.total }}</span>
                </div>
                
            </div>
            <div class="stat-card">
                <div>
                    <span class="label">✅ 启用用户</span>
                    <span class="value green">{{ stats.active }}</span>
                </div>
               
            </div>
            <div class="stat-card">
                <div>
                    <span class="label">⛔ 禁用用户</span>
                    <span class="value orange">{{ stats.inactive }}</span>
                </div>
               
            </div>
            <div class="stat-card">
                <div>
                    <span class="label">📅 7日新增</span>
                    <span class="value purple">{{ stats.recentWeek }}</span>
                </div>
            
            </div>
        </div>

        <!-- 状态分布 -->
        <div class="card-box">
            <h3 style="margin-bottom:12px;">📊 用户状态分布</h3>
            <div class="legend">
                <div>
                    <span class="dot green"></span> 启用
                    <strong>{{ stats.active }}</strong> 人
                    <span style="color:#909399;font-size:13px;">({{ activePercent }})</span>
                </div>
                <div>
                    <span class="dot red"></span> 禁用
                    <strong>{{ stats.inactive }}</strong> 人
                    <span style="color:#909399;font-size:13px;">({{ inactivePercent }})</span>
                </div>
                <div style="color:#909399;">
                    总用户：<strong>{{ stats.total }}</strong>
                </div>
            </div>
            <div class="status-bar">
                <div class="active" :style="{ width: activePercent }"></div>
                <div class="inactive" :style="{ width: inactivePercent }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { getStatsSummary } from '../api/user.js'

// 数据状态
const stats = reactive({
    total: 0,
    active: 0,
    inactive: 0,
    recentWeek: 0
})

const loading = ref(false)

// ✅ computed：百分比（自动计算，不用每次调用函数）
const activePercent = computed(() => {
    if (stats.total === 0) return '0%'
    return ((stats.active / stats.total) * 100).toFixed(1) + '%'
})

const inactivePercent = computed(() => {
    if (stats.total === 0) return '0%'
    return ((stats.inactive / stats.total) * 100).toFixed(1) + '%'
})

// 加载统计数据
const loadStats = async () => {
    loading.value = true
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
        console.error('统计加载失败:', err)
    } finally {
        loading.value = false
    }
}

// 暴露给父组件
defineExpose({ loadStats })

// 生命周期：页面加载时自动获取统计
onMounted(() => {
    loadStats()
})
</script>
