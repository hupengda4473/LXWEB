<template>
    <div class="pageContent" ref="pageContentRef">
        <n-grid cols="24" x-gap="10" item-responsive responsive="screen">
            <n-grid-item span="24 m:24 l:24">
                <n-space :wrap-item="false">
                    <n-card :segmented="{content: true,footer:true}" header-style="padding:0" footer-style="padding:10px"
                            content-style="padding:0px;">
                        <template #header>
                            <n-tabs
                                type="line"
                                size="large"
                                :tabs-padding="10"
                                pane-style="padding: 10px;"
                            >
                                <n-tab-pane name="数据查询">
                                    <n-form style="margin-bottom: -24px" label-placement="left" label-align="right"
                                            :show-label="true" ref="searchFormRef" inline
                                            :model="compData.searchForm">
                                        <n-grid cols="24" x-gap="10" item-responsive responsive="screen">
                                            <n-grid-item span="24 m:12 l:8">
                                                <n-form-item label="模糊搜索：" path="keyWord">
                                                    <n-input clearable v-model:value="compData.searchForm.keyWord" placeholder="请输入关键字"/>
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:12 l:8">
                                                <n-form-item>
                                                    <n-space>
                                                        <n-button attr-type="button" @click="compHandle.search" :color="btnConfig.ser">
                                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.ser">
                                                                <component
                                                                    class="ico"
                                                                    :is="renderIcon(btnConfig.ico.ser)"
                                                                />
                                                            </template>
                                                            搜索
                                                        </n-button>
                                                    </n-space>
                                                </n-form-item>
                                            </n-grid-item>
                                        </n-grid>
                                    </n-form>
                                </n-tab-pane>
                                <n-tab-pane name="数据操作">
                                    <n-space>
                                        <n-button :color="btnConfig.add" v-if="compHandle.operation.isAdd" @click="compHandle.add()">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.add">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.add)"
                                                />
                                            </template>
                                            新增角色
                                        </n-button>
                                        <n-button :color="btnConfig.del" v-if="compHandle.operation.isDelete" @click="compHandle.dels()">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.del">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.del)"
                                                />
                                            </template>
                                            删除角色
                                        </n-button>
                                        <n-button :color="btnConfig.exp" v-if="compHandle.operation.isExport" @click="compHandle.exportData">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.exp">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.exp)"
                                                />
                                            </template>
                                            导出角色
                                        </n-button>
                                        <n-button :color="btnConfig.ref" :loading="compData.loading" @click="compHandle.getTableData">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.ref">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.ref)"
                                                />
                                            </template>
                                            刷新列表
                                        </n-button>
                                        <n-popselect v-if="tableSetting.showTableSizeSetting" v-model:value="compData.tableSizeValue" :options="tableSetting.tableSize" trigger="click">
                                            <n-button strong secondary type="success">
                                                <template #icon v-if="btnConfig.showIco && btnConfig.ico.size">
                                                    <component
                                                        class="ico"
                                                        :is="renderIcon(btnConfig.ico.size)"
                                                    />
                                                </template>
                                                表格大小
                                            </n-button>
                                        </n-popselect>
                                        <n-popover v-if="tableSetting.showTableColumnsSetting" trigger="click" placement="bottom">
                                            <template #trigger>
                                                <n-button strong secondary type="info">
                                                    <template #icon v-if="btnConfig.showIco && btnConfig.ico.tab">
                                                        <component
                                                            class="ico"
                                                            :is="renderIcon(btnConfig.ico.tab)"
                                                        />
                                                    </template>
                                                    设置表列
                                                </n-button>
                                            </template>
                                            <n-checkbox-group v-model:value="compData.columnsOptionsValue"
                                                              @update:value="compHandle.handleColumnsOptions">
                                                <n-space vertical align="start">
                                                    <n-checkbox v-for="item in compData.columnsOptions" :key="item.value"
                                                                :value="item.key"
                                                                :label="item.title" :disabled="item.disabled"></n-checkbox>
                                                </n-space>
                                            </n-checkbox-group>
                                        </n-popover>
                                    </n-space>
                                </n-tab-pane>
                            </n-tabs>
                        </template>
                        <n-data-table
                            style="padding-bottom: 24px"
                            :bordered="tableSetting.bordered"
                            :cascade="tableSetting.cascade"
                            :bottom-bordered="tableSetting.bottomBordered"
                            :default-expand-all="tableSetting.defaultExpandAll"
                            :flex-height="tableSetting.flexHeight"
                            :paginate-single-page="tableSetting.paginateSinglePage"
                            :single-column="tableSetting.singleColumn"
                            :single-line="tableSetting.singleLine"
                            :striped="tableSetting.striped"
                            :summary-placement="tableSetting.summaryPlacement"
                            :pagination="tableSetting.paginationReactive"
                            :style="tableSetting.style"

                            :columns="compData.columns"
                            :data="compData.tableData"
                            :loading="compData.loading"
                            :size="compData.tableSizeValue"
                            :row-key="compData.rowKey"
                            :max-height="pageContentHeight - 210"
                            @update:checked-row-keys="compHandle.check"
                        />
                    </n-card>
                </n-space>
            </n-grid-item>
        </n-grid>
        <!-- 删除提示框 -->
        <deleteModal ref="deleteModalRef"/>
        <!-- 修改、新增弹窗 -->
        <addModal ref="addModalRef" @refreshTable="compHandle.getTableData()"/>
        <!-- 分配权限 -->
        <power ref="powerRef" @refreshTable="compHandle.getTableData()"/>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue"
