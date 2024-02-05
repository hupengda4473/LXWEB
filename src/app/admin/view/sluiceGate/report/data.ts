const createColumns = (allData) => {
    return [
        {
            title: "日期",
            key: "DT",
            align: "center",
            sorter: 'default',
        },
        {
            title: "1月（m³）",
            key: "S1",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S1 || '-'
            },
            colSpan: (rowData, rowIndex) => (rowIndex == allData.length - 1 ? 12 : 1)
            // colSpan: (rowData, rowIndex) => (console.log(rowIndex))
        },
        {
            title: "2月（m³）",
            key: "S2",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S2 || '-'
            }
        },
        {
            title: "3月（m³）",
            key: "S3",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S3 || '-'
            }
        },
        {
            title: "4月（m³）",
            key: "S4",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S4 || '-'
            }
        },
        {
            title: "5月（m³）",
            key: "S5",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S5 || '-'
            }
        },
        {
            title: "6月（m³）",
            key: "S6",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S6 || '-'
            }
        },
        {
            title: "7月（m³）",
            key: "S7",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S7 || '-'
            }
        },
        {
            title: "8月（m³）",
            key: "S8",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S8 || '-'
            }
        },
        {
            title: "9月（m³）",
            key: "S9",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S9 || '-'
            }
        },
        {
            title: "10月（m³）",
            key: "S10",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S10 || '-'
            }
        },
        {
            title: "11月（m³）",
            key: "S11",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S11 || '-'
            }
        },
        {
            title: "12月（m³）",
            key: "S12",
            align: "center",
            sorter: 'default',
            render(row: any){
                return row.S12 || '-'
            }
        },
    ]
}


export {
    createColumns,
}
