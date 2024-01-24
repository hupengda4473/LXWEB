<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 500px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增用户' : '编辑用户'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                ref="formRef"
                label-width="100px"
                :size="formSize"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="管理人员" path="Personnel">
                    <n-select
                        :disabled="compData.type === 'edit'"
                        v-model:value="compData.data.NickName"
                        placeholder="请选择管理人员"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="用户名" path="UserName">
                    <n-input
                        :disabled="compData.type === 'edit'"
                        v-model:value="compData.data.UserName"
                        type="text"
                        placeholder="请输入用户名" />
                </n-form-item>
                <n-form-item label="密码" path="passwordNew">
                    <n-input
                        v-model:value="compData.data.PassWord"
                        type="password"
                        show-password-on="mousedown"
                        placeholder="请输入密码"
                        :input-props="{ autoComplete: 'new-password' }"
                        @keydown.enter.prevent
                    >
                    </n-input>
                </n-form-item>
<!--                <n-form-item label="密码" path="password">-->
<!--                    <n-input :input-props="{ autoComplete: 'new-password' }" v-model:value="compData.data.PassWord" type="password" show-password-on="mousedown" placeholder="请输入密码" />-->
<!--                </n-form-item>-->
                <n-form-item label="确认密码" path="passwordConfirm">
                    <n-input
                        :disabled="!compData.data.PassWord"
                        :input-props="{ autoComplete: 'new-password' }"
                        v-model:value="compData.data.passwordConfirm"
                        type="password"
                        show-password-on="mousedown"
                        placeholder="请再次输入密码"
                    />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-flex justify="end">
                    <n-space>
                        <n-button @click="compData.showAddModal = false">取消</n-button>
                        <n-button :loading="compData.loading" type="success" @click="drawerConfirm">确认</n-button>
                    </n-space>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, onMounted, reactive, ref} from "vue"
import {FormInst, useMessage, FormItemRule, FormItemInst} from "naive-ui"
import {getAllPersonnel} from '@/app/admin/api/personnel'
import {editUsers, addUsers} from '@/app/admin/api/user'
import {formSize} from '@/app/admin/config/config'

const message = useMessage()

type AddParams = {
    UserID: number,
    UserName: string,
    NickName: string,
    PassWord: string | number,
    passwordConfirm: string | number,
}
type Song = {
    loading: boolean,
    showAddModal: boolean,
    type: string,
    AllPersonnel: object [],
    generalOptions: object [],
    data: AddParams
}
const compData = reactive<Song>({
    loading: false,
    showAddModal: false,
    type: 'add',
    AllPersonnel: [],
    generalOptions: [],
    data: {
        UserID: 0,
        UserName: '',
        NickName: '',
        PassWord: '',
        passwordConfirm: '',
    },
})

const rules = {
    UserName: [
        {
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur']
        }
    ],
    passwordNew: [
        {
            required: false,
            message: '请输入密码',
            trigger: ['input', 'blur']
        }
    ],
    passwordConfirm: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: ['input', 'blur']
        },
        {
            validator: validatePasswordStartWith,
            message: '两次密码输入不一致',
            trigger: 'input'
        },
        {
            validator: validatePasswordSame,
            message: '两次密码输入不一致',
            trigger: ['blur', 'password-input']
        }
    ]
}
function validatePasswordStartWith (
    rule: FormItemRule,
    value: string
): boolean {
    return (
        !!compData.data.PassWord &&
        compData.data.PassWord.startsWith(value) &&
        compData.data.PassWord.length >= value.length
    )
}
function validatePasswordSame (rule: FormItemRule, value: string): boolean {
    return value === compData.data.PassWord
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        UserID: 0,
        UserName: '',
        NickName: compData.generalOptions[0].value,
        PassWord: '',
        passwordConfirm: '',
    }
    if (type === 'edit') {
        compData.data.UserID = itemData.UserID
        compData.data.UserName = itemData.UserName
        compData.data.NickName = itemData.NickName
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            compData.loading = true
            if (compData.type === 'add') {
                addUsers( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        compData.loading = false
                        emit('refreshTable')
                    }
                })
            } else {
                editUsers( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("修改失败，请重试")
                    } else {
                        message.success("修改成功")
                        compData.loading = false
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            }
        }
    })
}

//获取所有人员
const getAllPersonnelData = () => {
    compData.loading = true
    compData.generalOptions = []
    let arr = []
    getAllPersonnel().then( res => {
        if (res.data && res.data.length > 0) {
            for (let item of res.data) {
                arr.push({
                    label: item.PersonName,
                    value: item.PersonName
                })
            }
        }
        compData.generalOptions = arr || []
        compData.loading = false
    })
}

onMounted(() => {
    getAllPersonnelData()
})

defineExpose({
    openModal,
})
</script>

<style scoped>

</style>
