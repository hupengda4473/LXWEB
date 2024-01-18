<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增灌区' : '编辑灌区'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="100"
                ref="formRef"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="灌区名称" path="DistrictName">
                    <n-input clearable v-model:value="compData.data.DistrictName" type="text" placeholder="请输入灌区名称" />
                </n-form-item>
                <n-form-item label="负责人" path="Principals">
                    <n-input clearable v-model:value="compData.data.Principals" type="text" placeholder="请输入负责人" />
                </n-form-item>
                <n-form-item label="联系方式" path="Telephone">
                    <n-input clearable v-model:value="compData.data.Telephone" type="text" placeholder="请输入联系方式" />
                </n-form-item>
                <n-form-item label="管理范围" path="Scope">
                    <n-input clearable v-model:value="compData.data.Scope" type="text" placeholder="请输入管理范围" />
                </n-form-item>
                <n-form-item label="行政区域" path="AreaID">
                    <n-cascader
                        v-model:value="compData.data.AreaID"
                        :options="compData.generalOptions"
                        :size="formSize"
                        :show-path="true"
                        :clearable="true"
                        placeholder="请选择行政区域"
                        check-strategy="all"
                        expand-trigger="hover"
                        label-field="AreaName"
                        value-field="AreaID"
                        children-field="Children"
                    />
                </n-form-item>
                <n-form-item label="简介" path="Introduction">
                    <n-input type="textarea" clearable v-model:value="compData.data.Introduction" placeholder="请输入简介" />
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
import {addRoles, editRoles} from "@/app/admin/api/role"
import {deepCopy} from "@/packages/utils/utils"
import {getTree} from "@/app/admin/api/area"
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {formSize} from '@/app/admin/config/config'

const message = useMessage()

type AddParams = {
    DistrictID: string | number,
    DistrictName: string,
    Principals: string,
    Telephone: string,
    Scope: string,
    AreaID: string | number,
    Introduction: string | number,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    data: {
        DistrictID: 0,
        DistrictName: '',
        Principals: '',
        Telephone: '',
        Scope: '',
        AreaID: '',
        Introduction: '',
    },
})

const rules = {
    RoleName: {
        required: true,
        message: '请输入角色名称',
        trigger: ['input', 'blur']
    }
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        DistrictID: 0,
        DistrictName: '',
        Principals: '',
        Telephone: '',
        Scope: '',
        AreaID: '',
        Introduction: '',
    }
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
            if (compData.type === 'add') {
                addRoles( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                editRoles( compData.data ).then(res => {
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

//获取行政区域
const getTreeData = () => {
    getTree(0).then(res => {
        compData.generalOptions = treeDeleteChildren(res.data) || []
    })
}

defineExpose({
    openModal,
})

onMounted( () => {
    getTreeData()
})
</script>

<style scoped>

</style>
