import {DataTableColumns} from "naive-ui"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "测点名称",
            key: "LocationName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.LocationId == value
            },
        },
        {
            title: "采集时间",
            key: "CollectTime",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "温度(℃)",
            key: "Temperature",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "PH",
            key: "PH",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "电导率(S/m)",
            key: "ElectricalConductivity",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "COD(mg/L)",
            key: "COD",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "浊度(TU)",
            key: "Turbidity",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "溶解氧(mg/L)",
            key: "DissolvedOxygen",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        }
    ]
}

export {
    createColumns
}
