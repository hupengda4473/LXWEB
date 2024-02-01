<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增指令' : '编辑指令'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="100"
                ref="formRef"
                :size="formSize"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="指令标题" path="Title">
                    <n-input clearable v-model:value="compData.data.Title" type="text" placeholder="请输入名称" />
                </n-form-item>
                <n-form-item label="指令类别" path="InstType">
                    <n-select
                        v-model:value="compData.data.InstType"
                        filterable
                        clearable
                        placeholder="请选择指令类别"
                        :options="instructType"
                    />
                </n-form-item>
                <n-form-item label="执行人" path="ExecutorId">
                    <n-select
                        v-model:value="compData.data.ExecutorId"
                        label-field="UserName"
                        value-field="UserID"
                        filterable
                        clearable
                        placeholder="请选择执行人"
                        :options="compData.userList"
                    />
                </n-form-item>
                <n-form-item label="指令详情" path="InstContent">
                    <n-input clearable v-model:value="compData.data.InstContent" type="textarea" placeholder="请输入详情" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-flex justify="end">
                    <n-space>
                        <n-button @click="compData.showAddModal = false">取消</n-button>
                        <n-button type="success" @click="drawerConfirm">确认</n-button>
                    </n-space>
                </n-flex>

            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, reactive, ref} from "vue"
import {FormInst, useMessage} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {formSize, instructType} from '@/app/admin/config/config'
import appPinia from "@/packages/pinia/app"
import {AddDispatchInstruction, ModifyDispatchInstruction} from "@/app/admin/api/dispatchInstruction"

const message = useMessage()

type Song = {
    showAddModal: boolean,
    type: string,
    userList: [],
    data: AddParams
}
type AddParams = {
    DispId: string | number,
    Title: string,
    InstType: string | number | null,
    ExecutorId : string | number | null,
    InstContent : string,
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    userList: [],
    data: {
        DispId: 0,
        Title: '',
        InstContent: '',
        InstType: null,
        ExecutorId : null,
    }
})

const rules = {
    Title: {
        required: true,
        message: '请输入指令名称',
        trigger: ['input', 'blur']
    },
    InstContent: {
        required: true,
        message: '请输入指令详情',
        trigger: ['input', 'blur']
    },
    InstType: {
        required: true,
        message: '请选择指令类别',
    },
    ExecutorId: {
        required: true,
        message: '请选择执行人',
    },
}

const openModal = ({type = 'add', itemData = {}, userList = []}: { type?: string; itemData?: object ;userList?: []}) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        DispId: 0,
        Title: '',
        InstContent: '',
        InstType: null,
        ExecutorId : null,
    }
    compData.userList = userList
    if (type === 'edit') {
        compData.data = deepCopy(itemData)
    }
}


//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = deepCopy(compData.data)
            params.DispTime = new Date().format('yyyy-MM-dd hh:mm:ss')
            const appStore = appPinia()
            params.UserId = appStore.userInfo.UserID
            if (compData.type === 'add') {
                AddDispatchInstruction( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyDispatchInstruction( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("修改失败，请重试")
                    } else {
                        message.success("修改成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            }
        }
    })
}


defineExpose({
    openModal,
})
</script>
