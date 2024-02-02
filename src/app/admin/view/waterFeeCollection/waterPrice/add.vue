<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增种植结构' : '编辑种植结构'"
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
                <n-form-item label="年份" path="Year">
                    <n-date-picker v-model:value="compData.data.Year" type="year" clearable placeholder="请选择年份" style="width: 100%" />
                </n-form-item>
                <n-form-item label="灌溉定额" path="IrrigationQuota">
                    <n-input-number clearable v-model:value="compData.data.IrrigationQuota" type="text" placeholder="请输入灌溉定额" style="width: 100%">
                        <template #suffix>
                            m³/亩
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="标准水价" path="StandardWaterPrice">
                    <n-input-number clearable v-model:value="compData.data.StandardWaterPrice" type="text" placeholder="请输入标准水价" style="width: 100%">
                        <template #suffix>
                            元/m³
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="补贴标准" path="SubsidizedWaterPrice">
                    <n-input-number clearable v-model:value="compData.data.SubsidizedWaterPrice" type="text" placeholder="请输入补贴标准" style="width: 100%">
                        <template #suffix>
                            元/m³
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="节水奖励" path="WaterSavingReward">
                    <n-input-number clearable v-model:value="compData.data.WaterSavingReward" type="text" placeholder="请输入节水奖励" style="width: 100%">
                        <template #suffix>
                            元/亩
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="详情" path="Remark">
                    <n-input clearable v-model:value="compData.data.Remark" type="textarea" placeholder="请输入详情" />
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
import {formSize} from '@/app/admin/config/config'
import {AddWaterAssociationCrop, ModifyWaterAssociationCrop} from "@/app/admin/api/WaterAssociationCrop"
import {AddWaterPrice, ModifyWaterPrice} from "@/app/admin/api/waterFeeCollection";

const message = useMessage()

type AddParams = {
    ID: string | number,
    IrrigationQuota: string | number | null,
    StandardWaterPrice: string | number | null,
    SubsidizedWaterPrice: string | number | null,
    WaterSavingReward: string | number | null,
    Year: any,
}
type Song = {
    showAddModal: boolean,
    type: string,
    cropList: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    cropList: [],
    data: {
        ID: 0,
        IrrigationQuota: null,
        StandardWaterPrice: null,
        SubsidizedWaterPrice: null,
        WaterSavingReward: null,
        Year: new Date().getFullYear(),
    },
})

const rules = {
    Year: {
        required: true,
        message: '请选择年份',
    },
    StandardWaterPrice: {
        required: true,
        message: '请输入标准水价',
    },
    SubsidizedWaterPrice: {
        required: true,
        message: '请输入补贴标准',
    },
    WaterSavingReward: {
        required: true,
        message: '请输入节水奖励',
    },
    // Remark: {
    //     required: true,
    //     message: '请输入详情',
    //     trigger: ['input', 'blur']
    // },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        IrrigationQuota: null,
        StandardWaterPrice: null,
        SubsidizedWaterPrice: null,
        WaterSavingReward: null,
        Year: new Date().getTime(),
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.Year = new Date(data.Year + '-01-01').getTime()
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
            params.Year = new Date(compData.data.Year).getFullYear()
            if (compData.type === 'add') {
                AddWaterPrice( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterPrice( params ).then(res => {
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
