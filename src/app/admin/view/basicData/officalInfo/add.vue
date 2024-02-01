<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增通知' : '编辑通知'"
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
                <n-form-item label="通知标题" path="Title">
                    <n-input clearable v-model:value="compData.data.Title" type="text" placeholder="请输入名称" />
                </n-form-item>
                <n-form-item label="通知状态" path="Status">
                    <n-select
                        v-model:value="compData.data.Status"
                        filterable
                        clearable
                        placeholder="请选择状态"
                        :options="officalInfoType"
                    />
                </n-form-item>
                <n-form-item label="生效时间" path="EffectiveTime">
                    <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.data.EffectiveTime" type="date" :shortcuts="compData.shortcuts" placeholder="请选生效时间"/>
                </n-form-item>
                <n-form-item label="截止时间" path="ExpiringTime">
                    <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.data.ExpiringTime" type="date" :shortcuts="compData.shortcuts" placeholder="请选截止时间"/>
                </n-form-item>
                <n-form-item label="详情" path="Brief">
                    <n-input clearable v-model:value="compData.data.Brief" type="textarea" placeholder="请输入详情" />
                </n-form-item>
                <n-form-item label="上传文件" path="UploadFiles">
                    <n-upload
                        :max="3"
                        :action="requestFileUrl + '/api/OfficalInfo/UploadFile'"
                        :on-before-upload="beforeUpload"
                        :on-finish="handleFinish"
                        :headers="{ Authorization: 'Bearer ' + token }"
                        v-model:file-list="compData.data.UploadFiles"
                        list-type="image"
                    >
                        <n-button type="info">上传文件</n-button>
                        (xls、xlsx、doc、docx、png、jpg、txt、pdf)
                    </n-upload>
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
import {defineEmits, defineExpose, reactive, ref} from "vue"
import {FormInst, UploadFileInfo, useMessage} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {formSize, requestUrl, requestFileUrl, officalInfoType} from '@/app/admin/config/config'
import locaStore from "@/packages/utils/locaStore"
import {AddOfficalInfo, ModifyOfficalInfo} from "@/app/admin/api/officalInfo"
import appPinia from "@/packages/pinia/app"

const message = useMessage()
const token = locaStore.get('token_lx_web')

type Song = {
    showAddModal: boolean,
    type: string,
    shortcuts: any,
    data: AddParams
}
type AddParams = {
    InfoId: string | number,
    Title: string,
    Brief: string,
    DocContent: string,
    Status: string | number | null,
    UploadFiles: any,
    EffectiveTime: any,
    ExpiringTime: any,
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    shortcuts: {
        昨天: () => new Date().getTime() - 24 * 60 * 60 * 1000,
    },
    data: {
        InfoId: 0,
        Title: '',
        Brief: '',
        DocContent: '',
        Status: null,
        EffectiveTime: null,
        ExpiringTime: null,
        UploadFiles: [],
    },
})

const rules = {
    Title: {
        required: true,
        message: '请输入名称',
        trigger: ['input', 'blur']
    },
    Brief: {
        required: true,
        message: '请输入详情',
        trigger: ['input', 'blur']
    },
    Status: {
        required: true,
        message: '请选择类型',
    },
    EffectiveTime: {
        required: true,
        message: '请选择生效时间',
    },
    ExpiringTime: {
        required: true,
        message: '请选择截止时间',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        InfoId: 0,
        Title: '',
        Brief: '',
        DocContent: '',
        Status: null,
        EffectiveTime: null,
        ExpiringTime: null,
        UploadFiles: [],
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.EffectiveTime = new Date(data.EffectiveTime).getTime()
        compData.data.ExpiringTime = new Date(data.ExpiringTime).getTime()
        compData.data.UploadFiles = data.UploadFiles && data.UploadFiles.length > 0 ? (data.UploadFiles || []) : []
    }
}

//上传文件
const beforeUpload = (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
}) => {
    // let arr = ['image/png', 'image/jpeg', 'image/jpg']
    // if (!arr.find(item => item === data.file.file.type)) {
    //     message.error('只能上传图片文件，请重新上传')
    //     return false
    // }
    // return true
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
    file.type =  JSON.parse((event?.target as XMLHttpRequest).response).Data.ext
    return file
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = deepCopy(compData.data)
            params.EffectiveTime = new Date(compData.data.EffectiveTime).format('yyyy-MM-dd')
            params.ExpiringTime = new Date(compData.data.ExpiringTime).format('yyyy-MM-dd')
            params.CreateTime = new Date().format('yyyy-MM-dd')
            const appStore = appPinia()
            params.UserId = appStore.userInfo.UserID
            if (compData.type === 'add') {
                AddOfficalInfo( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyOfficalInfo( params ).then(res => {
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

defineExpose({
    openModal,
})
</script>