import {useMessage} from "naive-ui"
import {createColumns} from "./data.ts"
import {deepCopy} from "@/packages/utils/utils.ts"
import { tableSetting, btnConfig } from '@/app/admin/config/config.js'
import {deleteRoles, findMenuByRoleID, getAllRoles} from "@/app/admin/api/role"
import deleteModal from '@/app/admin/component/deleteModal.vue'
import addModal from './add.vue'
import power from './power.vue'
import appPinia from "@/packages/pinia/app"
import { ExportTable } from '@/app/admin/untils/ExportTable'
import {renderIcon} from '@/packages/config/icon.ts'
import {Search} from "@/app/admin/untils/FuzzySearch"

const message = useMessage()
const appStore = appPinia()
const deleteModalRef = ref(null)
const addModalRef = ref(null)
const powerRef = ref(null)
const compData = reactive({
    showModal: false,
    allData: [],
    tableData: [],
    tableSizeValue: tableSetting.tableSizeValue,
    tableSize: tableSetting.tableSize,
    loading: true,
    columns: [],
    sourceColumns: [],
    columnsOptions: [],
    columnsOptionsValue: [],
    searchForm: {
        keyWord: '',
    },
    rowKey: (row: any) => row.RoleID,
    checkedRowKeys: []
})
const compHandle = reactive({
    operation: {},
    getTableData() {
        compData.loading = true
        compData.searchForm = {
            keyWord: '',
        }
        getAllRoles().then((res) => {
            compData.tableData = res.data || []
            compData.allData = res.data || []
        }).finally(() => {
            compData.loading = false
        })
    },
    del(row: any) {
        deleteRoleData(row.RoleID)
    },
    dels() {
        if (compData.checkedRowKeys.length <= 0){
            return message.warning("请选择要删除的项")
        }
        let ids = compData.checkedRowKeys.join(',')
        deleteModalRef.value.openDeleteModal('确认要删除所选角色吗？',function deleteFun() {
            deleteRoleData(ids)
            compData.checkedRowKeys = []
        })
    },
    edit(row: any) {
        addModalRef.value.openModal({type: 'edit', itemData: row})
    },
    add() {
        addModalRef.value.openModal({})
    },
    check(rowKeys: any) {
        compData.checkedRowKeys = rowKeys
    },
    tableSize() {

    },
    handleColumnsOptions(value: (string | number)[]) {
        compData.columns = compData.sourceColumns.filter((item) => value.indexOf(item.key) !== -1)
    },
    search() {
        let props = ['RoleName']
        compData.tableData  = Search(compData.searchForm.keyWord, props, deepCopy(compData.allData))
    },
    assignPermissions(row: object) {
        findMenuByRoleID(row.RoleID).then( res => {
            powerRef.value.drawerOpen( deepCopy(res.data), row.RoleID )
        })
    },
    exportData() {
        // tableRef.value?.downloadCsv({ fileName: '菜单管理', keepOriginalData: false })
        ExportTable(compData.allData, compData.columns, '角色管理')
    },
})

//删除角色
const deleteRoleData = (ids : string | number) => {
    compData.loading = true
    deleteRoles( ids ).then( res => {
        if (res.data.Code === 0) {
            message.warning("删除失败，请重试")
        } else {
            message.success("删除成功")
            compHandle.getTableData()
        }
    }).finally(() => {
        compData.loading = false
    })
}

//初始化表格
const initTable = () => {
    compData.sourceColumns = createColumns({compHandle})
    compData.columns = compData.sourceColumns
    compData.columnsOptionsValue = compData.sourceColumns.map((item) => item.key)
    compData.columnsOptions = compData.sourceColumns.filter((item) => item.type !== "selection").map((item) => {
        if (item.key === "actions") {
            item.disabled = true
        }
        return item
    })
    compHandle.getTableData()
}

//判断用户权限
const determineUserPermissions = () => {
    compHandle.operation = appStore.currentRouter.meta.operation
}

const pageContentRef = ref(null)
const pageContentHeight = ref(0)
onMounted(()=>{
    determineUserPermissions()
    initTable()
    pageContentHeight.value = pageContentRef.value.offsetHeight
})

</script>

