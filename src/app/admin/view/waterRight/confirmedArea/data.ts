import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "组织名称",
            key: "AssociationName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "年度",
            key: "DT",
            align: "center",
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.DT == value
            },
        },
        {
            title: "平均毛定额（m³/亩）",
            key: "Indicator",
            align: "center",
            sorter: 'default',
        },
        {
            title: "确权面积(亩)",
            key: "PlantArea",
            align: "center",
            sorter: 'default',
        },
        {
            title: "确权水量（m³）",
            key: "PlantArea",
            align: "center",
            sorter: 'default',
            render(row: any) {
                return (row.Indicator * row.PlantArea).toFixed(2)
            }
        },
        {
            title: "备注",
            key: "Remark",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
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
    createColumns
}
