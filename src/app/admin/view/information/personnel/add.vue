<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 500px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增人员' : '编辑人员'"
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
                :size="formSize"
                :label-width="120"
            >
                <n-form-item label="人员姓名" path="PersonName">
                    <n-input clearable v-model:value="compData.data.PersonName" type="text" placeholder="请输入人员姓名" />
                </n-form-item>
                <n-form-item label="职务" path="Position">
                    <n-input clearable v-model:value="compData.data.Position" type="text" placeholder="请输入职务" />
                </n-form-item>
                <n-form-item label="电话" path="Tel">
                    <n-input clearable v-model:value="compData.data.Tel" type="text" placeholder="请输入电话" />
                </n-form-item>
                <n-form-item label="管理机构" path="GroupID">
                    <n-cascader
                        v-model:value="compData.data.GroupID"
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
import {getTree} from '@/app/admin/api/institution'
import {formSize} from '@/app/admin/config/config'
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {addPersonnel, modifyPersonnel} from "@/app/admin/api/personnel"

const message = useMessage()

type AddParams = {
    ID: number,
    PersonName: string | number,
    Position: string | number,
    GroupID: string | number,
    Tel: string | number,
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
        ID: 0,
        PersonName: '',
        Position: '',
        GroupID: '',
        Tel: '',
    },
})

const rules = {
    PersonName: {
        required: true,
        message: '请输入人员姓名',
        trigger: ['input', 'blur']
    },
    // Position: {
    //     required: true,
    //     message: '请输入人员职务',
    //     trigger: ['input', 'blur']
    // },
    Tel: {
        required: true,
        message: '请输入电话',
        trigger: ['input', 'blur']
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        PersonName: '',
        Position: '',
        GroupID: '',
        Tel: '',
    }
    if (type === 'edit') {
        compData.data = deepCopy(itemData)
        compData.data.GroupID = itemData.GroupID || ''
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
                addPersonnel( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyPersonnel( compData.data ).then(res => {
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
