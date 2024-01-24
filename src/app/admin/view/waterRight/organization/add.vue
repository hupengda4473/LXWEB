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
                <n-form-item label="组织名称" path="AssociationName">
                    <n-input clearable v-model:value="compData.data.AssociationName" type="text" placeholder="请输入组织名称" />
                </n-form-item>
                <n-form-item label="负责人" path="Manager">
                    <n-input clearable v-model:value="compData.data.Manager" type="text" placeholder="请输入负责人" />
                </n-form-item>
                <n-form-item label="联系方式" path="Tel">
                    <n-input clearable v-model:value="compData.data.Tel" type="text" placeholder="请输入联系方式" />
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
import {defineEmits, defineExpose, reactive, ref} from "vue"
import {FormInst, useMessage} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {formSize} from '@/app/admin/config/config'
import {AddWaterAssociation, ModifyWaterAssociation} from "@/app/admin/api/WaterAssociation"

const message = useMessage()

type AddParams = {
    ID: string | number,
    AssociationName: string,
    Manager: string,
    Tel: string,
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
        AssociationName: '',
        Manager: '',
        Tel: '',
        Remark: '',
    },
})

const rules = {
    AssociationName: {
        required: true,
        message: '请输入组织名称',
        trigger: ['input', 'blur']
    },
    Manager: {
        required: true,
        message: '请输入负责人',
        trigger: ['input', 'blur']
    },
    Tel: {
        required: true,
        message: '请输入联系方式',
        trigger: ['input', 'blur']
    },
    // Remark: {
    //     required: true,
    //     message: '请输入备注',
    //     trigger: ['input', 'blur']
    // },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        AssociationName: '',
        Manager: '',
        Tel: '',
        Remark: '',
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
                AddWaterAssociation( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterAssociation( compData.data ).then(res => {
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
