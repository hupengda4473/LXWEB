<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增参数' : '编辑参数'"
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
                <n-form-item label="措施名称" path="Title">
                    <n-input clearable v-model:value="compData.data.Title" type="text" placeholder="请输入措施名称" />
                </n-form-item>
                <n-form-item label="措施类型" path="InfoType">
                    <n-select
                        v-model:value="compData.data.InfoType"
                        filterable
                        clearable
                        placeholder="请选择措施类型"
                        :options="floodControlMeasuresType"
                    />
                </n-form-item>
                <n-form-item label="措施详情" path="Detail">
                    <n-input clearable v-model:value="compData.data.Detail" type="textarea" placeholder="请输入措施详情" />
                </n-form-item>
                <n-form-item label="上传文件" path="DocFile">
                    <n-upload
                        :max="3"
                        :action="requestFileUrl + '/api/FloodControlInfo/UploadFile'"
                        :on-before-upload="beforeUpload"
                        :on-finish="handleFinish"
                        :headers="{ Authorization: 'Bearer ' + token }"
                        v-model:file-list="compData.data.UploadFiles"
                        list-type="image"
                    >
                        <n-button type="info">上传文件</n-button>
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
import {formSize, floodControlMeasuresType, requestUrl, requestFileUrl} from '@/app/admin/config/config'
import locaStore from "@/packages/utils/locaStore"
import {AddFloodControlInfo, ModifyFloodControlInfo} from "@/app/admin/api/floodControlInfo"

const message = useMessage()
const token = locaStore.get('token_lx_web')

type AddParams = {
    InfoId: string | number,
    Title: string,
    Detail: string,
    InfoType: string | number | null,
    UploadFiles: any,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    data: {
        InfoId: 0,
        Title: '',
        Detail: '',
        InfoType: null,
        UploadFiles: [],
    },
})

const rules = {
    Title: {
        required: true,
        message: '请输入措施名称',
        trigger: ['input', 'blur']
    },
    Detail: {
        required: true,
        message: '请输入措施详情',
        trigger: ['input', 'blur']
    },
    InfoType: {
        required: true,
        message: '请选择措施类型',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        InfoId: 0,
        Title: '',
        Detail: '',
        InfoType: null,
        UploadFiles: [],
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
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
            if (compData.type === 'add') {
                AddFloodControlInfo( compData.data ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyFloodControlInfo( compData.data ).then(res => {
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
