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
                                    <n-form style="margin-bottom: -24px" label-placement="left" label-align="right" :show-label="true" ref="searchFormRef" inline :model="compData.searchForm">
                                        <n-grid cols="24" x-gap="30" item-responsive responsive="screen">
                                            <n-grid-item span="24 m:8 l:6">
                                                <n-form-item label="分组" path="inputValue">
                                                    <n-cascader
                                                        v-model:value="compData.GroupID"
                                                        :options="compData.generalOptions"
                                                        @update:value="compHandle.getTableData()"
                                                        :size="formSize"
                                                        :show-path="true"
                                                        :clearable="true"
                                                        placeholder="请选择分组"
                                                        check-strategy="all"
                                                        expand-trigger="hover"
                                                        label-field="GroupName"
                                                        value-field="GroupID"
                                                        children-field="Children"
                                                    />
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:8 l:6">
                                                <n-form-item label="设备类型" path="inputValue">
                                                    <n-select
                                                        v-model:value="compData.deviceType"
                                                        @update:value="compHandle.getTableData()"
                                                        filterable
                                                        clearable
                                                        placeholder="请选择设备类型"
                                                        :options="deviceType"
                                                    />
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:8 l:6">
                                                <n-form-item label="模糊搜索：" path="keyWord">
                                                    <n-input clearable v-model:value="compData.searchForm.keyWord" placeholder="请输入关键字"/>
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:8 l:6">
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
                                            新增设别
                                        </n-button>
                                        <n-button :color="btnConfig.del" v-if="compHandle.operation.isDelete" @click="compHandle.dels()">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.del">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.del)"
                                                />
                                            </template>
                                            删除设备
                                        </n-button>
                                        <n-button :color="btnConfig.exp" v-if="compHandle.operation.isExport" @click="compHandle.exportData">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.exp">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.exp)"
                                                />
                                            </template>
                                            导出设备
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
        <!-- 修改、新增抽屉 -->
        <addModal ref="addModalRef" @refreshTable="compHandle.getTableData()"/>
        <!-- 详情抽屉 -->
        <Details ref="detailsModal"/>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue"
import {createColumns} from "./data.ts"
import {deepCopy} from "@/packages/utils/utils.ts"
import {tableSetting, btnConfig, deviceType} from '@/app/admin/config/config.js'
import {deleteDevice, findDevice} from '@/app/admin/api/device'
import appPinia from "@/packages/pinia/app"
import { ExportTable } from '@/app/admin/untils/ExportTable'
import {renderIcon} from '@/packages/config/icon.ts'
import {Search} from "@/app/admin/untils/FuzzySearch"
import {useMessage} from "naive-ui"
import {formSize} from '@/app/admin/config/config'
import deleteModal from '@/app/admin/component/deleteModal.vue'
import addModal from './add.vue'
import Details from './details.vue'
import {getTree} from "@/app/admin/api/institution"
import {treeDeleteChildren} from "@/app/admin/untils/untils"

const message = useMessage()
const appStore = appPinia()
const deleteModalRef = ref(null)
const addModalRef = ref(null)
const detailsModal = ref(null)
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
    rowKey: (row: any) => row.DeviceID,
    checkedRowKeys: [],
    generalOptions: [],
    GroupID: '',
    deviceType: '',
})
const compHandle = reactive({
    LocationType: [],
    filterArr: [],
    operation: {},
    getTableData() {
        compData.searchForm.keyWord = ''
        compData.loading = true
        let params = {
            Type: compData.deviceType || '',
            GroupID: compData.GroupID || 0,
            DeviceName: '',
        }
        findDevice(params).then((res) => {
            let data = res.data
            compData.tableData = data || []
            compData.allData = data || []
            compHandle.LocationType = []
            compHandle.filterArr = []
            if (data && data.length > 0) {
                for (let item of data) {
                    if (!compHandle.LocationType.find(i => i.value === item.Type) && item.Type) {
                        compHandle.LocationType.push({
                            label: deviceType.find( i2 => i2.value == item.Type).label,
                            value: item.Type
                        })
                    }
                    if (!compHandle.filterArr.find(i => i.label === item.GroupName) && item.GroupName) {
                        compHandle.filterArr.push({
                            label: item.GroupName,
                            value: item.GroupID
                        })
                    }
                }
            }
            compData.sourceColumns = createColumns({compHandle})
            compData.columns = compData.sourceColumns
            compData.columnsOptionsValue = compData.sourceColumns.map((item) => item.key)
            compData.columnsOptions = compData.sourceColumns.filter((item) => item.type !== "selection").map((item) => {
                if (item.key === "actions") {
                    item.disabled = true
                }
                return item
            })
        }).finally(() => {
            compData.loading = false
        })
    },
    del(row: any) {
        deleteItem(row.DeviceID)
    },
    dels() {
        if (compData.checkedRowKeys.length <= 0){
            return message.warning("请选择要删除的项")
        }
        let ids = compData.checkedRowKeys.join(',')
        deleteModalRef.value.openDeleteModal('确认要删除所选设备吗？',function deleteFun() {
            deleteItem(ids)
            compData.checkedRowKeys = []
        })
    },
    details(row: any) {
        detailsModal.value.showDetails(row)
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
        let props = ['DeviceCode', 'DeviceName', 'GroupName', 'LocationName']
        compData.tableData  = Search(compData.searchForm.keyWord, props, deepCopy(compData.allData))
    },
    exportData() {
        ExportTable(compData.allData, compData.columns, '设备管理')
    },
})

//判断用户权限
const determineUserPermissions = () => {
    compHandle.operation = appStore.currentRouter.meta.operation
}

//删除
const deleteItem = (ids: string | number) => {
    compData.loading = true
    deleteDevice(ids).then(
        res =>{
            if (res.data.Code === 0){
                message.warning("删除失败，请重试")
            }else {
                message.success("删除成功")
                compHandle.getTableData()
            }
        }
    ).finally(() => {
        compData.loading = false
    })
}

//获取分组
const getTreeData = () => {
    getTree(0).then(res => {
        compData.generalOptions = treeDeleteChildren(res.data) || []
    })
}

const pageContentRef = ref(null)
const pageContentHeight = ref(0)
onMounted(async ()=>{
    pageContentHeight.value = pageContentRef.value.offsetHeight
    await getTreeData()
    await determineUserPermissions()
    await compHandle.getTableData()
})

</script>

