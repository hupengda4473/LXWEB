<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增用利用率' : '编辑利用率'"
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
                <n-form-item label="作物名称" path="CropId">
                    <n-select
                        v-model:value="compData.data.CropId"
                        filterable
                        clearable
                        label-field="CropName"
                        value-field="CropID"
                        placeholder="请选择作物名称"
                        :options="compData.cropList"
                    />
                </n-form-item>
                <n-form-item label="种植面积" path="PlantingArea">
                    <n-input-number clearable v-model:value="compData.data.PlantingArea" type="text" placeholder="请输入种植面积" style="width: 100%">
                        <template #suffix>
                            亩
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="用水单位" path="AssociationId">
                    <n-select
                        v-model:value="compData.data.AssociationId"
                        filterable
                        clearable
                        label-field="AssociationName"
                        value-field="ID"
                        placeholder="请选择用水单位"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="年份" path="Year">
                    <n-date-picker v-model:value="compData.data.Year" type="year" clearable placeholder="请选择年份" style="width: 100%" />
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
import {deepCopy} from "@/packages/utils/utils"
import {formSize} from '@/app/admin/config/config'
import {findAllChannel} from "@/app/admin/api/channel"
import {AddChannelRatio, ModifyChannelRatio} from "@/app/admin/api/usage"
import {findAllCrop} from "@/app/admin/api/crop"
import {AddWaterAssociationCrop, ModifyWaterAssociationCrop} from "@/app/admin/api/WaterAssociationCrop";
import {FindAllWaterAssociation} from "@/app/admin/api/WaterAssociation";

const message = useMessage()

type AddParams = {
    ID: string | number,
    CropId: string | number | null,
    PlantingArea: string | number | null,
    AssociationId: string | number | null,
    Year: any,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: object [],
    cropList: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    cropList: [],
    data: {
        ID: 0,
        CropId: null,
        PlantingArea: null,
        AssociationId: null,
        Year: new Date().getFullYear(),
    },
})

const rules = {
    CropId: {
        required: true,
        message: '请选择作物名称',
    },
    AssociationId: {
        required: true,
        message: '请选择用水单位',
    },
    PlantingArea: {
        required: true,
        message: '请输入种植面积',
    },
    Year: {
        required: true,
        message: '请选择年份',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        ID: 0,
        Ratio: null,
        ChannelID: null,
        Year: null,
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.Year = new Date(data.Year + '-01-01').getTime()
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
            params.Year = new Date(compData.data.Year).getFullYear()
            if (compData.type === 'add') {
                AddWaterAssociationCrop( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterAssociationCrop( params ).then(res => {
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

let params = {
    PageSize: 999999999,
    PageIndex: 1,
    OrderField: "",
    OrderType: "",
    BeginDT: "",
    EndDT: "",
    FuzzyName: "",
    UserID: 1
}
const getWaterAssociation = () => {
    FindAllWaterAssociation().then(res => {
        compData.generalOptions = res.data
    })
}
const findAllCropData = () => {
    findAllCrop(params).then((res) => {
        compData.cropList = res.data.Item1
    })
}



defineExpose({
    openModal,
})
onMounted(()=>{
    findAllCropData()
    getWaterAssociation()
})
</script>
