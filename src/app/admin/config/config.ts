import {reactive} from "vue"

const env = import.meta.env
let apiServer
if (env.PROD) {
    apiServer = 'http://60.2.176.226:12017'
} else {
    apiServer = 'http://localhost:59966'
}
export const requestUrl = apiServer
export const SPECIAL_URL = 'http://192.168.10.81:6190'


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

