import {DataTableColumns, NButton, NImage, NPopconfirm, NPopover, NTag} from "naive-ui"
import {h} from "vue"
import {floodControlMeasuresType} from "@/app/admin/config/config"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "措施名称",
            key: "Title",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "措施类型",
            key: "InfoType",
            align: "center",
            sorter: 'default',
            render(row: any){
                return floodControlMeasuresType.find(item => item.value === row.InfoType).label
            }
        },
        {
            title: "创建时间",
            key: "CreateTime",
            align: "center",
            sorter: 'default',
        },
        {
            title: "文件",
            key: "UploadFiles",
            align: "center",
            sorter: 'default',
            render(row: any){
                const tags = row.UploadFiles.map((tagKey) => {
                    if (tagKey.type.includes('image')){
                        return h(NImage,
                            {
                                height: "20",
                                alt: '点击预览',
                                lazy: true,
                                src: tagKey.url
                            },
                        )
                    }else {
                        return h("div",
                            {
                                onClick: () => compHandle.filePreview(tagKey),
                                style: {margin: "0 10px", color: '#2080f0', textDecoration: 'underline'}
                            },
                            {default: () => tagKey.name}
                        )
                    }
                })
                return tags
            }
        },
        {
            title: "描述",
            key: "Detail",
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
                        return row.Detail
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
