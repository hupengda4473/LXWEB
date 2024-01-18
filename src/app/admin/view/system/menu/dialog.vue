<template>
    <n-drawer v-model:show="drawerActivate" :width="502">
        <n-drawer-content closable>
            <template #header>
                {{ drawerData.type === 'add' ? '新增菜单' : '修改菜单' }}
            </template>
            <n-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
                :size="formSize"
            >
                <n-form-item label="菜单名称" path="title">
                    <n-input v-model:value="formData.title" placeholder="请输入菜单名称"/>
                </n-form-item>
                <n-form-item label="父级菜单">
                    <n-cascader
                        v-model:value="formData.pid"
                        :options="drawerData.allData"
                        :size="formSize"
                        :show-path="true"
                        :clearable="true"
                        placeholder="请选择父级菜单"
                        check-strategy="all"
                        expand-trigger="hover"
                        label-field="title"
                        value-field="id"
                        children-field="children"
                    />
                    <!--                    <n-tree-select-->
                    <!--                        :options="drawerData.allData"-->
                    <!--                        :default-value="formData.pid"-->
                    <!--                        @update:value="handleUpdateValue"-->
                    <!--                        :size="formSize"-->
                    <!--                        check-strategy="child"-->
                    <!--                        placeholder="请选择父级菜单"-->
                    <!--                        label-field="title"-->
                    <!--                        value-field="id"-->
                    <!--                        children-field="children"-->
                    <!--                    />-->
                </n-form-item>
                <n-form-item label="菜单路由" path="path">
                    <n-input v-model:value="formData.path" placeholder="请输入菜单路由"/>
                </n-form-item>
                <n-form-item label="菜单路径" path="file">
                    <n-input v-model:value="formData.file" placeholder="请输入菜单路径"/>
                </n-form-item>
                <n-form-item label="图标">
                    <n-input-group>
                        <component
                            class="ico"
                            v-if="formData.icon"
                            :is="renderIcon(formData.icon)"
                        >
                        </component>
                        <n-input v-model:value="formData.icon" placeholder="请选择图标"/>
                        <n-popover
                            scrollable
                            trigger="click"
                            placement="bottom"
                            style="width: 300px;"
                        >
                            <template #trigger>
                                <n-button type="primary" ghost>选择图标</n-button>
                            </template>
                            <n-tabs :default-value="getTabsDefaultValue()" justify-content="space-evenly" type="line">
                                <n-tab-pane name="ionicons5" tab="ionicons5">
                                    <n-icon
                                        v-for="(item, index) in icons "
                                        size="24"
                                        :key="index"
                                        :component="item"
                                        :color="item.name === formData.icon ? '#0e7a0d': ''"
                                        style="border: 1px solid #dcdfe6;margin: 0 6px"
                                        @click="selectIco(item)"
                                    >
                                    </n-icon>
                                </n-tab-pane>
                                <n-tab-pane name="ali" tab="ali" class="aliTab">
                                    <component
                                        v-for="(item, index) in drawerData.aliIco "
                                        size="24"
                                        :key="index"
                                        class="aliIco"
                                        :class="item === formData.icon ? 'active': ''"
                                        :is="renderIcon(item)"
                                        @click="selectAliIco(item)"
                                    >
                                    </component>
                                </n-tab-pane>
                            </n-tabs>
                        </n-popover>

                    </n-input-group>
                </n-form-item>
                <n-form-item label="是否显示">
                    <n-switch :round="false" v-model:value="formData.shows">
                        <template #checked>是</template>
                        <template #unchecked>否</template>
                    </n-switch>
                </n-form-item>
                <n-divider/>
                <n-form-item label="查询权限">
                    <n-switch :round="false" v-model:value="formData.operation.isSelect">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
                <n-form-item label="新增权限">
                    <n-switch :round="false" v-model:value="formData.operation.isAdd">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
                <n-form-item label="修改权限">
                    <n-switch :round="false" v-model:value="formData.operation.isUpdate">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
                <n-form-item label="删除权限">
                    <n-switch :round="false" v-model:value="formData.operation.isDelete">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
                <n-form-item label="导入权限">
                    <n-switch :round="false" v-model:value="formData.operation.isImport">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
                <n-form-item label="导出权限">
                    <n-switch :round="false" v-model:value="formData.operation.isExport">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
                <n-form-item label="审核权限">
                    <n-switch :round="false" v-model:value="formData.operation.isCheck">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button @click="drawerActivate = false">取消</n-button>
                    <n-button type="primary" @click="drawerConfirm">确认</n-button>
                </n-space>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import {defineExpose, onMounted, reactive, ref} from "vue"
