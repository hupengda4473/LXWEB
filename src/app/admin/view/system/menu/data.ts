import {DataTableColumns, NButton, NPopconfirm, NSwitch, NIcon} from "naive-ui"
import {h} from "vue"
import { getPower } from '@/app/admin/untils/untils.ts'
import {renderIcon} from '@/packages/config/icon.ts'

const createColumns = ({compHandle}): DataTableColumns => {
    const arr =  [
        {
            type: "selection",
        },
        {
            title: "菜单名称",
            key: "title",
            align: "center",
            ellipsis: true,
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "路由",
            key: "path",
            align: "center",
            ellipsis: true,
        },
        {
            title: "路径",
            key: "file",
            align: "center",
            ellipsis: true,
        },
        {
            title: "操作权限",
            key: "operation",
            align: "center",
            ellipsis: true,
            filterMode: 'and',
            defaultFilterOptionValues: [],
            filterOptions: [
                {
                    label: '查询',
                    value: '查询'
                },
                {
                    label: '新增',
                    value: '新增'
                },
                {
                    label: '修改',
                    value: '修改'
                },
                {
                    label: '删除',
                    value: '删除'
                },
                {
                    label: '导入',
                    value: '导入'
                },
                {
                    label: '导出',
                    value: '导出'
                },
                {
                    label: '审核',
                    value: '审核'
                },
            ],
            filter (value, row) {
                return !!~getPower(row.operation).join(',').indexOf(String(value))
            },
            sorter (rowA, rowB) {
                return getPower(rowA.operation).length - getPower(rowB.operation).length
            },
            render(row: any){
                return getPower(row.operation).join(',')
            }
        },
        {
            title: "图标",
            key: "icon",
            align: "center",
            ellipsis: true,
            render(row: any) {
                return h(renderIcon(row.icon, 22))
            }
        },
        compHandle.operation.isUpdate ?
        {
            title: "是否显示",
            key: "shows",
            align: "center",
            ellipsis: true,
            defaultFilterOptionValues: [],
            filterOptions: [
                {
                    label: '显示',
                    value: 1
                },
                {
                    label: '隐藏',
                    value: 2
                },
            ],
            filter (value, row) {
                let status = (value === 1 ? true : false)
                return row.shows === status
            },
            sorter (rowA) {
                return rowA.shows
            },
            render(row: any) {
                return h(NSwitch, {
                    defaultValue: row.shows,
                    onUpdateValue: (state) => compHandle.showsSwitch(row, state)
                })
            }
        } : false,
        compHandle.operation.isUpdate || compHandle.operation.isDelete ?
        {
            title: "操作",
            key: "actions",
            align: "center",
            render(row) {
                return h("div", [
                    compHandle.operation.isUpdate ?
                    h(NButton,
                        {
                            type: "success",
                            size: "small",
                            ghost: true,
                            onClick: () => compHandle.edit(row),
                            style: {marginRight: "5px"}
                        },
                        {default: () => "编辑"}
                    ) : '',
                    compHandle.operation.isDelete ?
                    h(NPopconfirm,
                        {
                            onPositiveClick: () => {
                                compHandle.del(row)
                            },
                            negativeText: "取消",
                            positiveText: "确定"
                        },
                        {
                            trigger: () => {
                                return h(
                                    NButton,
                                    {
                                        type: "error",
                                        strong: true,
                                        size: "small",
                                        ghost: true,
                                    },
                                    {default: () => "删除"}
                                )
                            },
                            default: () => {
                                return "确认删除该条数据嘛？"
                            }
                        }
                    ) : '',
                ])
            }
        } : false
    ]
    return arr.filter( item => item !== false)
}


const emailOptions = ["@gmail.com", "@163.com", "@qq.com"]

const tagOptions = [
    {label: "管理员", value: "admin"},
    {label: "测试人员", value: "test"},
    {label: "普通用户", value: "web"},
    {label: "vip用户", value: "vip"},
]

export {
    createColumns,
    emailOptions,
    tagOptions
}
