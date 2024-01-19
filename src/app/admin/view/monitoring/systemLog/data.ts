import {DataTableColumns} from "naive-ui"

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
            title: "启动时间",
            key: "StartTime",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "停止时间",
            key: "StopTime",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "运行状态",
            key: "RunningState",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.RunningState == value
            },
        },
        {
            title: "异常时间",
            key: "AbnormalTime",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row: any){
                return row.AbnormalTime || '-'
            }
        },
    ]
}


export {
    createColumns,
}
