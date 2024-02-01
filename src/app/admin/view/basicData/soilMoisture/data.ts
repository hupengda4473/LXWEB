import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "测点名称",
            key: "LocationName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "采集时间",
            key: "CollectTime",
            align: "center",
            sorter: 'default',
        },
        {
            title: "水温(℃)",
            key: "Temperature",
            align: "center",
            sorter: 'default',
        },
        {
            title: "PH",
            key: "PH",
            align: "center",
            sorter: 'default',
        },
        {
            title: "电导率(S/m)",
            key: "ElectricalConductivity",
            align: "center",
            sorter: 'default',
        },
        {
            title: "湿度(%)",
            key: "Moisture",
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
