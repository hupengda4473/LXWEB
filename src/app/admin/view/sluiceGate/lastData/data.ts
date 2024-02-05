import {h} from "vue"
import {NTag} from "naive-ui"

const createColumns = ({compHandle}) => {
    return [
        {
            title: "管理所",
            key: "PGroupName",
            align: "center",
            sorter: 'default',
            rowSpan: rowData => compHandle.tableData.filter(item => item.PGroupName === rowData.PGroupName).length,
            defaultFilterOptionValues: [],
            filterOptions: compHandle.LocationType.length > 0 ? compHandle.LocationType : null,
            filter(value, row) {
                return row.PGroupName == value
            },
        },
        {
            title: "管理站",
            key: "GroupName",
            align: "center",
            sorter: 'default',
            rowSpan: rowData => compHandle.tableData.filter(item => item.GroupName === rowData.GroupName).length,
            defaultFilterOptionValues: [],
            filterOptions: compHandle.filterArr.length > 0 ? compHandle.filterArr : null,
            filter(value, row) {
                return row.GroupName == value
            },
        },
        {
            title: "设备名称",
            key: "DeviceName",
            align: "center",
            sorter: 'default',
        },
        {
            title: "时间",
            key: "DT",
            align: "center",
            sorter: 'default',
        },
        {
            title: "闸前水位(m)",
            key: "BeforeWL",
            align: "center",
            sorter: 'default',
            render(row : object){
                return (row.BeforeWL * 1).toFixed(2)
            }
        },
        {
            title: "闸后水位(m)",
            key: "BehindWL",
            align: "center",
            sorter: 'default',
            render(row : object){
                return (row.BehindWL * 1).toFixed(2)
            }
        },
        {
            title: "闸高((m)",
            key: "Height",
            align: "center",
            sorter: 'default',
            render(row : object){
                return (row.Height * 1).toFixed(2)
            }
        },
        {
            title: "瞬时流量(m³/s)",
            key: "InstantFlux",
            align: "center",
            sorter: 'default',
            render(row : object){
                return (row.InstantFlux * 1).toFixed(2)
            }
        },
        {
            title: "设备状态",
            key: "StationStatus",
            align: "center",
            sorter: 'default',
            render(row : object){
                return row.StationStatus === 1 || row.StationStatus === '1' ?
                    h(NTag,{
                        type: "success",
                        round: true,
                        bordered: false,
                    },{
                        default: () => '已连接',
                    })
                    :
                    h(NTag,{
                        type: "error",
                        round: true,
                        bordered: false,
                    },{
                        default: () => '未连接',
                    })
            }
        },
    ]
}


export {
    createColumns,
}
