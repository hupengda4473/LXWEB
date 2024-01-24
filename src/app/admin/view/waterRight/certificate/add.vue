<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增用水组织' : '编辑用水组织'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="170"
                ref="formRef"
                :size="formSize"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="取水证编码" path="Code">
                    <n-input clearable v-model:value="compData.data.Code" type="text" placeholder="请输入取水证编码" style="width: 100%"/>
                </n-form-item>
                <n-form-item label="取水权人名称" path="HolderName">
                    <n-input clearable v-model:value="compData.data.HolderName" type="text" placeholder="请输入取水权人名称" style="width: 100%"/>
                </n-form-item>
                <n-form-item label="取水地点" path="FetchWaterAddress">
                    <n-input clearable v-model:value="compData.data.FetchWaterAddress" type="text" placeholder="请输入取水地点" style="width: 100%"/>
                </n-form-item>
                <n-form-item label="取水方式" path="FetchWaterType">
                    <n-input clearable v-model:value="compData.data.FetchWaterType" type="text" placeholder="请输入取水方式" style="width: 100%"/>
                </n-form-item>
                <n-form-item label="取水量" path="FetchWaterQuantity">
                    <n-input-number clearable v-model:value="compData.data.FetchWaterQuantity" type="text" placeholder="请输入取水量" style="width: 100%">
                        <template #suffix>
                            万m³
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="起始时间" path="BeginDT">
                    <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.data.BeginDT" type="date" :shortcuts="compData.shortcuts" placeholder="请选起始时间"/>
                </n-form-item>
                <n-form-item label="结束时间" path="EndDT">
                    <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.data.EndDT" type="date" :shortcuts="compData.shortcuts" placeholder="请选结束时间"/>
                </n-form-item>
                <n-form-item label="发证日期" path="ApprovalDT">
                    <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.data.ApprovalDT" type="date" :shortcuts="compData.shortcuts" placeholder="请选发证日期"/>
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
import {formSize} from '@/app/admin/config/config'
import { FindAllWaterAssociation} from "@/app/admin/api/WaterAssociation"
import {AddWaterLicense, ModifyWaterLicense} from "@/app/admin/api/WaterLicense"

const message = useMessage()

type AddParams = {
    ID: string | number,
    Code: string | number,
    HolderName: string,
    FetchWaterAddress: string,
    FetchWaterType: string,
    FetchWaterQuantity: string | number | null,
    BeginDT: any,
    EndDT: any,
    ApprovalDT: any,
}
type Song = {
    showAddModal: boolean,
    type: string,
    shortcuts: object,
    generalOptions: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    shortcuts: {
        昨天: () => new Date().getTime() - 24 * 60 * 60 * 1000,
    },
    generalOptions: [],
    data: {
        ID: 0,
        Code: '',
        HolderName: '',
        FetchWaterAddress: '',
        FetchWaterType: '',
        FetchWaterQuantity: null,
        BeginDT: null,
        EndDT: null,
        ApprovalDT: null,
    },
})

const rules = {
    Code: {
        required: true,
        message: '请输入取水证编码',
        trigger: ['input', 'blur']
    },
    HolderName: {
        required: true,
        message: '请输入取水权人名称',
        trigger: ['input', 'blur']
    },
    FetchWaterAddress: {
        required: true,
        message: '请输入取水地点',
        trigger: ['input', 'blur']
    },
    FetchWaterType: {
        required: true,
        message: '请输入取水方式',
        trigger: ['input', 'blur']
    },
    FetchWaterQuantity: {
        required: true,
        message: '请输入取水量',
    },
    BeginDT: {
        required: true,
        message: '请选择起始时间',
    },
    EndDT: {
        required: true,
        message: '请选择结束时间',
    },
    ApprovalDT: {
        required: true,
        message: '请选择发证日期',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        Code: '',
        HolderName: '',
        FetchWaterAddress: '',
        FetchWaterType: '',
        FetchWaterQuantity: null,
        BeginDT: null,
        EndDT: null,
        ApprovalDT: null,
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.FetchWaterQuantity = data.FetchWaterQuantity ? data.FetchWaterQuantity * 1 : null
        compData.data.BeginDT = new Date(data.BeginDT).getTime()
        compData.data.EndDT = new Date(data.EndDT).getTime()
        compData.data.ApprovalDT = new Date(data.ApprovalDT).getTime()
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
            params.BeginDT = new Date(compData.data.BeginDT).format('yyyy-MM-dd')
            params.EndDT = new Date(compData.data.EndDT).format('yyyy-MM-dd')
            params.ApprovalDT = new Date(compData.data.ApprovalDT).format('yyyy-MM-dd')
            if (compData.type === 'add') {
                AddWaterLicense( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterLicense( params ).then(res => {
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

const getWaterAssociation = () => {
    FindAllWaterAssociation().then(res => {
        compData.generalOptions = res.data
    })
}

defineExpose({
    openModal,
})
onMounted(()=>{
    getWaterAssociation()
})
</script>
