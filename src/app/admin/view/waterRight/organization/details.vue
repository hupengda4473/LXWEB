<template>
    <n-modal v-model:show="compData.showAddModal">
        <n-card
            style="width: 50%;"
            header-style="text-align: center;"
            footer-style="text-align: center;"
            :title="compData.data.AssociationName"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                label-placement="left"
                label-align="right"
                :show-label="true"
                ref="searchFormRef"
                inline
                :model="compData.searchForm">
                <n-grid cols="24" x-gap="30" item-responsive responsive="screen">
                    <n-grid-item span="24 m:12 l:12">
                        <n-form-item label="模糊搜索：" path="keyWord">
                            <n-input clearable v-model:value="compData.searchForm.keyWord" placeholder="请输入关键字"/>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item span="24 m:8 l:6">
                        <n-form-item>
                            <n-space>
                                <n-button attr-type="button" @click="compHandle.search" :color="btnConfig.ser">
                                    <template #icon v-if="btnConfig.showIco && btnConfig.ico.ser">
                                        <component
                                            class="ico"
                                            :is="renderIcon(btnConfig.ico.ser)"
                                        />
                                    </template>
                                    搜索
                                </n-button>
                            </n-space>
                        </n-form-item>
                    </n-grid-item>
                </n-grid>
            </n-form>
            <n-data-table
                ref="tableRef"
                style="padding-bottom: 24px"
                :cascade="tableSetting.cascade"
                :bottom-bordered="tableSetting.bottomBordered"
                :default-expand-all="tableSetting.defaultExpandAll"
                :flex-height="tableSetting.flexHeight"
                :paginate-single-page="tableSetting.paginateSinglePage"
                :single-column="tableSetting.singleColumn"
                :single-line="tableSetting.singleLine"
                :striped="tableSetting.striped"
                :summary-placement="tableSetting.summaryPlacement"
                :pagination="tableSetting.paginationReactive"
                :style="tableSetting.style"

                :columns="compData.columns"
                :data="compData.tableData"
                :loading="compData.loading"
                :size="compData.tableSizeValue"
                :row-key="compData.rowKey"
                v-model:checked-row-keys="checkedRowKeys"
                :max-height="400"
                @update:checked-row-keys="compHandle.check"
            />
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
import {deepCopy} from "@/packages/utils/utils"
import {btnConfig} from '@/app/admin/config/config.js'
import {renderIcon} from '@/packages/config/icon.ts'
import {Search} from "@/app/admin/untils/FuzzySearch"
import {createDetailsColumns} from "@/app/admin/view/waterRight/organization/data"
import {FindAllWaterLicense} from "@/app/admin/api/WaterLicense"
import {FindWaterAssociationLicense, SaveLicense} from "@/app/admin/api/WaterAssociationLicense"
import {useMessage} from "naive-ui"

