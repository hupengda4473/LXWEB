<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增水源' : '编辑水源'"
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
                <n-form-item label="水源名称" path="SourceName">
                    <n-input clearable v-model:value="compData.data.SourceName" type="text" placeholder="请输入水源名称" />
                </n-form-item>
                <n-form-item label="水源容量" path="Capacity">
                    <n-input-number clearable v-model:value="compData.data.Capacity" type="text" placeholder="请输入水源容量" style="width: 100%">
                        <template #suffix>
                            亿m³
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="水源类型" path="SourceType">
                    <n-select
                        v-model:value="compData.data.SourceType"
                        filterable
                        clearable
                        placeholder="请选择水源类型"
                        :options="headwatersTypeList"
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
import {formSize, headwatersTypeList} from '@/app/admin/config/config'
import {AddWaterSource, ModifyWaterSource} from "@/app/admin/api/waterSource"

const message = useMessage()

type AddParams = {
    SourceId: string | number,
    SourceName: string | number | null,
    Capacity: string | number | null,
    SourceType: string | number | null,
}
type Song = {
    showAddModal: boolean,
    type: string,
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    data: {
        SourceId: 0,
        SourceName: null,
        Capacity: null,
        SourceType: null,
    },
})

const rules = {
    SourceName: {
        required: true,
        message: '请输入水源名称',
        trigger: ['input', 'blur']
    },
    SourceType: {
        required: true,
        message: '请选择水源类型',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        SourceId: 0,
        SourceName: null,
        Capacity: null,
        SourceType: null,
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
            let params = deepCopy(compData.data)
            if (compData.type === 'add') {
                AddWaterSource( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterSource( params ).then(res => {
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
