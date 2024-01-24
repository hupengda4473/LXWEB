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
                label-width="100"
                ref="formRef"
                :size="formSize"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="组织名称" path="AssociationID">
                    <n-select
                        v-model:value="compData.data.AssociationID"
                        filterable
                        clearable
                        label-field="AssociationName"
                        value-field="ID"
                        placeholder="请选择组织名称"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="年份" path="DT">
                    <n-date-picker v-model:value="compData.data.DT" type="year" clearable placeholder="请选择年份" style="width: 100%" />
                </n-form-item>
                <n-form-item label="确权面积" path="PlantArea">
                    <n-input-number clearable v-model:value="compData.data.PlantArea" type="text" placeholder="请输入确权面积" style="width: 100%">
                        <template #suffix>
                            亩
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="平均毛定额" path="Indicator">
                    <n-input-number clearable v-model:value="compData.data.Indicator" type="text" placeholder="请输入平均毛定额" style="width: 100%">
                        <template #suffix>
                            m³/亩
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="备注" path="Remark">
                    <n-input clearable v-model:value="compData.data.Remark" type="textarea" placeholder="请输入备注" />
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
import {AddWaterAssociationRight, ModifyWaterAssociationRight} from "@/app/admin/api/confirmedArea"

const message = useMessage()

type AddParams = {
    ID: string | number,
    AssociationID: string | number,
    PlantArea: any,
    Indicator: any,
    DT: any,
    Remark: string,
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
        ID: 0,
        AssociationID: '',
        DT: new Date().getTime(),
        PlantArea: '',
        Indicator: '',
        Remark: '',
    },
})

const rules = {
    AssociationID: {
        required: true,
        message: '请选择组织名称',
    },
    DT: {
        required: true,
        message: '请选择年份',
    },
    PlantArea: {
        required: true,
        message: '请输入确权面积',
    },
    Indicator: {
        required: true,
        message: '请输入平均毛定额',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        AssociationID: '',
        DT: new Date().getTime(),
        PlantArea: null,
        Indicator: null,
        Remark: '',
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.DT = new Date(data.DT + '-01-01').getTime()
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
            params.DT = new Date(compData.data.DT).getFullYear()
            if (compData.type === 'add') {
                AddWaterAssociationRight( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterAssociationRight( params ).then(res => {
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
