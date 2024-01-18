import XEUtils from 'xe-utils'

export function Search(searchContent: string, searchProps: string [],dataList: object []){
    /*
		searchContent	搜索框内容 		""
		searchProps		筛选键名			[]
		dataList		需要筛选的数据	[]
	*/
    let dataByScreen=[]
    const searchCon = XEUtils.toValueString(searchContent).trim().toLowerCase()
    if (searchCon) {
        const filterRE = new RegExp(searchCon, 'gi')
        const rest = dataList.filter(item => searchProps.some(key => XEUtils.toValueString(item[key])
            .toLowerCase().indexOf(searchCon) > -1))
        dataByScreen = rest.map(row => {
            const item = Object.assign({}, row)
            searchProps.forEach(key => {
                item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match =>
                    `${match}`)
            })
            return item
        })
    } else {
        dataByScreen = dataList
    }
    return dataByScreen
}
