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
                <n-form-item label="片区名称" path="BlockName">
                    <n-input clearable v-model:value="compData.data.BlockName" type="text" placeholder="请输入片区名称" />
                </n-form-item>
                <n-form-item label="组织名称" path="AssociationId">
                    <n-select
                        v-model:value="compData.data.AssociationId"
                        filterable
                        clearable
                        label-field="AssociationName"
                        value-field="ID"
                        placeholder="请选择组织名称"
                        :options="compData.generalOptions"
                    />
                </n-form-item>
                <n-form-item label="渠道名称" path="ChannelId">
                    <n-select
                        v-model:value="compData.data.ChannelId"
                        filterable
                        clearable
                        label-field="ChannelName"
                        value-field="ChannelID"
                        placeholder="请选择渠道名称"
                        :options="compData.channelList"
                    />
                </n-form-item>
                <n-form-item label="口门名称" path="DefineId">
                    <n-select
                        v-model:value="compData.data.DefineId"
                        filterable
                        clearable
                        label-field="DataLabel"
                        value-field="DefineId"
                        placeholder="请选择口门名称"
                        :options="compData.mouthDoorList"
                    />
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
import {FindAllWaterAssociation} from "@/app/admin/api/WaterAssociation"
import {AddIrrigateBlock, FindEntrance, ModifyIrrigateBlock} from "@/app/admin/api/IrrigateBlock"

const message = useMessage()

type AddParams = {
    BlockId: string | number,
    BlockName: string,
    AssociationId: string | number | null,
    ChannelId: string | number | null,
    DefineId: string | number | null,
}
type Song = {
    showAddModal: boolean,
    type: string,
    generalOptions: object [],
    channelList: object [],
    mouthDoorList: object [],
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    generalOptions: [],
    channelList: [],
    mouthDoorList: [],
    data: {
        BlockId: 0,
        BlockName: '',
        AssociationId: null,
        ChannelId: null,
        DefineId: null,
    },
})

const rules = {
    BlockName: {
        required: true,
        message: '请输入片区名称',
        trigger: ['input', 'blur']
    },
    AssociationId: {
        required: true,
        message: '请选择组织名称',
    },
    ChannelId: {
        required: true,
        message: '请选择渠道名称',
    },
    DefineId: {
        required: true,
        message: '请选择口门名称',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        BlockId: 0,
        BlockName: '',
        AssociationId: null,
        ChannelId: null,
        DefineId: null,
    }
    if (type === 'edit') {
        compData.data = deepCopy(itemData)
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
            if (compData.type === 'add') {
                AddIrrigateBlock( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                ModifyIrrigateBlock( params ).then(res => {
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

const findAllChannelData = () => {
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
    findAllChannel(params).then(res => {
        compData.channelList = res.data.Item1
    })
}

const getWaterAssociation = () => {
    FindAllWaterAssociation().then(res => {
        compData.generalOptions = res.data
    })
}

const FindEntranceData = () => {
    FindEntrance().then(res => {
        compData.mouthDoorList = res.data.Data
    })
}

defineExpose({
    openModal,
})
onMounted(()=>{
    findAllChannelData()
    getWaterAssociation()
    FindEntranceData()
})
</script>
