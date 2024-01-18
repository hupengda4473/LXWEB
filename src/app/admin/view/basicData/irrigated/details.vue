<template>
    <n-drawer v-model:show="compData.showAddModal" :width="700">
        <n-drawer-content title="测点详情" closable>
            <n-form
                label-placement="left"
                label-align="left"
                :size="formSize"
            >
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="24" label="设备名称" path="DeviceName">{{compData.data.DeviceName}}</n-form-item-gi>
                    <n-form-item-gi :span="24" label="设备编码" path="DeviceCode">{{compData.data.DeviceCode}}</n-form-item-gi>
                    <n-form-item-gi v-show="!judgeShowOrHide()" :span="24" label="站点ID" path="StationID">{{compData.data.StationName}}</n-form-item-gi>
                    <n-form-item-gi :span="24" label="设备类型" path="Type">{{deviceType.find(item => item.value == compData.data.Type).label}}</n-form-item-gi>

                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频地址" path="VideoIP">{{compData.DeviceJson.VideoIP}}</n-form-item-gi>
                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频端口" path="VideoPort">{{compData.DeviceJson.VideoPort}}</n-form-item-gi>
                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频标识" path="VideoGUID">{{compData.DeviceJson.VideoGUID}}</n-form-item-gi>
                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频通路" path="VideoAccess">{{compData.DeviceJson.VideoAccess}}</n-form-item-gi>

                    <n-form-item-gi :span="24" label="选择分组" path="GroupID">{{compData.data.GroupName}}</n-form-item-gi>
                    <n-form-item-gi :span="24" label="选择测点" path="LocationID">{{compData.data.LocationName}}</n-form-item-gi>
                    <n-form-item-gi :span="24" label="地图编码" path="DeviceGisNo">{{compData.data.DeviceGisNo}}</n-form-item-gi>
                    <n-form-item-gi :span="24" label="上传图片：">
                        <n-image
                            width="100"
                            style="margin-right: 24px"
                            v-for="(item, index) in compData.data.Img"
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
import {formSize, deviceType} from '@/app/admin/config/config'

const compData = reactive({
    showAddModal: false,
    data: {
        DeviceName: '',
        DeviceCode: '',
        StationID: '',
        Type: '',
        DeviceGisNo: '',
        GroupID: '',
        LocationID: '',
        DeviceID: '',
        Img: [],
    },
    DeviceJson: {
        VideoIP: '',
        VideoPort: '',
        VideoGUID: '',
        VideoAccess: '',
    }
})

const showDetails = (itemData: object) => {
    compData.showAddModal = true
    compData.data = {
        DeviceName: '',
        DeviceCode: '',
        StationID: '',
        Type: '',
        DeviceGisNo: '',
        GroupID: '',
        LocationID: '',
        DeviceID: '',
        Img: [],
    }
    compData.DeviceJson = {
        VideoIP: '',
        VideoPort: '',
        VideoGUID: '',
        VideoAccess: '',
    }
    compData.data = deepCopy(itemData)
    compData.data.Img = deepCopy(JSON.parse(itemData.Img))
    compData.DeviceJson = itemData.DeviceJson ? deepCopy(JSON.parse(itemData.DeviceJson)) : {}
}

//判断显示隐藏
const judgeShowOrHide = () => {
    return compData.data.Type === 'Video'
}

defineExpose({
    showDetails,
})
</script>
