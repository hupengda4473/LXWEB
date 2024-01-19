import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "灌区名称",
            key: "DistrictName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "行政区域",
            key: "AreaName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.areaNameArr.length > 0 ? compHandle.areaNameArr : null,
            filter (value, row) {
                return row.AreaName == value
            },
        },
        {
            title: "负责人",
            key: "Principals",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.Principals == value
            },
        },
        {
            title: "联系方式",
            key: "Telephone",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row) {
                return row.Telephone ? row.Telephone.slice(0,3) + '********' : '-'
            }
        },
        {
            title: "简介",
            key: "Introduction",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row) {
                return h("div", [
                        h(NButton,
                            {
                                type: "info",
                                size: "small",
                                quaternary : true,
                                onClick: () => compHandle.introduction(row),
                            },
                            {default: () => "查看简介"}
                        )
                ])
            }
        },
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


export {
    createColumns,
}
