<template>
    <n-modal
        :loading="compData.loading"
        v-model:show="compData.showAddModal"
    >
        <n-card
            style="width: 40%;"
            header-style="text-align: center;"
            title="分配角色"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-data-table
                size="small"
                :columns="compData.columns"
                :data="compData.allRole"
                :row-key="compData.rowKey"
                v-model:checked-row-keys="compData.checkedRowKeys"
            />

            <template #footer>
                <n-flex justify="end">
                    <n-space>
                        <n-button @click="compData.showAddModal = false">取消</n-button>
                        <n-button :loading="compData.loading" type="success" @click="drawerConfirm">保存</n-button>
                    </n-space>
                </n-flex>

            </template>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import {defineExpose, onMounted, reactive} from "vue"
import {getAllRoles} from "@/app/admin/api/role"
import {createRoleColumns} from "./data"
import {saveRoles} from "@/app/admin/api/user"
import {useMessage} from "naive-ui"

type CompData = {
    showAddModal: boolean,
    rowData: [],
    allRole: [],
    columns: object[],
    UserID: string,
    loading: boolean,
    rowKey: any,
    checkedRowKeys: (string | number)[],
}
const compData = reactive<CompData>({
    showAddModal: false,
    rowData: [],
    allRole: [],
    columns: [],
    UserID: '',
    loading: false,
    rowKey: (row: any) => row.RoleID,
    checkedRowKeys: [],
})
const message = useMessage()

//打开modal
const modalOpen = ( res: [] ,id: any) => {
    compData.rowData = res
    compData.checkedRowKeys = []
    let roleArr = []
    if (res && res.length > 0) {
        for (let item of res) {
            roleArr.push(item.RoleID)
        }
    }
    compData.checkedRowKeys = roleArr
    compData.UserID = id
    compData.showAddModal = true
}

//保存
const drawerConfirm = () => {
    compData.loading = true
    let params = {
        UserId: compData.UserID,
        RoleIds: compData.checkedRowKeys
    }
    saveRoles(params).then( res => {
        if (res.data.Code === 0) {
            message.warning("删除失败，请重试")
        } else {
            message.success("删除成功")
            compData.showAddModal = false
            compData.loading = false
        }
    }).finally()
}

const getAllRoleData = () => {
    compData.loading = true
    getAllRoles().then((res) => {
        compData.allRole = res.data || []
        compData.columns = createRoleColumns()
    }).finally(() => {
        compData.loading = false
    })
}

onMounted(() => {
    getAllRoleData()
})

defineExpose({
    modalOpen,
})
</script>

<style scoped>

</style>
