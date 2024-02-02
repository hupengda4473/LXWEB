<template>
    <n-drawer v-model:show="compData.showAddModal" :width="700">
        <n-drawer-content :title="compData.type === 'add' ? '新增' : '编辑'" closable>
            <n-form
                ref="formRef"
                :model="compData.data"
                :rules="rules"
                label-placement="left"
                label-width="150"
                :size="formSize"
            >
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="12" label="测点名称" path="LocationName">
                        <n-input v-model:value="compData.data.LocationName" placeholder="请输入测点名称" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="测点编码" path="LocationCode">
                        <n-input v-model:value="compData.data.LocationCode" placeholder="请输入测点编码" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="选择分组" path="GroupID">
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
                    <n-form-item-gi :span="12" label="坐标经度" path="Longitude">
                        <n-input v-model:value="compData.LocationJson.Longitude" placeholder="请输入坐标经度" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="坐标纬度" path="Latitude">
                        <n-input v-model:value="compData.LocationJson.Latitude" placeholder="请输入坐标纬度" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="地图编码" path="LocationGisNo">
                        <n-input v-model:value="compData.data.LocationGisNo" placeholder="请输入地图编码" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="桩号" path="StakeNum">
                        <n-input v-model:value="compData.LocationJson.StakeNum" placeholder="请输入桩号" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="建设时间" path="BuildDT">
                        <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.LocationJson.BuildDT" type="date" :shortcuts="compData.shortcuts" placeholder="请选择建设时间"/>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="管理人员" path="Manager">
                        <n-input v-model:value="compData.LocationJson.Manager" placeholder="请输入管理人员" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="联系方式" path="Tel">
                        <n-input v-model:value="compData.LocationJson.Tel" placeholder="请输入联系方式" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="备注信息" path="Remark">
                        <n-input type="textarea" v-model:value="compData.data.Remark" placeholder="请输入备注信息" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="上传图片" path="txtPlanDoc">
<!--                        :image-group-props="{-->
<!--                        showToolbar: false-->
<!--                        }"-->
                        <n-upload
                            :action="requestFileUrl + '/api/Location/UploadFile'"
                            :on-before-upload="beforeUpload"
                            :on-finish="handleFinish"
                            v-model:file-list="compData.LocationJson.txtPlanDoc"
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
import {formSize, pointType, requestUrl, requestFileUrl} from '@/app/admin/config/config'
import {treeDeleteChildren} from "@/app/admin/untils/untils"
import {AddLocation, modifyLocation} from "@/app/admin/api/station"

const message = useMessage()

type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: any,
    data: object
    shortcuts: object
    LocationJson: object
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    shortcuts: {
        昨天: () => new Date().getTime() - 24 * 60 * 60 * 1000,
    },
    data: {
        LocationName: '',
        LocationCode: '',
        GroupID: '',
        LocationGisNo: '',
        LocationType: 10,
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
        GateLiftingHeight: null,
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

const rules = {
    LocationName: {
        required: true,
        message: '请输入测点名称',
        trigger: ['input', 'blur']
    },
    LocationCode: {
        required: true,
        message: '请输入测点编码',
        trigger: ['input', 'blur']
    },
    GroupID: {
        required: true,
        message: '请选择分组',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.data = {
        LocationName: '',
        LocationCode: '',
        GroupID: '',
        LocationGisNo: '',
        LocationType: 10,
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
        GateLiftingHeight: null,
        GateWidth: null,
        GateHeight: null,
        PierHeight: null,
        GateBottomElevation: null,
        BeforeElevation: null,
        AfterElevation: null,
        FlowPattern: '',
        UtilizationFactor: '',
        WingWallForm: '',
        MaxFlow: null,
        txtPlanDoc: [],
    }
    compData.type = type
    if (type === 'edit') {
        compData.data = deepCopy(itemData)
        let LocationJson = deepCopy(JSON.parse(itemData.LocationJson))
        compData.LocationJson = LocationJson
        compData.LocationJson.BuildDT = LocationJson.BuildDT || null
        compData.data.LocationID = itemData.LocationID || ''
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = compData.data
            params.LocationJson = JSON.stringify(compData.LocationJson)
            if (compData.type === 'add') {
                AddLocation( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyLocation( params ).then(res => {
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
})

defineExpose({
    openModal,
})
</script>