import {formSize} from '@/app/admin/config/config'
import {FormInst, useMessage} from 'naive-ui'
import {addMenus, editMenus} from "@/app/admin/api/menu.ts"
import {icons, renderIcon} from '@/packages/config/icon.ts'
import {deepCopy, getAlicdnIconfont} from '@/packages/utils/utils.ts'

const drawerActivate = ref(false)
type Song = {
    type: string
    allData: (object | string)[],
    aliIco: (string | number) [],
    data: object
}
const drawerData = reactive<Song>({
    type: 'add',
    allData: [],
    aliIco: [],
    data: {},
})
let formData = reactive<object>({})
const rules = {
    title: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入菜单名称'
    },
}
const formRef = ref<FormInst | null>(null)
const message = useMessage()

//打开抽屉
const openDrawer = ({type = 'add',allData = [],itemData = {}}: { type: string; allData?: Array<any>; itemData?: object }) => {
    initData()
    drawerActivate.value = true
    drawerData.type = type
    drawerData.allData = allData
    if (type === 'edit') {
        let data = reactive(deepCopy(itemData))
        formData = data
        drawerData.data = data
        formData.pid = data.pid || null
    }
}

//确认
const drawerConfirm = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            if (drawerData.type === 'add') {
                addMenus(formData).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("新增失败，请重试")
                    } else {
                        message.success("新增成功")
                        drawerActivate.value = false
                        location.reload()
                    }
                })
            } else {
                editMenus(formData).then(res => {
                    if (res.data.Code === 0) {
                        message.warning("修改失败，请重试")
                    } else {
                        message.success("修改成功")
                        drawerActivate.value = false
                        location.reload()
                    }
                })
            }
        }
    })
}

//初始化数据
const initData = () => {
    formData = reactive({
        id: '',
        title: '',
        pid: null,
        path: '',
        file: '',
        icon: '',
        url: '',
        order: 0,
        httpFile: '',
        isIframe: '',
        permission: [],
        shows: true,
        keepAlive: false,
        tabHidden: false,
        tabFix: false,
        operation: {
            isSelect: true,//查询
            isAdd: true,//新增
            isUpdate: true,//修改
            isDelete: true,//删除
            isImport: true,//导入
            isExport: true,//导出
            isCheck: true,//审核
        },
    })
}

//选择图标
const selectIco = (item: object) => {
    formData.icon = item.name
}

//选择阿里巴巴矢量库图标
const selectAliIco = (item: string) => {
    formData.icon = item
}

//获取阿里巴巴矢量库图标
const getAliIco = () => {
    getAlicdnIconfont().then((res: any) => {
        drawerData.aliIco = res
    })
}

//判断初始化展示tab
const getTabsDefaultValue = () => {
    return drawerData.aliIco.includes(formData.icon) ? 'ali' : 'ionicons5'
}

defineExpose({
    openDrawer,
})

onMounted(async () => {
    await getAliIco()
})
</script>

<style scoped lang="less">
.ico {
    height: 34px;
    width: 60px;
    background-color: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 0;
    border-radius: 4px 0 0 4px;
}
.aliTab{
    display: flex;
    flex-wrap: wrap;
}
.aliIco {
    border: 1px solid #dcdfe6;
    margin: 0 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    &.active{
        color: #0e7a0d;
    }
}
</style>
