<template>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500px"
        destroy-on-close
    >
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="80px"
        >
            <el-form-item label="用户名" prop="username">
                <el-input
                    v-model="form.username"
                    placeholder="请输入用户名"
                    :disabled="isEdit"
                />
                <div v-if="isEdit" style="color:#909399;font-size:12px;margin-top:4px;">
                    用户名不可修改
                </div>
            </el-form-item>

            <el-form-item label="密码" prop="password" :required="!isEdit">
                <el-input
                    v-model="form.password"
                    :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
                    type="password"
                    show-password
                />
            </el-form-item>
             <el-form-item label="确认密码" prop="confirmPassword" :required="!isEdit">
      <el-input
      v-model="form.confirmPassword"
      type="password"
      show-password
      :placeholder="isEdit ? '修改密码时需再次确认' : '再次输入密码'"
      />
    </el-form-item>

            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入昵称" />
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入电话" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="部门" prop="department">
                <el-select v-model="form.department" placeholder="请选择部门" clearable style="width: 100%">
                    <el-option label="人事部门" value="人事部门" />
                    <el-option label="管理部门" value="管理部门" />
                    <el-option label="财务部门" value="财务部门" />
                </el-select>
            </el-form-item>

            <el-form-item label="职位" prop="position">
                <el-select v-model="form.position" placeholder="请选择职位" clearable style="width: 100%">
                    <el-option label="经理" value="经理" />
                    <el-option label="副经理" value="副经理" />
                    <el-option label="员工" value="员工" />
                </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :value="1">启用</el-radio>
                    <el-radio :value="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitting">
                {{ isEdit ? '保存修改' : '确认新增' }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { registerUser, updateUser } from '../api/user.js'

const props = defineProps({
    visible: Boolean,
    editData: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref(null)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('新增用户')

const defaultForm = () => ({
    id: null,
    username: '',
    password: '',
    nickname: '',
    phone: '',
    email: '',
    department: '',
    position: '',
    confirmPassword: '',
    status: 1
})

const form = reactive(defaultForm())

const rules = computed(() => ({
    username: [
        { required: !isEdit.value, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名 3-20 位', trigger: 'blur' }
    ],
    password: [
        {
            validator(rule, value, callback) {
                if (!isEdit.value && !value) {
                    callback(new Error('请输入密码'))
                } else if (value && (value.length < 6 || value.length > 16)) {
                    callback(new Error('密码长度 6-16 位'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    nickname: [
        { required: !isEdit.value, message: '请输入昵称', trigger: 'blur' }
    ],
    phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机号', trigger: 'blur' }
    ],
    email: [
        { type: 'email', message: '请输入正确邮箱', trigger: 'blur' }
    ],
    confirmPassword: [
        {
            validator(rule, value, callback) {
                if (!form.password) {
                    // 未填写密码（编辑模式留空）时无需确认
                    callback()
                } else if (!value) {
                    callback(new Error('请再次输入密码'))
                } else if (value !== form.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}))

const resetForm = () => {
    Object.assign(form, defaultForm())
    nextTick(() => {
        formRef.value?.clearValidate()
    })
}

const openDialog = () => {
    dialogVisible.value = true
    if (props.editData) {
        isEdit.value = true
        dialogTitle.value = '编辑用户'
        Object.assign(form, {
            id: props.editData.id,
            username: props.editData.username || '',
            password: '',
            nickname: props.editData.nickname || '',
            phone: props.editData.phone || '',
            email: props.editData.email || '',
            department: props.editData.department || '',
            position: props.editData.position || '',
            status: props.editData.status ?? 1
        })
    } else {
        isEdit.value = false
        dialogTitle.value = '新增用户'
        resetForm()
    }
}

const submitForm = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
    } catch {
        return // 验证未通过
    }

    submitting.value = true
    try {
        const submitData = { ...form }
        delete submitData.confirmPassword
        // 编辑模式下密码留空则不修改密码
        if (isEdit.value && !submitData.password) {
            delete submitData.password
        }

        const res = isEdit.value
            ? await updateUser(submitData)
            : await registerUser(submitData)

        if (res.code === 200) {
            ElMessage.success(isEdit.value ? '修改成功！' : '新增成功！')
            dialogVisible.value = false
            emit('success')
        } else {
            ElMessage.error(res.message || '操作失败')
        }
    } catch (err) {
        // 错误已在拦截器中处理
    } finally {
        submitting.value = false
    }
}

watch(() => props.visible, (val) => {
    if (val) {
        openDialog()
    } else {
        dialogVisible.value = false
    }
})

watch(dialogVisible, (val) => {
    emit('update:visible', val)
})
</script>
