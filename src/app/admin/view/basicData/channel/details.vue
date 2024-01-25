<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.data.ChannelName || '详情'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="100"
                ref="formRef"
                :model="compData.data"
            >
                <n-form-item label="渠道名称：" path="ChannelName">{{compData.data.ChannelName}}</n-form-item>
                <n-form-item label="渠道编号：" path="ChannelNo">{{compData.data.ChannelNo}}</n-form-item>
                <n-form-item label="灌溉区域：" path="DistrictID">{{compData.data.DistrictID? compData.generalOptions.find(item => item.DistrictID === compData.data.DistrictID).DistrictName : ''}}</n-form-item>
                <n-form-item label="管理单位：" path="DepartName">{{compData.data.DepartName}}</n-form-item>
                <n-form-item label="渠道类型：" path="ChannelType">{{channelType.find(item => item.value === compData.data.ChannelType).label}}</n-form-item>
                <n-form-item label="上级渠道：" path="Pid">{{compData.data.Pid ? compData.channelList.find(item => item.ChannelID === compData.data.Pid).ChannelName : '无上级'}}</n-form-item>
                <n-form-item label="设计流量：" path="DesignFlow">{{compData.data.DesignFlow}}</n-form-item>
                <n-form-item label="最大水深：" path="MaxFlow">{{compData.data.MaxFlow}}</n-form-item>
                <n-form-item label="渠道长度：" path="ChannelLength">{{compData.data.ChannelLength}}</n-form-item>
            </n-form>
            <template #footer>
                <n-flex justify="end">
                    <n-space>
                        <n-button @click="compData.showAddModal = false">关闭</n-button>
                    </n-space>
                </n-flex>

            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import {defineExpose, onMounted, reactive} from "vue"
import {findAllIrrigateDistrict} from "@/app/admin/api/irrigated"
import {deepCopy} from "@/packages/utils/utils"
import {channelType} from "@/app/admin/config/config"


type AddParams = {
    ChannelID: string | number,
    ChannelName: string,
    ChannelNo: string,
    DistrictID: string | number,
    DepartName: string,
    ChannelType: string | number,
    Pid: string | number,
    DesignFlow: string | number,
    MaxFlow: string | number,
    ChannelLength: string | number,
}
type Song = {
    showAddModal: boolean,
    generalOptions: object [],
    channelList: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    generalOptions: [],
    channelList: [],
    data: {
        ChannelID: 0,
        ChannelName: '',
        ChannelNo: '',
        DistrictID: '',
        DepartName: '',
        ChannelType: '',
        Pid: '',
        DesignFlow: '',
        MaxFlow: '',
        ChannelLength: '',
    },
})

const openModal = ({ itemData = {}, list = []}: { itemData?: object, list?: [] }) => {
    compData.showAddModal = true
    compData.channelList = list
    compData.data = {
        ChannelID: 0,
        ChannelName: '',
        ChannelNo: '',
        DistrictID: '',
        DepartName: '',
        ChannelType: '',
        Pid: '',
        DesignFlow: '',
        MaxFlow: '',
        ChannelLength: '',
    }
    compData.data = deepCopy(itemData)
}

//获取灌区
const getIrrigatedArea = () => {
    let params = {
        PageSize: 999999999,
        PageIndex: 1,
        OrderField: "",
        OrderType: "",
        BeginDT: "",
        EndDT: "",
        FuzzyName: "",
        UserID: 0
    }
    findAllIrrigateDistrict(params).then(res => {
        compData.generalOptions = res.data.Item1
    })
}

defineExpose({
    openModal
})

onMounted( () => {
    getIrrigatedArea()
})
</script>

<style scoped>

</style>
