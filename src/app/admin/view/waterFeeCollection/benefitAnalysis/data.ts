import {DataTableColumns} from "naive-ui"

const createColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "测点编码",
            key: "LocationCode",
            align: "center",
            defaultSortOrder: 'descend',
            sorter: 'default',
        },
        {
            title: "测点名称",
            key: "LocationName",
            align: "center",
            sorter: 'default',
        },
        {
            title: compHandle.time + '第1轮',
            key: "L1",
            align: "center",
            sorter: 'default',
        },
        {
            title: compHandle.time + '第2轮',
            key: "L2",
            align: "center",
            sorter: 'default',
        },
        {
            title: compHandle.time + '第3轮',
            key: "L3",
            align: "center",
            sorter: 'default',
        },
        {
            title: compHandle.time + '第4轮',
            key: "L4",
            align: "center",
            sorter: 'default',
        },
        {
            title: compHandle.time + '第5轮',
            key: "L5",
            align: "center",
            sorter: 'default',
        },
        {
            title: compHandle.time + '第6轮',
            key: "L6",
            align: "center",
            sorter: 'default',
        },
    ]
}

export {
    createColumns
}
