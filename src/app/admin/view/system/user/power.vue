<template>
    <n-modal :loading="compData.loading" v-model:show="compData.showAddModal">
        <n-card
            style="width: auto;"
            header-style="text-align: center;"
            title="分配权限"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-data-table
                size="small"
                :columns="compData.columns"
                :data="compData.treeMenu"
                :row-key="compData.rowKey"
                default-expand-all
            />
            <template #footer>
                <n-flex justify="end">
                    <n-space>
                        <n-button @click="compData.showAddModal = false">取消</n-button>
                        <n-button :loading="compData.loading" type="success" @click="drawerConfirm">保存</n-button>
                    </n-space>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, reactive} from "vue"
import {getAllMenus} from "@/app/admin/api/menu"
import {savePower} from "@/app/admin/api/user"
import { createPowerColumns } from './data.ts'
import {deepCopy, tableSearch, toTree} from "@/packages/utils/utils"
import {useMessage} from "naive-ui"

const message = useMessage()
type SearchForm = {
    title: string
}
type ModalData = {
    loading: boolean,
    showAddModal: boolean,
    allMenu: object[],
    treeMenu: object[],
    powerData: [],
    UserID: number | string,
    columns: object[],
    searchForm: SearchForm,
    search: any,
    showMenu: object[],
    selectList: object[],
    rowKey: any,
}
const compData = reactive<ModalData>({
    loading: false,
    showAddModal: false,
    allMenu: [],
    treeMenu: [],
    powerData: [],
    UserID: 0,
    columns: [],
    searchForm: {
        title: '',
    },
    showMenu: [],
    search(){
        compData.selectList = []
        let keyword = [compData.searchForm.title]
        let searchItem = ['title']
        let searchData = tableSearch(keyword, searchItem, deepCopy(compData.allMenu))
        compData.treeMenu = toTree({arr: searchData || []})
        compData.showMenu = searchData
    },
    selectList: [],
    rowKey: (row: any) => row.id,
})

const compHandle = reactive({
    powerItemChecked( row: object, type: string, status: boolean ){
        if (!row.operation[type]) return false
        compData.selectList = []
        if (compData.powerData.find(i => i.MenuID === row.id)) {
            compData.powerData.find(i => i.MenuID === row.id).Permit[type] = status
        } else {
            let obj = {
                Permit: {
                    isSelect: false,
                    isAdd: false,
                    isUpdate: false,
                    isDelete: false,
                    isImport: false,
                    isExport: false,
                    isCheck: false
                },
                UserID: compData.UserID,
                MenuID: row.id,
                Complete: 0,
                Operation: 0
            }
            obj.Permit[type] = status
            compData.powerData.push( obj )
        }
        compData.showMenu.find(item => row.id === item.id).Permit[type] = status
        compData.treeMenu =  toTree({arr: compData.showMenu})
    },
    powerItemCheckedAll(type: string, status: boolean) {
        compData.selectList = []
        if (compData.showMenu && compData.showMenu.length > 0) {
            for (let item of compData.showMenu) {
                if (item.operation[type]){
                    item.Permit[type] = status
                    if (compData.powerData.find(i => i.MenuID === item.id)) {
                        compData.powerData.find(i => i.MenuID === item.id).Permit[type] = status
                    } else {
                        let obj = {
                            Permit: {
                                isSelect: false,
                                isAdd: false,
                                isUpdate: false,
                                isDelete: false,
                                isImport: false,
                                isExport: false,
                                isCheck: false
                            },
                            UserID: compData.UserID,
                            MenuID: item.id,
                            Complete: 0,
                            Operation: 0
                        }
                        obj.Permit[type] = status
                        compData.powerData.push(obj)
                    }
                }
            }
            compData.treeMenu =  toTree({arr: compData.showMenu})
        }
    },
    allChecked(type: string){
        let judge = true
        if (compData.selectList && compData.selectList.length > 0) {
            for (let item of compData.selectList) {
                if (!item.Permit[type]) judge = false
            }
        }
        return judge
    },
    findList(row: object){
        compData.selectList.push(row)
    }
})

const drawerOpen = ( res: [] ,id: string | number) => {
    compData.powerData = res
    compData.UserID = id
    getAllMenu()
}

//获取所有菜单
const getAllMenu = () => {
    compData.loading = true
    getAllMenus().then((res) => {
        compData.selectList = []
        let data = res.data
        if (data && data.length > 0) {
            for (let item of data) {
                item.Permit = {
                    isSelect: false,
                    isAdd: false,
                    isUpdate: false,
                    isDelete: false,
                    isImport: false,
                    isExport: false,
                    isCheck: false
                }
                if (compData.powerData.length > 0 && compData.powerData.find( i => i.MenuID === item.id)){
                    item.Permit = compData.powerData.find( i => i.MenuID === item.id).Permit
                }
            }
            compData.allMenu = deepCopy(data)
            compData.showMenu = deepCopy(data)
            compData.treeMenu =  toTree({arr: deepCopy(data)})
            compData.columns = createPowerColumns({compHandle})
        }
        compData.showAddModal = true
        compData.loading = false
    })
}

//确认
const emit = defineEmits(['refreshTable'])
const drawerConfirm = () => {
    compData.loading = true
    savePower(compData.powerData).then( res => {
        if (res.data.Code === 0) {
            message.warning("删除失败，请重试")
        } else {
            message.success("删除成功")
            compData.loading = false
            compData.showAddModal = false
            emit('refreshTable')
        }
    })
}

defineExpose({
    drawerOpen,
})
</script>
