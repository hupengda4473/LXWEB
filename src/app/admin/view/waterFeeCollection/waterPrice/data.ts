import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "年份",
            key: "Year",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },

        {
            title: "灌溉定额(m³/亩)",
            key: "IrrigationQuota",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "标准水价(元/m³)",
            key: "StandardWaterPrice",
            align: "center",
            sorter: 'default',
        },
        {
            title: "补贴标准(元/m³)",
            key: "SubsidizedWaterPrice",
            align: "center",
            sorter: 'default',
        },
        {
            title: "节水奖励(元/亩)",
            key: "WaterSavingReward",
            align: "center",
            sorter: 'default',
        },
        {
            title: "详情",
            key: "Remark",
            align: "center",
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
