import {DataTableColumns, NButton, NPopconfirm, NImage} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "取水证编码",
            key: "Code",
            align: "center",
            defaultSortOrder: 'descend',
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
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.FetchWaterType == value
            },
        },
        {
            title: "取水量（万m³）",
            key: "FetchWaterQuantity",
            align: "center",
            sorter: 'default',
            render(row: any) {
                return (row.FetchWaterQuantity * 1).toFixed(2)
            }
        },
        {
            title: "起始时间",
            key: "BeginDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row: any) {
                return new Date(row.BeginDT).format('yyyy-MM-dd')
            }
        },
        {
            title: "结束时间",
            key: "EndDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row: any) {
                return new Date(row.EndDT).format('yyyy-MM-dd')
            }
        },
        {
            title: "发证日期",
            key: "ApprovalDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row: any) {
                return new Date(row.ApprovalDT).format('yyyy-MM-dd')
            }
        },
        {
            title: "取水证",
            key: "ApprovalDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row) {
                // return h("div", [
                //     h(NButton,
                //         {
                //             type: "info",
                //             size: "small",
                //             quaternary : true,
                //             onClick: () => compHandle.introduction(row),
                //         },
                //         {default: () => "查看取水证"}
                //     )
                // ])
                return h("div", [
                    h(NImage,
                        {
                            height: "20",
                            alt: '点击预览',
                            lazy: true,
                            src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
                        },
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
    createColumns
}
