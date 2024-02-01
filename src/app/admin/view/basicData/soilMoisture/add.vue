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
                <n-form-item label="测点名称" path="LocationId">
                    <n-select
                        v-model:value="compData.data.LocationId"
                        label-field="LocationName"
                        value-field="LocationID"
                        placeholder="请选择测点名称"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="采集时间" path="CollectTime">
                    <n-date-picker style="width: 100%" placement="bottom-end" v-model:value="compData.data.CollectTime" type="datetime" :shortcuts="compData.shortcuts" placeholder="请选采集时间"/>
                </n-form-item>
                <n-form-item label="水温" path="Temperature">
                    <n-input-number clearable v-model:value="compData.data.Temperature" type="text" placeholder="请输入水温" style="width: 100%">
                        <template #suffix>
                            ℃
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="PH" path="PH">
                    <n-input-number clearable v-model:value="compData.data.PH" type="text" placeholder="请输入PH" style="width: 100%"/>
                </n-form-item>
                <n-form-item label="电导率" path="ElectricalConductivity">
                    <n-input-number clearable v-model:value="compData.data.ElectricalConductivity" type="text" placeholder="请输入电导率" style="width: 100%">
                        <template #suffix>
                            S/m
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="湿度" path="Moisture">
                    <n-input-number clearable v-model:value="compData.data.Moisture" type="text" placeholder="请输入湿度" style="width: 100%">
                        <template #suffix>
                            %
                        </template>
                    </n-input-number>
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
import {findAllLocation} from "@/app/admin/api/station"
import {AddSoilMoisture, ModifySoilMoisture} from "@/app/admin/api/soilMoisture"

const message = useMessage()

type AddParams = {
    DataId: string | number,
    LocationId: string | number | null,
    Temperature: string | number | null,
    PH: string | number | null,
    ElectricalConductivity: string | number | null,
    Moisture: string | number | null,
    CollectTime: any,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: object [],
    shortcuts: any,
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    shortcuts: {
        昨天: () => new Date().getTime() - 24 * 60 * 60 * 1000,
    },
    data: {
        DataId: 0,
        LocationId: null,
        CollectTime: null,
        Temperature: null,
        PH: null,
        ElectricalConductivity: null,
        Moisture: null,
    },
})

const rules = {
    LocationId: {
        required: true,
        message: '请选择测点名称',
    },
    CollectTime: {
        required: true,
        message: '请选择采集时间',
    },
    Temperature: {
        required: true,
        message: '请输入水温',
    },
    PH: {
        required: true,
        message: '请输入PH',
    },
    ElectricalConductivity: {
        required: true,
        message: '请输入电导率',
    },
    Moisture: {
        required: true,
        message: '请输湿度',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        DataId: 0,
        LocationId: null,
        CollectTime: null,
        Temperature: null,
        PH: null,
        ElectricalConductivity: null,
        Moisture: null,
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.CollectTime = new Date(data.CollectTime).getTime()
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = deepCopy(compData.data)
            params.CollectTime = new Date(compData.data.CollectTime).format('yyyy-MM-dd hh:mm:ss')
            if (compData.type === 'add') {
                AddSoilMoisture( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifySoilMoisture( params ).then(res => {
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

const findAllLocationData = () => {
    let params = {
        LocationType: '',
        Groups: '',
        LocationName: '',
    }
    findAllLocation(params).then(res =>{
        compData.generalOptions = res.data.Data
    })
}

onMounted(()=>{
    findAllLocationData()
})

defineExpose({
    openModal,
})
</script>
