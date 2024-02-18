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
                                <n-tab-pane name="过程曲线">
                                    <n-form
                                        style="margin-bottom: -24px"
                                        label-placement="left"
                                        label-align="right"
                                        :show-label="true"
                                        ref="searchFormRef"
                                        inline
                                        :model="compData.searchForm">
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
                            </n-tabs>
                        </template>
                    </n-card>
                    <n-card
                        :segmented="{content: true,footer:true}"
                        header-style="padding:0"
                        footer-style="padding:10px"
                        content-style="padding:0px;"
                        style="margin-top: 8px"
                        :style="{height: pageContentHeight - 130 + 'px'}"
                    >
                        <div id="echartBox" style="width: 100%;height: 100%"></div>
                    </n-card>
                </n-space>
            </n-grid-item>
        </n-grid>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue"
import { btnConfig, formSize } from '@/app/admin/config/config.js'
import {renderIcon} from '@/packages/config/icon.ts'
import {FindDayReport} from "@/app/admin/api/sluiceGate"
import {getTree} from "@/app/admin/api/institution"
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {FindDeviceByGroupID} from "@/app/admin/api/device"
import * as echarts from "echarts"

const compData = reactive({
    showModal: false,
    allData: [],
    searchForm: {
        time: [Date.now() - 86400000 * 6, Date.now()],
        GroupID: '',
        deviceId: '',
    },
    deviceList: [],
    generalOptions: [],
    deviceName: ''
})
const compHandle = reactive({
    getTableData() {
        let params = {
            BeginDT: new Date(compData.searchForm.time[0]).format('yyyy-MM-dd'),
            EndDT: new Date(compData.searchForm.time[1]).format('yyyy-MM-dd'),
            LocationID: compData.searchForm.GroupID,
            StationID: compData.searchForm.deviceId,
        }
        FindDayReport(params).then((res) => {
            compData.allData = res.data || []
            compData.deviceName = compData.deviceList.find(item => item.DeviceID == compData.searchForm.deviceId).DeviceName

            let dateArr = [], arr1 = []
            if (compData.allData && compData.allData.length > 0) {
                for (let item of compData.allData) {
                    dateArr.push(item.ReportDT)
                    arr1.push((item.TotalWaterVolume * 1).toFixed(2))
                }
            }
            initEchart(dateArr, arr1)
        })
    },
    search() {
        compHandle.getTableData()
    },
})

//获取分组
const getTreeData = async () => {
    await getTree(0).then(res => {
        compData.generalOptions = treeDeleteChildren(res.data) || []
        compData.searchForm.GroupID = compData.generalOptions[0].GroupID
    })
}

//根据分组获取设备列表
const getDeviceListData = async () => {
    let params = {
        GroupID: compData.searchForm.GroupID,
        Type: 'sluice',
    }
    await FindDeviceByGroupID(params).then(async res => {
        compData.deviceList = res.data
        compData.searchForm.deviceId = res.data[0].DeviceID
        await compHandle.getTableData()
    })
}

//刷新echart
const initEchart = (dateArr = [],dataArr = []) => {
    const option = {
        title: {
            text: compData.deviceName + "水量柱图",
            left: 'center',
            top: '20'
        },
        grid: {
            left: "10%",
            top: "15%",
            right: "5%",
            bottom: "5%"
        },
        xAxis: {
            data: dateArr,
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
            name: '总水量(立方米)',
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
                data: dataArr,
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
                    color: '#1ec4c5',
                    borderRadius: [5, 5, 0, 0],
                },
            },
        ]
    }
    const chartDom = document.getElementById("echartBox")
    const myChart = echarts.init(chartDom)
    myChart.setOption(option)
}

const pageContentRef = ref(null)
const pageContentHeight = ref(0)
onMounted(async ()=>{
    pageContentHeight.value = pageContentRef.value.offsetHeight
    await getTreeData()
    await getDeviceListData()
})
</script>

