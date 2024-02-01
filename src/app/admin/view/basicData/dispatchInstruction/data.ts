import {DataTableColumns, NButton, NImage, NPopconfirm, NPopover, NTag} from "naive-ui"
import {h} from "vue"
import {finishStatusType, instructType} from "@/app/admin/config/config"
import {isImage} from "@/app/admin/untils/untils"

const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "标题",
            key: "Title",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "指令类型",
            key: "InstType",
            align: "center",
            sorter: 'default',
            render(row: any){
                return instructType.find(item => item.value === row.InstType).label
            }
        },
        {
            title: "指令详情",
            key: "InstContent",
            align: "center",
            sorter: 'default',
            width: 200,
            render(row : any){
                if (row.InstContent){
                    return h(NPopover,{
                            trigger: 'click',
                            contentStyle: {
                                maxWidth: '300px',
                                fontSize: '16px',
                                lineHeight: '24px'
                            }
                        },{
                            default:()=>{
                                return row.InstContent
                            },
                            trigger:()=>{
                                return h(NTag,{
                                    type: "info",
                                    round: true,
                                    bordered: false,
                                },{
                                    default: () => '查看详情',
                                })
                            }
                        }
                    )
                }else {
                    return '-'
                }
            }
        },
        {
            title: "创建人",
            key: "UserId",
            align: "center",
            sorter: 'default',
            render(row: any) {
                return compHandle.userList.find(item => item.UserID === row.UserId).UserName
            }
        },
        {
            title: "派发时间",
            key: "DispTime",
            align: "center",
            sorter: 'default',
        },
        {
            title: "执行人",
            key: "ExecutorId",
            align: "center",
            sorter: 'default',
            render(row: any) {
                return compHandle.userList.find(item => item.UserID === row.ExecutorId).UserName
            }
        },
        {
            title: "签收状态",
            key: "SignTime",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.SignTime ? '已签收': '未签收'
            }
        },
        {
            title: "签收时间",
            key: "SignTime",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.SignTime || '-'
            }
        },
        {
            title: "完成情况",
            key: "FinishStatus",
            align: "center",
            sorter: 'default',
            render(row: any) {
                return finishStatusType.find(item => item.value == row.FinishStatus).label
            }
        },
        {
            title: "完成时间",
            key: "FinishTime",
            align: "center",
            sorter: 'default',
            render(row: any){
                return  row.FinishStatus && row.FinishTime ? row.FinishTime || '-' : '-'
            }
        },
        {
            title: "完成相关文件",
            key: "UploadFiles",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.UploadFiles.map((tagKey) => {
                    if (isImage(tagKey.type)) {
                        return h(NImage,
                            {
                                height: "20",
                                alt: '点击预览',
                                lazy: true,
                                src: tagKey.url,
                                style: {margin: "0 10px"}
                            },
                        )
                    } else {
                        return h("div",
                            {
                                onClick: () => compHandle.filePreview(tagKey),
                                style: {margin: "0 10px", color: '#2080f0', textDecoration: 'underline'}
                            },
                            {default: () => tagKey.name}
                        )
                    }
                })
            }
        },
        {
            title: "完成说明",
            key: "FinishDetail",
            align: "center",
            sorter: 'default',
            width: 200,
            render(row : any){
                if (row.FinishDetail){
                    return h(NPopover,{
                            trigger: 'click',
                            contentStyle: {
                                maxWidth: '300px',
                                fontSize: '16px',
                                lineHeight: '24px'
                            }
                        },{
                            default:()=>{
                                return row.FinishDetail
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
                }else {
                    return  '-'
                }
            }
        },
        compHandle.operation.isUpdate || compHandle.operation.isDelete ?
            {
                title: "操作",
                key: "actions",
                align: "center",
                render(row) {
                    return h("div", [
                        compHandle.operation.isUpdate && row.ExecutorId == compHandle.UserID && !row.SignTime ?
                            h(NPopconfirm,
                                {
                                    onPositiveClick: () => {
                                        compHandle.distribute(row)
                                    },
                                    negativeText: "取消",
                                    positiveText: "确定"
                                },
                                {
                                    trigger: () => {
                                        return h(
                                            NButton,
                                            {
                                                type: "info",
                                                strong: true,
                                                size: "small",
                                                ghost: true,
                                            },
                                            {default: () => "签收"}
                                        )
                                    },
                                    default: () => {
                                        return "确认签收该指令吗？"
                                    }
                                }
                            ) : '',
                        compHandle.operation.isUpdate && row.ExecutorId == compHandle.UserID && row.SignTime ?
                            h(NButton,
                                {
                                    type: "info",
                                    size: "small",
                                    ghost: true,
                                    onClick: () => compHandle.finish(row),
                                    style: {margin: "5px"}
                                },
                                {default: () => "完成"}
                            ) : '',
                        compHandle.operation.isUpdate && row.UserId == compHandle.UserID && !row.SignTime ?
                            h(NButton,
                                {
                                    type: "success",
                                    size: "small",
                                    ghost: true,
                                    onClick: () => compHandle.edit(row),
                                    style: {margin: "5px"}
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
