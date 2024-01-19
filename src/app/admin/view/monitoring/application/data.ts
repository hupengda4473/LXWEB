import {DataTableColumns} from "naive-ui"
import {getFormatTime} from "@/app/admin/untils/untils"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "模块名称",
            key: "ModuleName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "用户名称",
            key: "UserName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.UserName == value
            },
        },
        {
            title: "访问开始时间",
            key: "BeginDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "访问结束时间",
            key: "EndDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "访问时长",
            key: "EndDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row){
                return getFormatTime( (new Date(row.EndDT) - new Date(row.BeginDT)) / 1000)
            }
        },
    ]
}


export {
    createColumns,
}
