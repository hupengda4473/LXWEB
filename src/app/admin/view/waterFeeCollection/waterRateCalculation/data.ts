import {DataTableColumns} from "naive-ui"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "年份",
            key: "Year",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter (value, row) {
                return row.Year == value
            },
        },

        {
            title: "用水组织",
            key: "AssociationName",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "面积(亩)",
            key: "PlantArea",
            align: "center",
            sorter: 'default',
        },
        {
            title: "总用水量(m³)",
            key: "TotalWater",
            align: "center",
            sorter: 'default',
        },
        {
            title: "亩均用水量(m³)",
            key: "PlantArea",
            align: "center",
            sorter: 'default',
        },
        {
            title: "标准水价",
            key: "StandardWaterPrice",
            align: "center",
            sorter: 'default',
        },
        {
            title: "补贴后水价",
            key: "EnforcementPrice",
            align: "center",
            sorter: 'default',
        },
        {
            title: "总水费",
            key: "TotalWaterAmount",
            align: "center",
            sorter: 'default',
        },
        {
            title: "节水奖励金额",
            key: "WaterSavingRewardAmount",
            align: "center",
            sorter: 'default',
        },
    ]
}

export {
    createColumns
}
