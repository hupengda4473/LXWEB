<template>
    <div class="pageContent" ref="pageContentRef">
        <n-grid cols="24" x-gap="10" item-responsive responsive="screen">
            <n-grid-item span="24 m:24 l:24">
                <n-space :wrap-item="false">
                    <n-card :segmented="{content: true,footer:true}" header-style="padding:0" footer-style="padding:10px" content-style="padding:0px;">
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
                                                <n-form-item label="选择单位" path="">
                                                    <n-cascader
                                                        v-model:value="compData.searchForm.GroupID"
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
                                                <n-form-item label="选择站点" path="">
                                                    <n-select
                                                        v-model:value="compData.searchForm.deviceId"
                                                        filterable
                                                        label-field="DeviceName"
                                                        value-field="DeviceID"
                                                        placeholder="请选择站点"
                                                        :options="compData.deviceList"
                                                    />
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:8 l:6">
                                                <n-form-item label="选择时间：" path="keyWord">
                                                    <n-date-picker v-model:value="compData.searchForm.time" type="daterange" />
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
                                        <n-button :color="btnConfig.exp" v-if="compHandle.operation.isExport" @click="compHandle.exportData">
                                            <template #icon v-if="btnConfig.showIco && btnConfig.ico.exp">
                                                <component
                                                    class="ico"
                                                    :is="renderIcon(btnConfig.ico.exp)"
                                                />
                                            </template>
                                            导出
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
                    </n-card>
                    <n-card :segmented="{content: true,footer:true}" header-style="padding:0" footer-style="padding:10px" content-style="padding:0px;" style="margin-top: 8px">
                        <n-table :bordered="false" :single-line="false">
                            <thead>
                            <tr>
                                <th>站名</th>
                                <th>开始时间</th>
                                <th>结束时间</th>
                                <th>开始累积量(m³)</th>
                                <th>结束累积量(m³)</th>
                                <th>阶段用水量(m³)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{{ compData.deviceName }}</td>
                                <td>{{ new Date(compData.searchForm.time[0]).format('yyyy-MM-dd') }}</td>
                                <td>{{ new Date(compData.searchForm.time[1]).format('yyyy-MM-dd') }}</td>
                                <td>{{ compData.allData.length > 0 ? compData.allData[0].TotalAmount || '-' : '-' }}</td>
                                <td>{{ compData.allData.length > 0 ? compData.allData[compData.allData.length - 1].TotalAmount || '-' : '-' }}</td>
                                <td>{{getWaterNumber()}}</td>
                            </tr>
                            </tbody>
                        </n-table>
                    </n-card>
                    <n-card :segmented="{content: true,footer:true}" header-style="padding:0" footer-style="padding:10px" content-style="padding:0px;" style="margin-top: 8px">
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
                            :max-height="pageContentHeight - 210 - 112"
                            @update:checked-row-keys="compHandle.check"
                        />
                    </n-card>
                </n-space>
            </n-grid-item>
        </n-grid>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue"
import {createColumns} from "./data.ts"
import { tableSetting, btnConfig, formSize } from '@/app/admin/config/config.js'
import appPinia from "@/packages/pinia/app"
import { ExportTable } from '@/app/admin/untils/ExportTable'
import {renderIcon} from '@/packages/config/icon.ts'
import {FindSluiceData} from "@/app/admin/api/sluiceGate"
import {getTree} from "@/app/admin/api/institution"
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {FindDeviceByGroupID} from "@/app/admin/api/device"

const appStore = appPinia()
const compData = reactive({
    showModal: false,
    allData: [],
    tableData: [],
    generalOptions: [],
    tableSizeValue: tableSetting.tableSizeValue,
    tableSize: tableSetting.tableSize,
    loading: true,
    columns: [],
    sourceColumns: [],
    columnsOptions: [],
    columnsOptionsValue: [],
    searchForm: {
        time: [Date.now() - 86400000, Date.now()],
        GroupID: '',
        deviceId: '',
    },
    rowKey: (row: any) => row.DeviceID,
    checkedRowKeys: [],
    deviceList: [],
    deviceName: ''
})
const compHandle = reactive({
    LocationType: [],
    filterArr: [],
    operation: {},
    getTableData() {
        compData.loading = true
        let params = {
            PageSize: 999999999,
            PageIndex: 1,
            OrderField: "",
            OrderType: "",
            BeginDT: new Date(compData.searchForm.time[0]).format('yyyy-MM-dd'),
            EndDT: new Date(compData.searchForm.time[1]).format('yyyy-MM-dd'),
            FuzzyName: compData.searchForm.deviceId,
            // UserID: appStore.userInfo.UserID
            UserID: 1
        }
        FindSluiceData(params).then((res) => {
            let data = res.data
            compData.tableData = data || []
            compData.allData = data || []
            compHandle.LocationType = []
            compHandle.filterArr = []
            // if (data && data.length > 0) {
            //     for (let item of data) {
            //         if (!compHandle.LocationType.find(i => i.value === item.PGroupName) && item.PGroupName) {
            //             compHandle.LocationType.push({
            //                 label: item.PGroupName,
            //                 value: item.PGroupName
            //             })
            //         }
            //         if (!compHandle.filterArr.find(i => i.label === item.GroupName) && item.GroupName) {
            //             compHandle.filterArr.push({
            //                 label: item.GroupName,
            //                 value: item.GroupName
            //             })
            //         }
            //     }
            // }
            compData.sourceColumns = createColumns()
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
    tableSize() {

    },
    handleColumnsOptions(value: (string | number)[]) {
        compData.columns = compData.sourceColumns.filter((item) => value.indexOf(item.key) !== -1)
    },
    search() {
        compHandle.getTableData()
    },
    exportData() {
        ExportTable(compData.allData, compData.columns, '闸门历史数据')
    },
})

//判断用户权限
const determineUserPermissions = () => {
    compHandle.operation = appStore.currentRouter.meta.operation
}

//获取分组
const getTreeData = () => {
    getTree(0).then(res => {
        compData.generalOptions = treeDeleteChildren(res.data) || []
        compData.searchForm.GroupID = compData.generalOptions[0].GroupID
    })
}

//根据分组获取设备列表
const getDeviceListData = () => {
    let params = {
        GroupID: compData.searchForm.GroupID,
        Type: 'sluice',
    }
    FindDeviceByGroupID(params).then(async res => {
        compData.deviceList = res.data
        compData.searchForm.deviceId = res.data[0].DeviceID
        compData.deviceName = res.data[0].DeviceName
        await compHandle.getTableData()
    })
}

//计算阶段用水量
const getWaterNumber = () => {
    return compData.allData.length > 0 ? (compData.allData[compData.allData.length - 1].TotalAmount * 1  - compData.allData[0].TotalAmount * 1).toFixed(2) : '-'
}

const pageContentRef = ref(null)
const pageContentHeight = ref(0)
onMounted(async ()=>{
    pageContentHeight.value = pageContentRef.value.offsetHeight
    await determineUserPermissions()
    await getTreeData()
    await getDeviceListData()
})

</script>

