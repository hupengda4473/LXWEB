<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 500px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增区域' : '编辑区域'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                ref="formRef"
                :model="compData.data"
                :rules="rules"
                :label-width="120"
            >
                <n-form-item label="机构名称" path="GroupName">
                    <n-input clearable v-model:value="compData.data.GroupName" type="text" placeholder="请输入机构名称" />
                </n-form-item>
                <n-form-item label="机构编码" path="GroupCode">
                    <n-input clearable v-model:value="compData.data.GroupCode" type="text" placeholder="请输入机构编码" />
                </n-form-item>
                <n-form-item label="上级机构" path="PID">
                    <n-cascader
                        v-model:value="compData.data.PID"
                        :options="compData.generalOptions"
                        :size="formSize"
                        :show-path="true"
                        :clearable="true"
                        placeholder="请选择上级机构"
                        check-strategy="all"
                        expand-trigger="hover"
                        label-field="GroupName"
                        value-field="GroupID"
                        children-field="Children"
                    />
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
import {defineEmits, defineExpose, onMounted, reactive, ref} from "vue"
import {FormInst, useMessage} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {addInstitution, getTree, modifyInstitution} from '@/app/admin/api/institution'
import {formSize} from '@/app/admin/config/config'
import {treeDeleteChildren} from "@/app/admin/untils/untils"

const message = useMessage()

type AddParams = {
    GroupID: number,
    GroupName: string | number,
    GroupCode: string | number,
    PID: string | number,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: any,
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    data: {
        GroupID: 0,
        GroupName: '',
        GroupCode: '',
        PID: '',
    },
})

const rules = {
    GroupName: {
        required: true,
        message: '请输入机构名称',
        trigger: ['input', 'blur']
    },
    GroupCode: {
        required: true,
        message: '请输入机构编码',
        trigger: ['input', 'blur']
    },
    // PID: {
    //     required: true,
    //     message: '请选择上级行政区域',
    //     trigger: ['input', 'blur']
    // },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        GroupID: 0,
        GroupName: '',
        GroupCode: '',
        PID: '',
    }
    if (type === 'edit') {
        compData.data = deepCopy(itemData)
        compData.data.PID = itemData.PID || ''
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            if (compData.type === 'add') {
                addInstitution( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyInstitution( compData.data ).then(res => {
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

//获取上级机构
const getTreeData = () => {
    getTree(0).then(res => {
        compData.generalOptions = treeDeleteChildren(res.data) || []
    })
}

onMounted(() => {
    getTreeData()
})

defineExpose({
    openModal,
})
</script>

<style scoped>

</style>
