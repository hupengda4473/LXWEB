const createColumns = () => {
    return [
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
            title: "累计水量(m³)",
            key: "TotalAmount",
            align: "center",
            sorter: 'default',
            render(row : object){
                return (row.TotalAmount * 1).toFixed(2)
            }
        },
    ]
}


export {
    createColumns,
}
