import {DataTableColumns, NButton, NPopconfirm, NPopover, NTag} from "naive-ui"
import {h} from "vue"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "参数名称",
            key: "ParamName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "参数符号",
            key: "ParamSymbol",
            align: "center",
            sorter: 'default',
        },
        {
            title: "参数单位",
            key: "ParamUnit",
            align: "center",
            sorter: 'default',
        },
        {
            title: "最低阈值",
            key: "LowerLimit",
            align: "center",
            sorter: 'default',
        },
        {
            title: "最高阈值",
            key: "UpperLimit",
            align: "center",
            sorter: 'default',
        },
        {
            title: "描述",
            key: "Description",
            align: "center",
            sorter: 'default',
            width: 200,
            render(row : any){
                return h(NPopover,{
                        trigger: 'click',
                        contentStyle: {
                            maxWidth: '300px',
                            fontSize: '16px',
                            lineHeight: '24px'
                        }
                    },{
                    default:()=>{
                        return row.Description
                    },
                    trigger:()=>{
                        return h(NTag,{
                            type: "info",
                            round: true,
                            bordered: false,
                        },{
                            default: () => '查看描述',
                        })
                    }
                }
                )
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
