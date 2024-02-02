import {DataTableColumns} from "naive-ui"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "用水组织",
            key: "AssociationName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "年份",
            key: "Year",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "总水量(m³)",
            key: "TotalWater",
            align: "center",
            sorter: 'default',
        },
        {
            title: "应缴水费(万元)",
            key: "PayableAmount",
            align: "center",
            sorter: 'default',
        },
        {
            title: "已缴水费(万元)",
            key: "PaidAmount",
            align: "center",
            sorter: 'default',
        },
        {
            title: "剩余金额(万元)",
            key: "SurplusAmount",
            align: "center",
            sorter: 'default',
        },
    ]
}

export {
    createColumns
}
