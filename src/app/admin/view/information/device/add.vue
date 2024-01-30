<template>
    <n-drawer v-model:show="compData.showAddModal" :width="600">
        <n-drawer-content :title="compData.type === 'add' ? '新增' : '编辑'" closable>
            <n-form
                ref="formRef"
                :model="compData.data"
                :rules="rules"
                label-placement="left"
                label-width="100"
                :size="formSize"
            >
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="24" label="设备名称" path="DeviceName">
                        <n-input v-model:value="compData.data.DeviceName" placeholder="请输入测点名称" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="设备编码" path="DeviceCode">
                        <n-input v-model:value="compData.data.DeviceCode" placeholder="请输入测点编码" />
                    </n-form-item-gi>
                    <n-form-item-gi v-show="!judgeShowOrHide()" :span="24" label="站点ID" path="StationID">
                        <n-select
                            v-model:value="compData.data.StationID"
                            filterable
                            clearable
                            placeholder="请选择站点ID"
                            label-field="StationName"
                            value-field="StationID"
                            :options="compData.siteList"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="设备类型" path="Type">
                        <n-select
                            v-model:value="compData.data.Type"
                            filterable
                            clearable
                            placeholder="请选择设备类型"
                            :options="deviceType"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频地址" path="VideoIP">
                        <n-input v-model:value="compData.DeviceJson.VideoIP" placeholder="请输入视频地址" />
                    </n-form-item-gi>
                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频端口" path="VideoPort">
                        <n-input v-model:value="compData.DeviceJson.VideoPort" placeholder="请输入视频端口" />
                    </n-form-item-gi>
                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频标识" path="VideoGUID">
                        <n-input v-model:value="compData.DeviceJson.VideoGUID" placeholder="请输入视频标识" />
                    </n-form-item-gi>
                    <n-form-item-gi v-show="judgeShowOrHide()" :span="24" label="视频通路" path="VideoAccess">
                        <n-input v-model:value="compData.DeviceJson.VideoAccess" placeholder="请输入视频通路" />
                    </n-form-item-gi>

                    <n-form-item-gi :span="24" label="选择分组" path="GroupID">
                        <n-cascader
                            v-model:value="compData.data.GroupID"
                            :options="compData.generalOptions"
                            :size="formSize"
                            :show-path="false"
                            :clearable="true"
                            placeholder="请选择分组"
                            check-strategy="all"
                            expand-trigger="hover"
                            label-field="GroupName"
                            value-field="GroupID"
                            children-field="Children"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="选择测点" path="LocationID">
                        <n-select
                            v-model:value="compData.data.LocationID"
                            filterable
                            clearable
                            placeholder="请选择测点"
                            label-field="LocationName"
                            value-field="LocationID"
                            :options="compData.locationList"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="地图编码" path="DeviceGisNo">
                        <n-input v-model:value="compData.data.DeviceGisNo" placeholder="请输入地图编码" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="上传图片" path="txtPlanDoc">
<!--                        :image-group-props="{-->
<!--                        showToolbar: false-->
<!--                        }"-->
                        <n-upload
                            :action="requestFileUrl + '/api/DeviceInfo/UploadFile'"
                            :headers="{ Authorization: 'Bearer ' + token }"
                            :on-before-upload="beforeUpload"
                            :on-finish="handleFinish"
                            v-model:file-list="compData.data.Img"
                            list-type="image-card"
                            accept="image/*"
                        >
                            点击上传
                        </n-upload>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button @click="compData.showAddModal = false">取消</n-button>
                    <n-button type="primary" @click="drawerConfirm">确认</n-button>
                </n-space>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, onMounted, reactive, ref} from "vue"
import {FormInst, useMessage, UploadFileInfo} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {getTree} from '@/app/admin/api/institution'
import {addDevice, findNotRelationDevice, modifyDevice} from '@/app/admin/api/device'
import {formSize, deviceType, requestUrl, requestFileUrl} from '@/app/admin/config/config'
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {findAllLocation} from "@/app/admin/api/station"
import locaStore from "@/packages/utils/locaStore"

const message = useMessage()
const token = locaStore.get('token_lx_web')

type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: any,
    siteList: [],
    locationList: any,
    data: object
    DeviceJson: object
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    siteList: [],
    locationList: [],
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

const rules = {
    DeviceName: {
        required: true,
        message: '请输入设备名称',
        trigger: ['input', 'blur']
    },
    DeviceCode: {
        required: true,
        message: '请输入设备编码',
        trigger: ['input', 'blur']
    },
    StationID: {
        required: true,
        message: '请选择站点ID',
    },
    Type: {
        required: true,
        message: '请选择设备类型',
        trigger: ['blur', 'change'],
    },
    GroupID: {
        required: true,
        message: '请选择分组',
    },
    LocationID: {
        required: true,
        message: '请选择测点',
    },
    DeviceGisNo: {
        required: true,
        message: '请输入地图编码',
        trigger: ['input', 'blur']
    }
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
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
    compData.type = type
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.DeviceJson = data.DeviceJson ? JSON.parse(data.DeviceJson) : {}
        compData.data.DeviceID = itemData.DeviceID || ''
        compData.data.Img = itemData.Img ? deepCopy(JSON.parse(itemData.Img)) : []
    }
    findNotRelationDeviceData(compData.data.StationID || 0)
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let data = deepCopy(compData.data)
            let params = data
            params.Img = JSON.stringify(data.Img)
            params.DeviceJson = JSON.stringify(compData.DeviceJson)
            if (compData.type === 'add') {
                addDevice( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyDevice( params ).then(res => {
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

//获取上级机构
const getTreeData = () => {
    getTree(0).then(res => {
        compData.generalOptions = treeDeleteChildren(res.data) || []
    })
}

//获取站点列表
const findNotRelationDeviceData = (id: string | number) => {
    findNotRelationDevice(id).then(res => {
        compData.siteList = res.data
    })
}

//获取测点列表
const findLocationData = () => {
    let params = {
        LocationType: '',
        Groups: '',
        LocationName: '',
    }
    findAllLocation(params).then(res => {
        compData.locationList = res.data.Data
    })
}

//判断显示隐藏
const judgeShowOrHide = () => {
    return compData.data.Type === 'Video'
}

//上传图片
const beforeUpload = (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
}) => {
    let arr = ['image/png', 'image/jpeg', 'image/jpg']
    if (!arr.find(item => item === data.file.file.type)) {
        message.error('只能上传图片文件，请重新上传')
        return false
    }
    return true
}
const handleFinish = ({
    file,
    event
}: {
    file: UploadFileInfo
    event?: ProgressEvent
}) => {
    file.thumbnailUrl =  requestUrl + JSON.parse((event?.target as XMLHttpRequest).response).Data.url
    file.url =  requestUrl + JSON.parse((event?.target as XMLHttpRequest).response).Data.url
    return file
}

onMounted(() => {
    getTreeData()
    findLocationData()
})

defineExpose({
    openModal,
})
</script>

<style scoped>

</style>