const checkedRowKeys = ref([])
const message = useMessage()
const tableRef = ref(null)
const tableSetting = {
    showTableSizeSetting: true,//是否显示表格大小设置
    showTableColumnsSetting: true,//是否显示表格列表设置
    bordered: false,//是否显示 border
    cascade: false,//在进行树型数据选择的时候是否级联
    bottomBordered: false,//是否显示 bottom border
    defaultExpandAll: false,//是否默认展开全部可展开的行，不可在异步展开行时使用
    flexHeight: false,//是否让表格主体的高度自动适应整个表格区域的高度，打开这个选项会让 table-layout 始终为 'fixed'
    paginateSinglePage: true,//当表格数据只有一页时是否显示分页面
    singleColumn: false,//是否不设定行的分割线，当参数为true时，则单元格没有下边线
    singleLine: false,//是否不设定列的分割线，当参数值为 true 时，则单元格没有右边线
    striped: true,//是否使用斑马线条纹
    summaryPlacement: 'bottom',//总结栏的位置 ('top' | 'bottom')
    tableSizeValue: 'small',//表格默认大小
    //表格样式
    style: {
        paddingBottom: '16px',
    },
    //表格大小
    tableSize: [
        {
            label: "较小",
            value: "small",
        },
        {
            label: "适中",
            value: "medium",
        },
        {
            label: "较大",
            value: "large",
        }
    ],
    //表格分页配置
    paginationReactive: reactive({
        disabled: false, //是否禁用
        size: 'medium', //分页大小 （'small' | 'medium' | 'large'）
        page: 1, //受控模式下的当前页
        pageSize: 20, //受控模式下的分页大小
        showSizePicker: true, //是否显示每页条数的选择器
        showQuickJumper: true, //是否显示快速跳转
        pageSizes: [10, 20, 50, 100],
        //页数改变
        onChange: (page) => {
            tableSetting.paginationReactive.page = page
        },
        //分页大小改变
        onUpdatePageSize: (pageSize) => {
            tableSetting.paginationReactive.pageSize = pageSize
            tableSetting.paginationReactive.page = 1
        },
        //分页前缀
        prefix ({ itemCount }) {
            return `共计 ${itemCount} 条数据`
        },
        //分页后缀
        suffix ({ itemCount }) {
            return `从第 ${ Math.ceil(itemCount / tableSetting.paginationReactive.pageSize) } 页结束`
        }
    }),
}
const compData = reactive({
    showAddModal: false,
    data: {},
    allData: [],
    tableData: [],
    tableSizeValue: tableSetting.tableSizeValue,
    tableSize: tableSetting.tableSize,
    loading: true,
    columns: [],
    sourceColumns: [],
    columnsOptions: [],
    columnsOptionsValue: [],
    searchForm: {
        keyWord: '',
    },
    rowKey: (row: any) => row.ID,
})
const compHandle = reactive({
    operation: {},
    getTableData() {
        compData.searchForm.keyWord = ''
        compData.loading = true
        FindAllWaterLicense().then((res) => {
            let data = res.data
            compData.tableData = data || []
            compData.allData = data || []
        }).finally(() => {
            compData.loading = false
        })
    },
    check(rowKeys: any) {
        checkedRowKeys.value = rowKeys
    },
    search() {
        let props = ['Code']
        compData.tableData  = Search(compData.searchForm.keyWord, props, deepCopy(compData.allData))
    },
})

const openModal = (itemData?: object ) => {
    compData.showAddModal = true
    compData.data = deepCopy(itemData)
    FindWaterAssociationLicenseData()
}

const initTable = () => {
    compData.sourceColumns = createDetailsColumns({compHandle})
    compData.columns = compData.sourceColumns
    compData.columnsOptionsValue = compData.sourceColumns.map((item) => item.key)
    compData.columnsOptions = compData.sourceColumns.filter((item) => item.type !== "selection").map((item) => {
        if (item.key === "actions") {
            item.disabled = true
        }
        return item
    })
}

const emit = defineEmits(['refreshTable'])
const drawerConfirm = () => {
    let Licneses = checkedRowKeys.value.join(',')
    let params = {
        AssociationID: compData.data.ID,
        Licneses
    }
    SaveLicense(params).then(res => {
        if (res.data.Code === 0) {
            message.warning("新增失败，请重试")
        } else {
            message.success("新增成功")
            compData.showAddModal = false
            emit('refreshTable')
        }
    })
}

const FindWaterAssociationLicenseData = () => {
    compData.loading = true
    FindWaterAssociationLicense('and AssociationID='+ compData.data.ID).then( res => {
        let arr = []
        if (res.data && res.data.length > 0) {
            for (let item of res.data) {
                arr.push(item.PermitID)
            }
        }
        checkedRowKeys.value = arr
    }).finally(() => {
        compData.loading = false
    })
}

defineExpose({
    openModal
})

onMounted( () => {
    initTable()
    compHandle.getTableData()
})
</script>

<style scoped>

</style>
