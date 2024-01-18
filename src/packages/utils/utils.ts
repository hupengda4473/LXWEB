import cloneDeep from "lodash/cloneDeep.js"
import {nextTick} from "vue"

/**
 * 生成树节点
 * @param arr
 * @param keyField
 * @param childField
 */
const toTree = ({
    arr = [], keyField = "id", children = "children", pid = "pid", callback = () => {
    }
}: { arr: Array<any>; keyField?: string; children?: string; pid?: string; callback?: (item) => void }) => {
    const data = cloneDeep(arr)
    const map: any = {}
    data.forEach(function (item: any) {
        map[item[keyField]] = item
    })
    const new_data: any = []
    data.forEach(function (item: any) {
        const parent = map[item[pid]]
        if (parent) {
            (parent[children] || (parent[children] = [])).push(item)
        } else {
            new_data.push(item)
        }
        callback && callback(item)
    })
    return new_data
}

/**
 * 生成链路
 * @param arr
 * @param id
 */
const getObjectPath = ({arr = <any>[], id = ""}) => {
    const data = cloneDeep(arr)
    for (const i in arr) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(i)) {
            if (arr[i].id === id) {
                return [data[i]]
            }
            if (data[i].children) {
                const node: any = getObjectPath({arr: data[i].children, id})
                if (node !== undefined) {
                    return node.concat(data[i])
                }
            }
        }
    }
}


function htmlElementClass(state: boolean, clsName: string, target?: HTMLElement) {
    const targetEl = target || document.body
    if (state) {
        targetEl.classList.add(clsName)
    } else {
        targetEl.classList.remove(clsName)
    }
}


/**
 * 复制
 * @param text
 */
const clipboardCopy = (text: string) => {
    if (navigator.clipboard) { // 如果浏览器兼容该 API
        return navigator.clipboard.writeText(text).catch(function (err) {
            throw (err !== undefined ? err : new DOMException("The request is not allowed", "NotAllowedError"))
        })
    }

    // 或者使用 document.execCommand()

    // 把需要复制的文本放入 <span>
    const span = document.createElement("span")
    span.textContent = text

    // 保留文本样式
    span.style.whiteSpace = "pre"

    // 把 <span> 放进页面
    document.body.appendChild(span)

    // 创建选择区域
    const selection: any = window.getSelection()
    const range = window.document.createRange()
    selection.removeAllRanges()
    range.selectNode(span)
    selection.addRange(range)

    // 复制文本到剪切板
    let success = false
    try {
        success = window.document.execCommand("copy")
    } catch (err) {
        console.log(err)
    }

    // 清除战场
    selection.removeAllRanges()
    window.document.body.removeChild(span)

    return success
        ? Promise.resolve()
        : Promise.reject(new DOMException("The request is not allowed", "NotAllowedError"))
}


const rdmRgbColor = () => {
    const arr: any = []
    for (let i = 0; i < 3; i++) {
        arr.push(Math.floor(Math.random() * 128 + 64))
        arr.push(Math.floor(Math.random() * 128 + 128))
    }
    const [r, g, b] = arr
    return `#${r.toString().length > 1 ? r.toString() : "0" + r.toString()}${g.toString().length > 1 ? g.toString() : "0" + g.toString()}${
        b.toString().length > 1 ? b.toString() : "0" + b.toString()}`
}

/**
 * 表格模糊搜索
 * @param keyword
 * @param searchItem
 * @param allData
 */
const tableSearch = (keyword: any[], searchItem: any[], allData: any[]) => {
    const dataArr = deepCopy(allData)
    const data = []
    dataArr.filter(item => {
        let status = true
        if (searchItem && searchItem.length > 0) {
            for (const index2 in searchItem) {
                const item2 = searchItem[index2]
                if (item[item2].indexOf(keyword[index2 * 1]) <= -1) {
                    status = false
                }
            }
        }
        if (status) {
            data.push(item)
        }
    })
    return data.length <= 0 ? dataArr : data
}

/**
 * 寻找最底层
 * @param data
 * @param list
 */
const check = (data, list) => {
    data.forEach((item) => {
        if (item.children && item.children.length > 0) {
            check(item.children, list)
        } else {
            list.push(item)
        }
    });
    return list
}


/**
 * 深拷贝
 * @param source
 */
