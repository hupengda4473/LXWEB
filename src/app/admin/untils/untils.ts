import { powerArr } from '@/app/admin/config/config.js'

/*
* 获取权限
* */
const getPower = (arr: string[]) => {
    const power = []
    for (const index in arr) {
        const item = arr[index]
        if (item){
            power.push(powerArr[index])
        }
    }
    return power
}

/*
* 树形结构去空children
* */
const treeDeleteChildren = (arr: object []) => {
    if (arr && arr.length > 0) {
        for (const item of arr) {
            if (item.Children && item.Children.length > 0){
                treeDeleteChildren(item.Children)
            }else {
                delete item.Children
            }
        }
    }
    return arr
}

/*
* 时间戳格式化
* */
Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return fmt
}
/*console.log(new Date(1606379756309).format("yyyy-MM-dd hh:mm:ss"))
 console.log(new Date(1606379756309).format("yyyy-M-d h:m:s.S"))
 console.log(new Date(1606379756309).format("yyyy年M月d日 h时m分s秒S毫秒"))*/

export const getFormatTime = (second_time) => {
    let time = parseInt(second_time) + "秒"
    if( parseInt(second_time )> 60){
        const second = parseInt(second_time) % 60
        let min = parseInt(String(second_time / 60))
        time = min + "分" + second + "秒"
        if( min > 60 ){
            min = parseInt(String(second_time / 60)) % 60
            let hour = parseInt(String(parseInt(String(second_time / 60)) / 60))
            time = hour + "小时" + min + "分" + second + "秒"
            if( hour > 24 ){
                hour = parseInt( String(parseInt(String(second_time / 60)) / 60) ) % 24
                const day = parseInt(String(parseInt(String(parseInt(String(second_time / 60)) / 60)) / 24))
                time = day + "天" + hour + "小时" + min + "分" + second + "秒"
            }
        }
    }
    return time
}

/*
* 获取问候语
* */
const getPamFormat = (hour) => {
    if (hour < 6) {
        return "凌晨好！"
    } else if (hour < 9) {
        return "早上好！"
    } else if (hour < 12) {
        return "上午好！"
    } else if (hour < 14) {
        return "中午好！"
    } else if (hour < 17) {
        return "下午好！"
    } else if (hour < 19) {
        return "傍晚好！"
    } else if (hour < 22) {
        return "晚上好！"
    } else {
        return "夜里好！"
    }
}

/*
* 判断是否是图片
* */
const isImage = (type: string) => {
    return type === '.png' || type === '.jpg' || type === '.gif' || type === 'webp' || type.includes('image')
}

export {
    getPower,
    treeDeleteChildren,
    getPamFormat,
    isImage,
}
