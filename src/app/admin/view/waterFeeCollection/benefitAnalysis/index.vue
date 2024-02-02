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
                                    <n-form
                                        style="margin-bottom: -24px"
                                        label-placement="left"
                                        label-align="right"
                                        :show-label="true"
                                        ref="searchFormRef"
                                        inline
                                        :model="compData.searchForm"
                                    >
                                        <n-grid cols="24" x-gap="30" item-responsive responsive="screen">
                                            <n-grid-item span="24 m:6 l:6">
                                                <n-form-item label="选择测点：" path="LocationId">
                                                    <n-select
                                                        v-model:value="compData.searchForm.LocationId"
                                                        label-field="LocationName"
                                                        value-field="LocationID"
                                                        placeholder="请选择测点名称"
                                                        filterable
                                                        :options="compData.locationList"
                                                    />
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:6 l:6">
                                                <n-form-item label="选择时间：" path="time">
                                                    <n-date-picker
                                                        v-model:value="compData.searchForm.time"
                                                        type="month"
                                                        format="y年 M月"
                                                        year-format="y年"
                                                        month-format="M月"
                                                        style="width: 100%"
                                                    />
                                                </n-form-item>
                                            </n-grid-item>
                                            <n-grid-item span="24 m:6 l:6">
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
                        <div id="echartBox" style="height: 400px;"></div>
                    </n-card>
                    <n-card :segmented="{content: true,footer:true}" header-style="padding:10px;font-size:14px"
                            footer-style="padding:10px" content-style="padding:0px;" style="margin-bottom: 12px">
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
                            :max-height="pageContentHeight - 210 - 400 - 12"
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
import {tableSetting, btnConfig} from '@/app/admin/config/config.js'
import appPinia from "@/packages/pinia/app"
import { ExportTable } from '@/app/admin/untils/ExportTable'
import {renderIcon} from '@/packages/config/icon.ts'
import {FindMonthRoundReport, GetWaterBalance} from "@/app/admin/api/waterFeeCollection"
import * as echarts from "echarts"
import {findAllLocation} from "@/app/admin/api/station"

const appStore = appPinia()
const compData = reactive({
    allData: [],
    tableData: [],
    tableSizeValue: tableSetting.tableSizeValue,
    tableSize: tableSetting.tableSize,
    loading: true,
    columns: [],
    sourceColumns: [],
    columnsOptions: [],
    columnsOptionsValue: [],
    locationList: [],
    searchForm: {
        LocationId: null,
        time: new Date().getTime(),
    },
    rowKey: (row: any) => row.ID,
    checkedRowKeys: [],
})
const compHandle = reactive({
    filterArr: [],
    operation: {},
    time: new Date(compData.searchForm.time).format('yyyy-MM'),
    getTableData() {
        compData.loading = true
        let year = new Date(compData.searchForm.time).format('yyyy-MM')
        FindMonthRoundReport( year ).then((res) => {
            let data = res.data
            compData.allData = data || []
            compData.tableData = data || []
            compHandle.filterArr = []
            if (data && data.length > 0) {
                for (let item of data) {
                    if (!compHandle.filterArr.find(i => i.label === item.Year) && item.Year) {
                        compHandle.filterArr.push({
                            label: item.Year,
                            value: item.Year
                        })
                    }
                }
            }
            initTable()
        }).finally(() => {
            compData.loading = false
        })
    },
    handleColumnsOptions(value: (string | number)[]) {
        compData.columns = compData.sourceColumns.filter((item) => value.indexOf(item.key) !== -1)
    },
    search() {
        findAllLocationData()
    },
    exportData() {
        ExportTable(compData.allData, compData.columns, '供水效益分析')
    },
})

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
}

//判断用户权限
const determineUserPermissions = () => {
    compHandle.operation = appStore.currentRouter.meta.operation
}

//获取所有测点
const findAllLocationData = () => {
    let params = {
        LocationType: '',
        Groups: '',
        LocationName: '',
    }
    findAllLocation(params).then(res => {
        compData.locationList = res.data.Data
        compData.searchForm.LocationId = res.data.Data[0].LocationID
    })
}

//获取echart数据
const getWaterBalanceData = () => {
    setTimeout(()=>{
        let params = {
            LocationID: compData.searchForm.LocationId,
            BeginDT: new Date(compData.searchForm.time).format('yyyy-MM'),
            EndDT: new Date(compData.searchForm.time).format('yyyy-MM'),
        }
        GetWaterBalance(params).then( res => {
            let timeArr = []
            let dataArr = []
            if (res.data && res.data.length > 0) {
                for (let item of res.data) {
                    timeArr.push(item.DT)
                    dataArr.push((item.PlanData * 1 - item.ReportData * 1).toFixed(2))
                }
            }
            initEchart(timeArr, dataArr)
        })
    },200)

}

//刷新echart
const initEchart = (date ?: [],data ?: []) => {
    const chartDom = document.getElementById("echartBox")
    const myChart = echarts.init(chartDom)
    let Min = -60
    let Max = 60
    data.filter( item => {
        if (item > Max){
            Max = item
            Min > -item ? Min = -item : ''
        }
        if (item < Min){
            Min = item
            Max < -item ? Max = -item : ''
        }
    })
    const option = {
        title: {
            text: "计划放水与实际放水差值",
            left: 'center',
            top: '20'
        },
        grid: {
            left: "5%",
            top: "15%",
            right: "5%",
            bottom: "10%"
        },
        xAxis: {
            data: date,
            splitLine: {show: false},
            axisTick: {show: false},
            axisLabel: {
                show: true,
                color: "#a4a4a4",
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#ddd",
                    width: 1,
                    type: "solid",
                },
            },
        },
        yAxis: {
            type: 'value',
            name: '水量',
            min: Min,
            max:Max,
            splitLine: {show: false},
            axisTick: {show: false},
            axisLabel: {
                show: true,
                color: "#a4a4a4",
                formatter: '{value} m³'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#ddd",
                    width: 1,
                    type: "solid",
                },
            },
        },
        series: [
            {
                data: data,
                type: "bar",
                barWidth: 35,
                label: {
                    formatter: (params) => {
                        return `${params.value}`
                    },
                    show: true,
                    position: "top",
                },
                showBackground: true,
                fontSize: "12px",
                backgroundStyle: {
                    color: "rgba(110, 193, 244, 0.05)",
                    borderRadius: [5, 5, 0, 0],
                },
                itemStyle: {
                    // 这里就可以实现，配置柱状图的颜色
                    color: function (params) {
                        return params.value * 1 > 0 ? "#1ec4c5" : "#fe5558"
                    },
                    borderRadius: [5, 5, 0, 0],
                },
            },
        ]
    }
    myChart.setOption(option)
}

const pageContentRef = ref(null)
const pageContentHeight = ref(0)
onMounted(async ()=>{
    pageContentHeight.value = pageContentRef.value.offsetHeight
    await findAllLocationData()
    await determineUserPermissions()
    await compHandle.getTableData()
    await getWaterBalanceData()
})

</script>

