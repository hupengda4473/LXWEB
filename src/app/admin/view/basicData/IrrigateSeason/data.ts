import {h} from "vue";
import {DataTableColumns, NButton, NPopconfirm} from "naive-ui";

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            type: "selection",
        },
        {
            title: "灌季名称",
            key: "SeasonName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "轮次",
            key: "Round",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "灌溉起始时间",
            key: "BeginDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "灌溉结束时间",
            key: "EndDT",
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
}


export {
    createColumns,
}
