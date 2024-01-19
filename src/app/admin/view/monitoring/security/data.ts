import {DataTableColumns} from "naive-ui"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "操作人",
            key: "UserName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            render(row : any){
                return row.UserName || '-'
            },
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.UserName == value
            },
        },
        {
            title: "操作内容",
            key: "OperationContent",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "操作时间",
            key: "OperationDT",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
    ]
}


export {
    createColumns,
}
