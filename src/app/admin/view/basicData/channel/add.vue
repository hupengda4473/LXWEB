<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增渠道' : '编辑渠道'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="100"
                ref="formRef"
                :size="formSize"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="渠道名称" path="ChannelName">
                    <n-input clearable v-model:value="compData.data.ChannelName" type="text" placeholder="请输入渠道名称" />
                </n-form-item>
                <n-form-item label="渠道编号" path="ChannelNo">
                    <n-input clearable v-model:value="compData.data.ChannelNo" type="text" placeholder="请输入渠道编号" />
                </n-form-item>
                <n-form-item label="灌溉区域" path="DistrictID">
                    <n-select
                        v-model:value="compData.data.DistrictID"
                        filterable
                        clearable
                        label-field="DistrictName"
                        value-field="DistrictID"
                        placeholder="请选择灌溉区域"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="管理单位" path="DepartName">
                    <n-input clearable v-model:value="compData.data.DepartName" type="text" placeholder="请输入管理单位" />
                </n-form-item>
                <n-form-item label="渠道类型" path="ChannelType">
                    <n-select
                        v-model:value="compData.data.ChannelType"
                        filterable
                        clearable
                        placeholder="请选择渠道类型"
                        :options="channelType"
                    />
                </n-form-item>
                <n-form-item label="上级渠道" path="Pid">
                    <n-select
                        v-model:value="compData.data.Pid"
                        filterable
                        clearable
                        label-field="ChannelName"
                        value-field="ChannelID"
                        placeholder="请选择上级渠道"
                        :options="compData.channelList"
                    />
                </n-form-item>
                <n-form-item label="设计流量" path="DesignFlow">
                    <n-input clearable v-model:value="compData.data.DesignFlow" type="text" placeholder="请输入设计流量" />
                </n-form-item>
                <n-form-item label="最大水深" path="MaxFlow">
                    <n-input clearable v-model:value="compData.data.MaxFlow" type="text" placeholder="请输入最大水深" />
                </n-form-item>
                <n-form-item label="渠道长度" path="ChannelLength">
                    <n-input clearable v-model:value="compData.data.ChannelLength" type="text" placeholder="请输入渠道长度" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-flex justify="end">
                    <n-space>
                        <n-button @click="compData.showAddModal = false">取消</n-button>
                        <n-button type="success" @click="drawerConfirm">确认</n-button>
                    </n-space>
                </n-flex>

            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, onMounted, reactive, ref} from "vue"
import {FormInst, useMessage} from "naive-ui"
import {findAllIrrigateDistrict} from "@/app/admin/api/irrigated"
import {deepCopy} from "@/packages/utils/utils"
import {channelType} from "@/app/admin/config/config"
import {addChannel, modifyChannel} from "@/app/admin/api/channel"
import {formSize} from '@/app/admin/config/config'

const message = useMessage()

type AddParams = {
    ChannelID: string | number,
    ChannelName: string,
    ChannelNo: string,
    DistrictID: any,
    DepartName: string,
    ChannelType: string | number,
    Pid: any,
    DesignFlow: string | number,
    MaxFlow: string | number,
    ChannelLength: string | number,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: object [],
    channelList: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
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

const rules = {
    ChannelName: {
        required: true,
        message: '请输入灌区名称',
        trigger: ['input', 'blur']
    },
    ChannelNo: {
        required: true,
        message: '请输入渠道编号',
        trigger: ['input', 'blur']
    },
    DistrictID: {
        required: true,
        message: '请选择灌溉区域',
    },
    DepartName: {
        required: true,
        message: '请输入管理单位',
        trigger: ['input', 'blur']
    },
    ChannelType: {
        required: true,
        message: '请选择渠道类型',
    },
    DesignFlow: {
        required: true,
        message: '请输入设计流量',
        trigger: ['input', 'blur']
    },
    MaxFlow: {
        required: true,
        message: '请输入最大水深',
        trigger: ['input', 'blur']
    },
    ChannelLength: {
        required: true,
        message: '请输入渠道长度',
        trigger: ['input', 'blur']
    },
}

const openModal = ({type = 'add', itemData = {}, list = []}: { type?: string; itemData?: object, list?: [] }) => {
    compData.showAddModal = true
    compData.channelList = list
    compData.type = type
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
    if (type === 'edit') {
        compData.data = deepCopy(itemData)
        compData.data.Pid = deepCopy(itemData).Pid || null
        compData.data.DistrictID = deepCopy(itemData).DistrictID || null
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            if (compData.type === 'add') {
                addChannel( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyChannel( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("修改失败，请重试")
                    } else {
                        message.success("修改成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            }
        }
    })
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
    openModal,
})

onMounted( () => {
    getIrrigatedArea()
})
</script>
