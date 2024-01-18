import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "人员名称",
            key: "PersonName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "管理机构",
            key: "GroupName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr,
            filter (value, row) {
                return row.GroupID == value
            },
        },
        {
            title: "职务",
            key: "Position",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row){
                return row.Position || '-'
            },
            defaultFilterOptionValues: [],
            filterOptions: compHandle.Position,
            filter (value, row) {
                return row.Position == value
            },
        },
        {
            title: "电话",
            key: "Tel",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "添加时间",
            key: "DT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        compHandle.operation.isUpdate || compHandle.operation.isDelete ?
        {
            title: "操作",
            key: "actions",
            align: "center",
            width: 220,
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
