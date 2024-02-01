import {reactive} from "vue"

/*正式发布两个地址应该一样*/
export const requestUrl = 'http://localhost:59966'
export const requestFileUrl = 'http://localhost:59966'

/*
表单大小*/
export const formSize = 'medium'

/*
* 权限
* */
export const powerArr = {
    isSelect: '查询',
    isAdd: '新增',
    isUpdate: '修改',
    isDelete: '删除',
    isImport: '导入',
    isExport: '导出',
    isCheck: '审核',
}

/*
* 表格配置
* */
export const tableSetting = {
    showTableSizeSetting: true,//是否显示表格大小设置
    showTableColumnsSetting: true,//是否显示表格列表设置
    bordered: false,//是否显示 border
    cascade: false,//在进行树型数据选择的时候是否级联
    bottomBordered: false,//是否显示 bottom border
    defaultExpandAll: false,//是否默认展开全部可展开的行，不可在异步展开行时使用
    flexHeight: false,//是否让表格主体的高度自动适应整个表格区域的高度，打开这个选项会让 table-layout 始终为 'fixed'
    paginateSinglePage: true,//当表格数据只有一页时是否显示分页面
    singleColumn: false,//是否不设定行的分割线，当参数为true时，则单元格没有下边线
    singleLine: false,//是否不设定列的分割线，当参数值为 true 时，则单元格没有右边线
    striped: true,//是否使用斑马线条纹
    summaryPlacement: 'bottom',//总结栏的位置 ('top' | 'bottom')
    tableSizeValue: 'small',//表格默认大小
    //表格样式
    style: {
        paddingBottom: '16px',
    },
    //表格大小
    tableSize: [
        {
            label: "较小",
            value: "small",
        },
        {
            label: "适中",
            value: "medium",
        },
        {
            label: "较大",
            value: "large",
        }
    ],
    //表格分页配置
    paginationReactive: reactive({
        disabled: false, //是否禁用
        size: 'medium', //分页大小 （'small' | 'medium' | 'large'）
        page: 1, //受控模式下的当前页
        pageSize: 20, //受控模式下的分页大小
        showSizePicker: true, //是否显示每页条数的选择器
        showQuickJumper: true, //是否显示快速跳转
        pageSizes: [10, 20, 50, 100],
        //页数改变
        onChange: (page) => {
            tableSetting.paginationReactive.page = page
        },
        //分页大小改变
        onUpdatePageSize: (pageSize) => {
            tableSetting.paginationReactive.pageSize = pageSize
            tableSetting.paginationReactive.page = 1
        },
        //分页前缀
        prefix ({ itemCount }) {
            return `共计 ${itemCount} 条数据`
        },
        //分页后缀
        suffix ({ itemCount }) {
            return `从第 ${ Math.ceil(itemCount / tableSetting.paginationReactive.pageSize) } 页结束`
        }
    }),
}

/*
 * 按钮配置
 * */
export const btnConfig = {
    add: '#52C41A', //新增
    del: '#ff4d4f', //删除
    exp: '#fab337', //导出
    ref: '#1890ff', //刷新,
    ser: '',//搜索
    showIco: true, //是否显示图标
    ico: {
        add: 'ali-icon-xinzeng', //新增
        del: 'ali-icon-shanchu', //删除
        exp: 'ali-icon-daochu', //导出
        ref: 'ali-icon-shuaxin', //刷新,
        ser: 'ali-icon-sousuo1',//搜索,
        size: 'ali-icon-tiaozhengdaxiao-shangxia', // 表格大小
        tab: 'ali-icon-chanpinliebiaoliebiaomoshi', //表列
    }
}

/*
* 测点类型
* */
export const pointType = [
    {label: '节制闸', value: '1'},
    {label: '退水闸', value: '2'},
    {label: '渠首', value: '3'},
    {label: '放水口', value: '4'},
    {label: '泵站', value: '5'},
    {label: '水位流量', value: '6'},
    {label: '流量', value: '7'},
    {label: '雨情', value: '8'},
    {label: '视频', value: '9'},
    {label: '水质', value: '10'},
]

/*
* 设备类型
* */
export const deviceType = [
    {label: '闸门', value: 'Sluice'},
    {label: '泵站', value: 'Pump'},
    {label: '水位', value: 'Ditch'},
    {label: '流量', value: 'Flow'},
    {label: '雨量', value: 'Rain'},
    {label: '视频', value: 'Video'},
]

/*
* 灌季
* */
export const IrrigateSeasonList = [
    {label: '春灌', value: '春灌'},
    {label: '夏灌', value: '夏灌'},
    {label: '秋灌', value: '秋灌'},
    {label: '冬灌', value: '冬灌'},
]

/*
* 轮次
* */
export const roundList = [
    {label: '第1轮', value: '1'},
    {label: '第2轮', value: '2'},
    {label: '第3轮', value: '3'},
    {label: '第4轮', value: '4'},
    {label: '第5轮', value: '5'},
    {label: '第6轮', value: '6'},
    {label: '第7轮', value: '7'},
    {label: '第8轮', value: '8'},
    {label: '第9轮', value: '9'},
    {label: '第10轮', value: '10'},
    {label: '第11轮', value: '11'},
    {label: '第12轮', value: '12'},
]

/*
* 渠道类型
* */
export const channelType = [
    {label: '干渠', value: 'MainCanal'},
    {label: '支渠', value: 'BranchCanal'},
    {label: '斗渠', value: 'LateralCanal'},
]

/*
* 水源信息类型
* */
export const headwatersTypeList = [
    {label: '水库', value: 1},
    {label: '渠道', value: 2},
    {label: '自然河道', value: 3},
]

/*
* 防洪措施类型
* */
export const floodControlMeasuresType = [
    {label: '防洪指导文件', value: 1},
    {label: '防洪通知', value: 2},
    {label: '防洪工作部署', value: 3},
]

/*
* 防洪基础信息类型
* */
export const floodControlType = [
    {label: '防洪堤', value: 1},
    {label: '渠段', value: 2},
    {label: '自然河道', value: 3},
]

/*
* 文件下发通知类型
* */
export const officalInfoType = [
    {label: '草稿', value: 0},
    {label: '下发', value: 1},
]

/*
* 调度指令下发类型
* */
export const instructType = [
    {label: '水资源调度', value: 1},
    {label: '巡检调度', value: 2},
]

/*
* 完成情况类型
* */
export const finishStatusType = [
    {label: '未完成', value: 0},
    {label: '完成', value: 1},
]
