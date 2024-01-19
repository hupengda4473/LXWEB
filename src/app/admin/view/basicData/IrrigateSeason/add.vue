<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 600px;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.type === 'add' ? '新增灌季' : '编辑灌季'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-width="100"
                ref="formRef"
                :model="compData.data"
                :rules="rules"
            >
                <n-form-item label="灌季名称" path="SeasonName">
                    <n-select filterable v-model:value="compData.data.SeasonName" :options="IrrigateSeasonList" placeholder="请选择灌季" />
                </n-form-item>
                <n-form-item label="轮次" path="Round">
                    <n-select filterable v-model:value="compData.data.Round" :options="roundList" placeholder="请选择轮次" />
                </n-form-item>
                <n-form-item label="起止时间" path="rang">
                    <n-date-picker
                        v-model:value="compData.data.rang"
                        :format="compData.dateFormat"
                        type="datetimerange"
                        style="width: 100%"
                        clearable
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
import {defineEmits, defineExpose, reactive, ref} from "vue"
import {FormInst, useMessage} from "naive-ui"
import {deepCopy} from "@/packages/utils/utils"
import {IrrigateSeasonList, roundList} from "@/app/admin/config/config"
import {addIrrigateSeason, modifyIrrigateSeason} from "@/app/admin/api/IrrigateSeason"

const message = useMessage()

type AddParams = {
    SeasonID: string | number,
    rang: any [],
    SeasonName: string,
    Round: string | number,
}
type Song = {
    showAddModal: boolean,
    type: string,
    dateFormat: string,
    data: AddParams
}
const compData = reactive<Song>({
    showAddModal: false,
    type: 'add',
    dateFormat: 'MM月dd日',
    data: {
        SeasonID: 0,
        rang: [Date.now(), Date.now()],
        SeasonName: '',
        Round: '',
    },
})

const rules = {
    SeasonName: {
        required: true,
        message: '请选择灌季名称',
    },
    Round: {
        required: true,
        message: '请选择轮次',
    },
    rang: {
        required: true,
        message: '请选择起止时间',
    },
}

const openModal = ({type = 'add', itemData = {}}: { type?: string; itemData?: object }) => {
    compData.showAddModal = true
    compData.type = type
    compData.data = {
        SeasonID: 0,
        rang: [Date.now(), Date.now()],
        SeasonName: '',
        Round: '',
    }
    if (type === 'edit') {
        let data = deepCopy(itemData)
        compData.data = data
        let start = data.BeginDT.replace('月', '-').replace('日', '')
        let end = data.EndDT.replace('月', '-').replace('日', '')
        let year = new Date().getFullYear()
        compData.data.rang = [new Date(year + '-' + start), new Date(year + '-' + end)]
    }
}

//确认
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['refreshTable'])
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            let params = {
                SeasonID: compData.data.SeasonID,
                SeasonName: compData.data.SeasonName,
                Round: compData.data.Round,
                BeginDT: new Date(compData.data.rang[0]).format('MM月dd日'),
                EndDT: new Date(compData.data.rang[1]).format('MM月dd日'),
            }
            if (compData.type === 'add') {
                addIrrigateSeason( params ).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        compData.showAddModal = false
                        emit('refreshTable')
                    }
                })
            } else {
                modifyIrrigateSeason( params ).then(res => {
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

<style scoped>

</style>
