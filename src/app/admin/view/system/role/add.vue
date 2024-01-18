<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 500px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增角色' : '编辑角色'"
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
            >
                <n-form-item label="角色名称" path="RoleName">
                    <n-input clearable v-model:value="compData.data.RoleName" type="text" placeholder="请输入角色名称" />
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
import {addRoles, editRoles} from "@/app/admin/api/role"
import {deepCopy} from "@/packages/utils/utils"

const message = useMessage()

type AddParams = {
    RoleID: number,
    RoleName: string,
    State: number
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
        RoleID: 0,
        RoleName: '',
        State: 1,
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
        RoleID: 0,
        RoleName: '',
        State: 1,
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

defineExpose({
    openModal,
})
</script>

<style scoped>

</style>
