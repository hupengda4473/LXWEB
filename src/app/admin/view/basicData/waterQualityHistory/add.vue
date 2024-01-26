<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增' : '编辑'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="90"
                ref="formRef"
                :size="formSize"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="测点名称" path="LocationId">
                    <n-select
                        v-model:value="compData.data.LocationId"
                        filterable
                        clearable
                        placeholder="请选择测点"
                        label-field="LocationName"
                        value-field="LocationID"
                        :options="compData.locationList"
                    />
                </n-form-item>
                <n-form-item label="采集时间" path="CollectTime">
                    <n-date-picker v-model:value="compData.data.CollectTime" type="datetime" placeholder="请选择采集时间" clearable style="width: 100%" />
                </n-form-item>
                <n-form-item label="温度" path="Temperature">
                    <n-input-number clearable v-model:value="compData.data.Temperature" type="text" placeholder="请输入温度" style="width: 100%">
                        <template #suffix>
                            ℃
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="PH" path="PH">
                    <n-input-number clearable v-model:value="compData.data.PH" type="text" placeholder="请输入PH值" style="width: 100%" />
                </n-form-item>
                <n-form-item label="电导率" path="ElectricalConductivity">
                    <n-input-number clearable v-model:value="compData.data.ElectricalConductivity" type="text" placeholder="请输入电导率" style="width: 100%">
                        <template #suffix>
                            S/m
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="COD" path="COD">
                    <n-input-number clearable v-model:value="compData.data.COD" type="text" placeholder="请输入COD" style="width: 100%">
                        <template #suffix>
                            mg/L
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="浊度" path="Turbidity">
                    <n-input-number clearable v-model:value="compData.data.Turbidity" type="text" placeholder="请输入浊度" style="width: 100%">
                        <template #suffix>
                            TU
                        </template>
                    </n-input-number>
                </n-form-item>
                <n-form-item label="溶解氧" path="DissolvedOxygen">
                    <n-input-number clearable v-model:value="compData.data.DissolvedOxygen" type="text" placeholder="请输入溶解氧" style="width: 100%">
                        <template #suffix>
                            mg/L
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
import {AddWaterQuality, ModifyWaterQuality} from "@/app/admin/api/waterQuality"

const message = useMessage()

type AddParams = {
    DataId: string | number,
    LocationId: string | number | null,
    CollectTime: string | number | null,
    Temperature: string | number | null,
    PH: string | number | null,
    ElectricalConductivity: string | number | null,
    COD: string | number | null,
    Turbidity: string | number | null,
    DissolvedOxygen: string | number | null,
}
type Song = {
    showAddModal: boolean,
    type: string,
    locationList: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    locationList: [],
    data: {
        DataId: 0,
        LocationId: null,
        Temperature: null,
        PH: null,
        ElectricalConductivity: null,
        COD: null,
        Turbidity: null,
        DissolvedOxygen: null,
        CollectTime: new Date().getTime(),
    },
})

const rules = {
    LocationId: {
        required: true,
        message: '请选择测点',
    },
    CollectTime: {
        required: true,
        message: '请选择采集时间',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        DataId: 0,
        LocationId: null,
        Temperature: null,
        PH: null,
        ElectricalConductivity: null,
        COD: null,
        Turbidity: null,
        DissolvedOxygen: null,
        CollectTime: new Date().getTime(),
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        compData.data.CollectTime = new Date(data.CollectTime).getTime() || null
    }
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
            params.CollectTime = new Date(data.CollectTime).format("yyyy-MM-dd hh:mm:ss")
            if (compData.type === 'add') {
                AddWaterQuality( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyWaterQuality( params ).then(res => {
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

//获取测点
const getLocationList = () => {
    let params = {
        LocationType: '',
        Groups: '',
        LocationName: '',
    }
    findAllLocation(params).then(res => {
        compData.locationList = res.data.Data
    })
}

onMounted(()=> {
    getLocationList()
})

defineExpose({
    openModal,
})
</script>
