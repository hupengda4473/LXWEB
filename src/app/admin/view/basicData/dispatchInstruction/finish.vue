<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            title="完成指令"
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
                <n-form-item label="完成情况" path="FinishStatus">
                    <n-select
                        v-model:value="compData.data.FinishStatus"
                        filterable
                        clearable
                        placeholder="请选择完成情况"
                        :options="finishStatusType"
                    />
                </n-form-item>
                <n-form-item label="完成说明" path="FinishDetail">
                    <n-input clearable v-model:value="compData.data.FinishDetail" type="textarea" placeholder="请输入详情" />
                </n-form-item>
                <n-form-item label="上传文件" path="UploadFiles">
                    <n-upload
                        :max="3"
                        :action="requestFileUrl + '/api/DispatchInstruction/UploadFile'"
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
import {formSize, finishStatusType, requestUrl, requestFileUrl} from '@/app/admin/config/config'
import locaStore from "@/packages/utils/locaStore"
import {Feedback} from "@/app/admin/api/dispatchInstruction"

const message = useMessage()
const token = locaStore.get('token_lx_web')

type Song = {
    showAddModal: boolean,
    data: AddParams
}
type AddParams = {
    DispId: string | number,
    FinishStatus: string | number | null,
    FinishDetail: string,
    ExecutorId : string | number | null,
    UploadFiles : any,
}
const compData = reactive<Song>({
    showAddModal: false,
    data: {
        DispId: 0,
        FinishStatus: null,
        FinishDetail: '',
        ExecutorId : null,
        UploadFiles: []
    }
})

const rules = {
    // FinishDetail: {
    //     required: true,
    //     message: '请输入完成说明',
    //     trigger: ['input', 'blur']
    // },
    FinishStatus: {
        required: true,
        message: '请选择完成情况别',
    },
}

const openModal = ({itemData = {}}: { itemData?: object }) => {
    compData.showAddModal = true
    compData.data = {
        DispId: 0,
        FinishStatus: null,
        FinishDetail: '',
        ExecutorId : null,
        UploadFiles: []
    }
    let data = deepCopy(itemData)
    compData.data = data
    compData.data.UploadFiles = data.UploadFiles && data.UploadFiles.length > 0 ? (data.UploadFiles || []) : []
}


//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = deepCopy(compData.data)
            params.FinishStatus == 0 ? params.FinishTime = new Date().format('yyyy-MM-dd hh:mm:ss'): ''
            Feedback( params ).then(res => {
                if (res.data.Code === 0) {
                    message.warning("完成失败，请重试")
                } else {
                    message.success("完成成功")
                    compData.showAddModal = false
                    emit('refreshTable')
                }
            })
        }
    })
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

defineExpose({
    openModal,
})
</script>
