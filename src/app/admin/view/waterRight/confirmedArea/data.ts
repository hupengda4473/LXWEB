import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "用水组织名称",
            key: "AssociationName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "负责人",
            key: "Manager",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.Manager == value
            },
        },
        {
            title: "联系方式",
            key: "Tel",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "备注",
            key: "Remark",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "取水证",
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
                            {default: () => "查看取水证"}
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
                                type: "info",
                                size: "small",
                                ghost: true,
                                onClick: () => compHandle.association(row),
                                style: {marginRight: "5px"}
                            },
                            {default: () => "关联取水证"}
                        ) : '',
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

const createDetailsColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            type: "selection",
        },
        {
            title: "许可证",
            key: "Code",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
    ]
}

const createViewColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "取水证编码",
            key: "Code",
            align: "center",
            sorter: 'default',
        },
        {
            title: "取水权人名称",
            key: "HolderName",
            align: "center",
            sorter: 'default',
        },
        {
            title: "取水地点",
            key: "FetchWaterAddress",
            align: "center",
            sorter: 'default',
        },
        {
            title: "取水方式",
            key: "FetchWaterType",
            align: "center",
            sorter: 'default',
        },
        {
            title: "取水量",
            key: "FetchWaterQuantity",
            align: "center",
            sorter: 'default',
        },
        {
            title: "查看取水证",
            key: "Code",
            align: "center",
            render(row) {
                return h("div", [
                    h(NButton,
                        {
                            type: "info",
                            size: "small",
                            quaternary : true,
                            onClick: () => compHandle.showImage(row),
                        },
                        {default: () => "查看"}
                    )
                ])
            }
        },
    ]
}


export {
    createColumns,
    createDetailsColumns,
    createViewColumns,
}