const deepCopy = source => {
    // 创建一个 WeakMap 对象，记录已拷贝过的对象
    const weakmap = new WeakMap()

    // 获取数据类型，返回值如："Object"、"Array"、"Symbol" 等
    const getClass = x => {
        const type = Object.prototype.toString.call(x)
        return /^\[object (.*)\]$/.exec(type)[1]
    }

    // 判断是否为数组
    const isArray = arr => getClass(arr) === 'Array'

    // 判断是否为引用类型
    const isObject = obj => obj !== null && (typeof obj === 'object' || typeof obj === 'function')

    // 判断是否为“特殊”对象（需要特殊处理）
    const isSepcialObject = obj => {
        const type = getClass(obj)
        return ['Boolean', 'Number', 'String', 'Symbol', 'BigInt', 'Date', 'Map', 'Set', 'RegExp'].includes(type)
    }

    // 处理特殊对象
    const handleSepcialObject = obj => {
        const type = getClass(obj)
        const Ctor = obj.constructor // 对象的构造函数
        const primitiveValue = obj.valueOf() // 获取对象的原始值

        switch (type) {
        case 'Boolean':
        case 'Number':
        case 'String':
        case 'Symbol':
        case 'BigInt':
            // 处理包装对象 Wrapper Object
            return Object(primitiveValue)
        case 'Date':
            return new Ctor(primitiveValue) // new Date(+obj)
        case 'RegExp': {
            const {source, flags, lastIndex} = obj
            const re = new RegExp(source, flags)
            re.lastIndex = lastIndex
            return re
        }
        case 'Map': {
            const map = new Ctor()
            obj.forEach((item, key) => {
                // 注意，即使 Map 对象的 key 为引用类型，这里也不能 copy(key)，否则会失去引用，导致该属性无法访问得到。
                map.set(key, copy(item))
            })
            return map
        }
        case 'Set': {
            const set = new Ctor()
            obj.forEach(item => {
                set.add(copy(item))
            })
            return set
        }
        default:
            return undefined
        }
    }

    // 创建输出对象（原型拷贝关键就在这一步）
    const initCloneObject = obj => {
        if (obj.constructor === undefined) {
            return Object.create(null)
        }

        if (typeof obj.constructor === 'function' && (obj !== obj.constructor || obj !== Object.prototype)) {
            const proto = Object.getPrototypeOf(obj)
            return Object.create(proto)
        }

        return {}
    }

    // 拷贝方法（递归思路）
    const copy = input => {
        if (typeof input === 'function' || !isObject(input)) return input

        // 针对已拷贝过的对象，直接返回（解决循环引用的问题）
        if (weakmap.has(input)) {
            return weakmap.get(input)
        }

        // 处理包装对象
        if (isSepcialObject(input)) {
            return handleSepcialObject(input)
        }

        // 创建输出对象
        const output = isArray(input) ? [] : initCloneObject(input)

        // 记录每次拷贝的对象
        weakmap.set(input, output)

        // 仅遍历对象自身可枚举的属性（包括字符串属性和 Symbol 属性）
        Reflect.ownKeys(input).forEach(key => {
            if (input.propertyIsEnumerable(key)) {
                output[key] = copy(input[key])
            }
        })

        return output
    }

    return copy(source)
}


/**
 * 获取所有添加的阿里巴巴矢量库图标
 */
const getAlicdnIconfont = () => {

    return new Promise((resolve, reject) => {
        nextTick(() => {
            const styles = document.styleSheets
            const sheetsList = []
            const sheetsIconList = []
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].href && styles[i].href.indexOf('at.alicdn.com') > -1) {
                    sheetsList.push(styles[i])
                }
            }
            for (let i = 0; i < sheetsList.length; i++) {
                for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
                    if (sheetsList[i].cssRules[j].selectorText && sheetsList[i].cssRules[j].selectorText.indexOf('.ali-icon-') > -1) {
                        sheetsIconList.push(
                            `${sheetsList[i].cssRules[j].selectorText.substring(1, sheetsList[i].cssRules[j].selectorText.length).replace(/::before/gi, '')}`
                        )
                    }
                }
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList)
            else reject('未获取到值，请刷新重试')
        })
    })
}

export {
    toTree,
    getObjectPath,
    htmlElementClass,
    clipboardCopy,
    rdmRgbColor,
    tableSearch,
    deepCopy,
    getAlicdnIconfont,
    check,
}
