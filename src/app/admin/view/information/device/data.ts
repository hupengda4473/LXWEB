import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {deviceType} from '@/app/admin/config/config'
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "设备编码",
            key: "DeviceCode",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "设别名称",
            key: "DeviceName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "所在分组",
            key: "GroupName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.GroupID == value
            },
        },
        {
            title: "设备类型",
            key: "LocationType",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row){
                if (row.Type && row.Type !== '0') return deviceType.find( item => item.value == row.Type).label
                return '-'
            },
            defaultFilterOptionValues: [],
            filterOptions: compHandle.LocationType,
            filter (value, row) {
                return row.Type == value
            },
        },
        compHandle.operation.isUpdate || compHandle.operation.isDelete || compHandle.operation.isSelect ?
        {
            title: "操作",
            key: "actions",
            align: "center",
            width: 220,
            render(row) {
                return h("div", [
                    compHandle.operation.isSelect ?
                        h(NButton,
                            {
                                type: "info",
                                size: "small",
                                ghost: true,
                                onClick: () => compHandle.details(row),
                                style: {marginRight: "5px"}
                            },
                            {default: () => "详情"}
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


export {
    createColumns,
}
