import {DataTableColumns} from "naive-ui"

const createColumns = (): DataTableColumns => {
    return [
        {
            title: "操作人",
            key: "UserName",
            align: "center",
            ellipsis: true,
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "操作内容",
            key: "ModuleName",
            align: "center",
            ellipsis: true,
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "操作时间",
            key: "BeginDT",
            align: "center",
            ellipsis: true,
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: [
                {
                    label: '今天',
                    value: 1
                },
                {
                    label: '3日内',
                    value: 3
                },
                {
                    label: '一周内',
                    value: 7
                },
            ],
            filter (value, row) {
                let today = new Date().setHours(0,0,0,0)
                return (today - new Date(row.BeginDT).getTime()) / 86400000 <= value
            },
        },
    ]
}


export {
    createColumns,
}
