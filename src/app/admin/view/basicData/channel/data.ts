import {DataTableColumns, NButton, NPopconfirm} from "naive-ui"
import {h} from "vue"
import {channelType} from '@/app/admin/config/config'

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "渠道名称",
            key: "ChannelName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "渠道编号",
            key: "ChannelNo",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "管理单位",
            key: "DepartName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.manage.length > 0 ? compHandle.manage : null,
            filter (value, row) {
                return row.DepartName == value
            },
        },
        {
            title: "上级渠道",
            key: "PidChannelName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row) {
                return row.PidChannelName ? row.PidChannelName : '无上级'
            },
            defaultFilterOptionValues: [],
            filterOptions: compHandle.PidChannelName.length > 0 ? compHandle.PidChannelName : null,
            filter (value, row) {
                return row.Pid == value
            },
        },
        {
            title: "渠道类型",
            key: "ChannelType",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row) {
                return channelType.find(item => item.value === row.ChannelType).label
            },
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.ChannelType == value
            },
        },
        compHandle.operation.isUpdate || compHandle.operation.isDelete ?
        {
            title: "操作",
            key: "actions",
            align: "center",
            render(row) {
                return h("div", [
                        h(NButton,
                            {
                                type: "info",
                                size: "small",
                                ghost: true,
                                onClick: () => compHandle.details(row),
                                style: {marginRight: "5px"}
                            },
                            {default: () => "详情"}
                        ),
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
