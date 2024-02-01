import * as XLSX from 'xlsx'

export function ExportTable(dataList, tableColumns, fileName, childColumns = []) {
    /*
        dataList	表格数据		[]
        tableColumns	需要导出的列	[]
        fileName	文件名称		""
    */
    // 创建工作表
    const tableValue = []
    for (const i in dataList) {
        const obj = {"序号": Number(i) + 1}
        for (const j in tableColumns) {
            if (!tableColumns[j].type && tableColumns[j].type !== 'selection' && tableColumns[j].title !== '操作' && tableColumns[j].title !== '文件' && tableColumns[j].title !== '描述' && tableColumns[j].title !== '状态') {
                const key = tableColumns[j].title
                let value = ''
                if (tableColumns[j].render != null) {
                    const fun = tableColumns[j].render
                    value = fun(0, 0, dataList[i][tableColumns[j].key], 0)
                } else {
                    value = dataList[i][tableColumns[j].key]
                }
                if (value)obj[key] = value
            }
        }
        tableValue.push(obj)
        if (dataList[i].children && tableColumns) {
            const list = dataList[i].children
            for (let c = 0; c < list.length; c++) {
                const item = dataList[i].children[c]
                const childObj = {}
                for (const j in tableColumns) {
                    const key = tableColumns[j].title
                    let value = ''
                    if (tableColumns[j].render != null) {
                        const fun = tableColumns[j].render
                        value = fun(0, 0, item[tableColumns[j].key], 0)
                    } else {
                        value = item[tableColumns[j].key]
                    }
                    childObj[key] = value
                }
                tableValue.push(childObj)
            }
        }
    }
    // return
    const data = XLSX.utils.json_to_sheet(tableValue)
    // 创建工作簿
    const wb = XLSX.utils.book_new()
    // 将工作表放入工作簿中
    XLSX.utils.book_append_sheet(wb, data, 'data')
    // 生成文件并下载
    const time = new Date()
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const day = time.getDate()
    fileName += `(${year}-${month}-${day})`
    XLSX.writeFile(wb, fileName + '.xlsx')
}
