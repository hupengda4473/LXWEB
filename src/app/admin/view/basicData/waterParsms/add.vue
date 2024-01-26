<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增参数' : '编辑参数'"
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
                <n-form-item label="参数名称" path="ParamName">
                    <n-input clearable v-model:value="compData.data.ParamName" type="text" placeholder="请输入参数名称" />
                </n-form-item>
                <n-form-item label="参数符号" path="ParamSymbol">
                    <n-input clearable v-model:value="compData.data.ParamSymbol" type="text" placeholder="请输入参数符号" />
                </n-form-item>
                <n-form-item label="参数单位" path="ParamUnit">
                    <n-input clearable v-model:value="compData.data.ParamUnit" type="text" placeholder="请输入参数单位" />
                </n-form-item>
                <n-form-item label="最低阈值" path="LowerLimit">
                    <n-input-number clearable v-model:value="compData.data.LowerLimit" type="text" placeholder="请输入最低阈值" style="width: 100%"></n-input-number>
                </n-form-item>
                <n-form-item label="最高阈值" path="UpperLimit">
                    <n-input-number clearable v-model:value="compData.data.UpperLimit" type="text" placeholder="请输入最高阈值" style="width: 100%"></n-input-number>
                </n-form-item>
                <n-form-item label="描述" path="Description">
                    <n-input clearable v-model:value="compData.data.Description" type="textarea" placeholder="请输入描述" />
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
import {AddParam, ModifyParam} from "@/app/admin/api/waterQuality"

const message = useMessage()

type AddParams = {
    ParamId: string | number,
    ParamName: string,
    ParamSymbol: string,
    ParamUnit: string,
    Description: string,
    LowerLimit: string | number | null,
    UpperLimit: string | number | null,
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
        ParamId: 0,
        ParamName: '',
        ParamSymbol: '',
        ParamUnit: '',
        Description: '',
        LowerLimit: null,
        UpperLimit: null,
    },
})

const rules = {
    ParamName: {
        required: true,
        message: '请输入参数名称',
        trigger: ['input', 'blur']
    },
    ParamSymbol: {
        required: true,
        message: '请输入参数符号',
        trigger: ['input', 'blur']
    },
    ParamUnit: {
        required: true,
        message: '请输入参数单位',
        trigger: ['input', 'blur']
    },
    LowerLimit: {
        required: true,
        message: '请输入最低阈值',
    },
    UpperLimit: {
        required: true,
        message: '请输入最高阈值',
    },
    Description: {
        required: true,
        message: '请输入描述',
        trigger: ['input', 'blur']
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ParamId: 0,
        ParamName: '',
        ParamSymbol: '',
        ParamUnit: '',
        Description: '',
        LowerLimit: null,
        UpperLimit: null,
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
                AddParam( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyParam( compData.data ).then(res => {
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
