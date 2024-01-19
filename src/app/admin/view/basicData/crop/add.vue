<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增作物' : '编辑作物'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="120"
                ref="formRef"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="作物名称" path="CropName">
                    <n-input clearable v-model:value="compData.data.CropName" type="text" placeholder="请输入作物名称" />
                </n-form-item>
                <n-form-item label="作物类型" path="CropType">
                    <n-select filterable v-model:value="compData.data.CropType" :options="compData.CropTypeList" placeholder="请选择作物类型" />
                </n-form-item>
                <n-form-item label="需水定额(m³)" path="WaterQuota">
                    <n-input clearable v-model:value="compData.data.WaterQuota" type="text" placeholder="请输入需水定额" />
                </n-form-item>
                <n-form-item label="浇灌起止时间" path="rang">
                    <n-date-picker
                        v-model:value="compData.data.rang"
                        :format="compData.dateFormat"
                        type="datetimerange"
                        style="width: 100%"
                        clearable
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
import {defineEmits, defineExpose, reactive, ref} from "vue"
import {FormInst, useMessage} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {addCrop, modifyCrop} from "@/app/admin/api/crop"

const message = useMessage()

type AddParams = {
    CropID: string | number,
    rang: any [],
    CropName: string,
    CropType: string | number,
    WaterQuota: string | number,
}
type CropTyp = {
    label: string,
    value: string | number
}
type Song = {
    showAddModal: boolean,
    CropTypeList: CropTyp [],
    type: string,
    dateFormat: string,
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    CropTypeList: [
        {label: '高耗水作物', value: 0},
        {label: '低耗水作物', value: 1},
    ],
    type: 'add',
    dateFormat: 'MM月dd日',
    data: {
        CropID: 0,
        rang: [Date.now(), Date.now()],
        CropName: '',
        CropType: '',
        WaterQuota: '',
    },
})

const rules = {
    CropName: {
        required: true,
        message: '请输入作物名称',
        trigger: ['input', 'blur']
    },
    CropType: {
        required: true,
        message: '请选择作物类型',
    },
    WaterQuota: {
        required: true,
        message: '请输入需水定额',
        trigger: ['input', 'blur']
    },
    rang: {
        required: true,
        message: '请选择起止时间',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        CropID: 0,
        rang: [Date.now(), Date.now()],
        CropName: '',
        CropType: '',
        WaterQuota: '',
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        let start = data.BeginDT.replace('月', '-').replace('日', '')
        let end = data.EndDT.replace('月', '-').replace('日', '')
        let year = new Date().getFullYear()
        compData.data.rang = [new Date(year + '-' + start), new Date(year + '-' + end)]
        compData.data.WaterQuota = data.WaterQuota + ''
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = compData.data
            params.BeginDT = new Date(compData.data.rang[0]).format('MM月dd日')
            params.EndDT = new Date(compData.data.rang[1]).format('MM月dd日')
            if (compData.type === 'add') {
                addCrop( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyCrop( params ).then(res => {
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

<style scoped>

</style>
