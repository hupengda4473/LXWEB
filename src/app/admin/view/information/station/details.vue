<template>
    <n-drawer v-model:show="compData.showAddModal" :width="700">
        <n-drawer-content title="测点详情" closable>
            <n-form
                label-placement="left"
                label-align="left"
                :size="formSize"
            >
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="测点名称：" path="LocationName">{{compData.data.LocationName}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="测点编码" path="LocationCode">{{compData.data.LocationCode}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="所在分组：" path="GroupID">{{compData.data.GroupName}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="测点类型：" path="LocationType">{{pointType.find(item => item.value == compData.data.LocationType).label}}</n-form-item-gi>

                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸门孔数：" path="GateHolesNum">{{compData.LocationJson.GateHolesNum}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="提闸高度(cm)：" path="GateLiftingHeight">{{compData.LocationJson.GateLiftingHeight}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸门宽度(m)：" path="GateWidth">{{compData.LocationJson.GateWidth}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸门高度(m)：" path="GateHeight">{{compData.LocationJson.GateHeight}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸墩高(m)：" path="PierHeight">{{compData.LocationJson.PierHeight}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸底高程(m)：" path="GateBottomElevation">{{compData.LocationJson.GateBottomElevation}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸前水尺测水点高程(m)：" path="BeforeElevation">{{compData.LocationJson.BeforeElevation}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="闸后水尺测水点高程(m)：" path="AfterElevation">{{compData.LocationJson.AfterElevation}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="水流形态：" path="FlowPattern">{{compData.LocationJson.FlowPattern}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="利用系数：" path="UtilizationFactor">{{compData.LocationJson.UtilizationFactor}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="翼墙形式：" path="WingWallForm">{{compData.LocationJson.WingWallForm}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" v-show="judgeShowOrHide()" :span="12" label="最大过水流量(m³/s)：" path="MaxFlow">{{compData.LocationJson.MaxFlow}}</n-form-item-gi>


                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="坐标经度：" path="Longitude">{{compData.LocationJson.Longitude}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="坐标纬度：" path="Latitude">{{compData.LocationJson.Latitude}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="地图编码：" path="LocationGisNo">{{compData.data.LocationGisNo}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="桩号：" path="StakeNum">{{compData.LocationJson.StakeNum}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="建设时间：" path="BuildDT">{{compData.LocationJson.BuildDT ? new Date(compData.LocationJson.BuildDT).format('yyyy-MM-dd') : ''}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="12" label="管理人员：" path="Manager">{{compData.LocationJson.Manager}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="24" label="联系方式：" path="Tel">{{compData.LocationJson.Tel}}</n-form-item-gi>
                    <n-form-item-gi style=" color: #56A9FD" :span="24" label="备注信息：" path="Remark">{{compData.data.Remark}}</n-form-item-gi>
                    <n-form-item-gi :span="24" label="上传图片：" path="txtPlanDoc">
                        <n-image
                            width="100"
                            style="margin-right: 24px"
                            v-for="(item, index) in compData.LocationJson.txtPlanDoc"
                            :key="index"
                            :src="item.url"
                        />
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button @click="compData.showAddModal = false">关闭</n-button>
                </n-space>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import {defineExpose, reactive} from "vue"
import {deepCopy} from "@/packages/utils/utils"
import {formSize, pointType} from '@/app/admin/config/config'

type Song = {
    showAddModal: boolean,
    data: object
    LocationJson: object
}
const compData = reactive<Song>({
    showAddModal: false,
    data: {
        LocationName: '',
        LocationCode: '',
        GroupID: '',
        LocationGisNo: '',
        LocationType: '',
        Remark: '',
        LocationID: '',
    },
    LocationJson: {
        Latitude: '',
        StakeNum: '',
        BuildDT: '',
        Manager: '',
        Tel: '',
        GateHolesNum: '',
        GateLiftingHeight: '',
        GateWidth: '',
        GateHeight: '',
        PierHeight: '',
        GateBottomElevation: '',
        BeforeElevation: '',
        AfterElevation: '',
        FlowPattern: '',
        UtilizationFactor: '',
        WingWallForm: '',
        MaxFlow: '',
        txtPlanDoc: [],
    }
})

const showDetails = (itemData: object) => {
    compData.showAddModal = true
    compData.data = {
        LocationName: '',
        LocationCode: '',
        GroupID: '',
        LocationGisNo: '',
        LocationType: '',
        Remark: '',
        LocationID: '',
    }
    compData.LocationJson = {
        Latitude: '',
        StakeNum: '',
        BuildDT: null,
        Manager: '',
        Tel: '',
        GateHolesNum: '',
        GateLiftingHeight: '',
        GateWidth: '',
        GateHeight: '',
        PierHeight: '',
        GateBottomElevation: '',
        BeforeElevation: '',
        AfterElevation: '',
        FlowPattern: '',
        UtilizationFactor: '',
        WingWallForm: '',
        MaxFlow: '',
        txtPlanDoc: [],
    }
    compData.data = deepCopy(itemData)
    compData.LocationJson = deepCopy(JSON.parse(itemData.LocationJson))
}

//判断显示隐藏
const judgeShowOrHide = () => {
    return compData.data.LocationType !== '' && compData.data.LocationType * 1 <= 4
}

defineExpose({
    showDetails,
})
</script>
