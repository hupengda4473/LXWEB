<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增记录' : '编辑记录'"
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
                <n-form-item label="用水单位" path="AssociationID">
                    <n-select
                        v-model:value="compData.data.AssociationID"
                        filterable
                        clearable
                        label-field="AssociationName"
                        value-field="ID"
                        placeholder="请选择用水单位"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="年份" path="Year">
                    <n-date-picker v-model:value="compData.data.Year" type="year" clearable placeholder="请选择年份" style="width: 100%" />
                </n-form-item>
                <n-form-item label="缴费金额" path="PaymentAmount">
                    <n-input clearable v-model:value="compData.data.PaymentAmount" placeholder="请输入缴费金额" />
                </n-form-item>
                <n-form-item label="备注" path="Remark">
                    <n-input clearable type="textarea" v-model:value="compData.data.Remark" placeholder="请输入备注" />
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
import {FindAllWaterAssociation} from "@/app/admin/api/WaterAssociation"
import {AddPaymentRecord, ModifyPaymentRecord} from "@/app/admin/api/waterFeeCollection"

const message = useMessage()

type AddParams = {
    ID: string | number,
    AssociationID: string | number | null,
    PaymentAmount: string | number,
    Remark: string | number,
    Year: any,
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
        AssociationID: null,
        PaymentAmount: '',
        Remark: '',
        Year: new Date().getFullYear(),
    },
})

const rules = {
    AssociationID: {
        required: true,
        message: '请选择用水单位',
    },
    Year: {
        required: true,
        message: '请选择年份',
    },
    PaymentAmount: {
        required: true,
        message: '请输入缴费金额',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        AssociationID: null,
        PaymentAmount: '',
        Remark: '',
        Year: new Date().getTime(),
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.Year = new Date(data.Year + '-01-01').getTime()
        compData.data.PaymentAmount = data.PaymentAmount + '' //处理naive警告
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
            params.Dt = new Date().format('yyyy-MM-dd hh:mm:ss')
            if (compData.type === 'add') {
                AddPaymentRecord( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyPaymentRecord( params ).then(res => {
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
