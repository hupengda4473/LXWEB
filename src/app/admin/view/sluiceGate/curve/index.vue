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
import {FindSluiceData} from "@/app/admin/api/sluiceGate"
import {getTree} from "@/app/admin/api/institution"
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {FindDeviceByGroupID} from "@/app/admin/api/device"
import * as echarts from "echarts"

const compData = reactive({
    showModal: false,
    allData: [],
    searchForm: {
        time: [Date.now() - 86400000, Date.now()],
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
            compData.allData = res.data || []
            // compData.allData = echartData
            compData.deviceName = compData.deviceList.find(item => item.DeviceID == compData.searchForm.deviceId).DeviceName

            let dateArr = [], arr1 = [], arr2 = [], arr3 = []
            if (compData.allData && compData.allData.length > 0) {
                for (let item of compData.allData) {
                    dateArr.push(item.DT)
                    arr1.push((item.BeforeWL * 1).toFixed(2))
                    arr2.push((item.BehindWL * 1).toFixed(2))
                    arr3.push((item.InstantFlux * 1).toFixed(2))
                }
            }
            initEchart(dateArr, arr1, arr2, arr3)
        })
    },
    search() {
        compHandle.getTableData()
    },
})

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
        await compHandle.getTableData()
    })
}

//刷新echart
const initEchart = (dateArr = [],arr1 = [], arr2 = [], arr3 = []) => {
    let dataZoomEnd = parseInt(30 / dateArr.length * 100) < 1 ? 1 : parseInt(30 / dateArr.length * 100)
    let option = {
        title: {
            text: compData.deviceName + '过程曲线',
            left: '50%',
            top: '20',
            textAlign: 'center'
        },
        grid: {
            show: true,
            left: "5%",
            top: "5%",
            right: "5%",
            bottom: "220",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            backgroundColor: 'rgba(255,255,255,1)',
            padding: [5, 10],
            textStyle: {
                color: '#7588E4',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        legend: {
            left: 20,
            orient: 'horizontal',
            x: 'center',
            y: '16px',
            data: ['闸前水位','闸后水位','瞬时流量']
        },
        xAxis: {
            type: 'category',
            data: dateArr,
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#609ee9'
                }
            },
            axisLabel: {
                margin: 10,
                interval: 0,
                rotate: 90,
                textStyle: {
                    fontSize: 12
                }
            }
        },
        dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '4.5%',
            bottom: 40,
            start: 0,
            end: dataZoomEnd //初始化滚动条
        }],
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#609ee9'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            }
        },
        series: [{
            name: '闸前水位',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: arr1,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: hexToRgba('#36CE9E', 0.3)
                        },
                        {
                            offset: 1,
                            color: hexToRgba('#36CE9E', 0.1)
                        }
                        ],
                        false
                    ),
                }
            },
            itemStyle: {
                normal: {
                    color: '#36CE9E'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }, {
            name: '闸后水位',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: arr2,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(216, 244, 247,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(216, 244, 247,1)'
                    }], false)
                }
            },
            itemStyle: {
                normal: {
                    color: '#58c8da'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }, {
            name: '瞬时流量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: arr3,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(199, 237, 250,0.5)'
                    }, {
                        offset: 1,
                        color: 'rgba(199, 237, 250,0.2)'
                    }], false)
                }
            },
            itemStyle: {
                normal: {
                    color: '#f7b851'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }]
    }
    const chartDom = document.getElementById("echartBox")
    const myChart = echarts.init(chartDom)
    myChart.setOption(option)
}

const hexToRgba = (hex, opacity) => {
    let rgbaColor = ""
    let reg = /^#[\da-f]{6}$/i
    if (reg.test(hex)) {
        rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
            "0x" + hex.slice(3, 5)
        )},${parseInt("0x" + hex.slice(5, 7))},${opacity})`
    }
    return rgbaColor
}

const pageContentRef = ref(null)
const pageContentHeight = ref(0)
onMounted(async ()=>{
    pageContentHeight.value = pageContentRef.value.offsetHeight
    await getTreeData()
    await getDeviceListData()
})
</script>

