import {h} from "vue"
import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            type: "selection",
        },
        {
            title: "作物名称",
            key: "CropName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "作物类型",
            key: "CropType",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row: any){
                return row.CropType === 0 ? '高耗水作物' : '低耗水作物'
            },
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.CropType == value
            },
        },
        {
            title: "浇灌起始时间",
            key: "BeginDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "浇灌结束时间",
            key: "EndDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "需水定额(m³/亩)",
            key: "WaterQuota",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row: any){
                return (row.WaterQuota*1).toFixed(2)
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
}


export {
    createColumns,
}
