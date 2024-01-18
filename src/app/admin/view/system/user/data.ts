import {DataTableColumns, NButton, NPopconfirm, NCheckbox} from "naive-ui"
import {h} from "vue"

//index页
const createColumns = ({compHandle}): DataTableColumns => {
    const arr = [
        {
            type: "selection",
        },
        {
            title: "用户名",
            key: "UserName",
            align: "center",
            ellipsis: true,
            sorter: 'default'
        },
        {
            title: "昵称",
            key: "NickName",
            align: "center",
            ellipsis: true,
            sorter: 'default'
        },
        {
            title: "密码",
            key: "PersonName",
            align: "center",
            ellipsis: true,
            sorter: 'default',
            render(){
                return '******'
            }
        },
        compHandle.operation.isUpdate || compHandle.operation.isDelete ?
        {
            title: "操作",
            key: "actions",
            align: "center",
            render(row) {
                return h("div", [
                    compHandle.operation.isUpdate ?
                    h(NButton,
                        {
                            type: "success",
                            size: "small",
                            ghost: true,
                            onClick: () => compHandle.edit(row),
                            style: {marginRight: "5px"}
                        },
                        {default: () => "编辑"}
                    ) : '',
                    compHandle.operation.isUpdate ?
                    h(NButton,
                        {
                            type: "info",
                            size: "small",
                            ghost: true,
                            onClick: () => compHandle.assignPermissions(row),
                            style: {marginRight: "5px"}
                        },
                        {default: () => "分配权限"}
                    ) : '',
                    compHandle.operation.isUpdate ?
                    h(NButton,
                        {
                            type: "info",
                            size: "small",
                            ghost: true,
                            onClick: () => compHandle.assignRole(row),
                            style: {marginRight: "5px"}
                        },
                        {default: () => "分配角色"}
                    ) : '',
                    compHandle.operation.isDelete ?
                    h(NPopconfirm,
                        {
                            onPositiveClick: () => {
                                compHandle.del(row)
                            },
                            negativeText: "取消",
                            positiveText: "确定"
                        },
                        {
                            trigger: () => {
                                return h(
                                    NButton,
                                    {
                                        type: "error",
                                        strong: true,
                                        size: "small",
                                        ghost: true,
                                    },
                                    {default: () => "删除"}
                                )
                            },
                            default: () => {
                                return "确认删除该条数据嘛？"
                            }
                        }
                    ): ''
                ])
            }
        } : false
    ]
    return arr.filter( item => item !== false)
}
//分配权限
const createPowerColumns = ({compHandle}): DataTableColumns => {
    return [
        {
            title: "菜单名称",
            key: "title",
            align: "center",
            sorter: 'default'
        },
        {
            title: "查询",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    compHandle.findList(row)
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isSelect && row.Permit.isSelect,
                                disabled: !row.operation.isSelect,
                                defaultChecked: row.operation.isSelect && row.Permit.isSelect,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isSelect', checked),
                                style: {marginRight: "5px"},
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isSelect'),
                            defaultChecked: compHandle.allChecked('isSelect'),
                            label: '查询',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isSelect', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
        {
            title: "新增",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isAdd && row.Permit.isAdd,
                                disabled: !row.operation.isAdd,
                                defaultChecked: row.operation.isAdd && row.Permit.isAdd,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isAdd', checked),
                                style: {marginRight: "5px"}
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isAdd'),
                            defaultChecked: compHandle.allChecked('isAdd'),
                            label: '新增',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isAdd', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
        {
            title: "修改",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isUpdate && row.Permit.isUpdate,
                                disabled: !row.operation.isUpdate,
                                defaultChecked: row.operation.isUpdate && row.Permit.isUpdate,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isUpdate', checked),
                                style: {marginRight: "5px"}
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isUpdate'),
                            defaultChecked: compHandle.allChecked('isUpdate'),
                            label: '修改',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isUpdate', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
        {
            title: "删除",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isDelete && row.Permit.isDelete,
                                disabled: !row.operation.isDelete,
                                defaultChecked: row.operation.isDelete && row.Permit.isDelete,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isDelete', checked),
                                style: {marginRight: "5px"}
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isDelete'),
                            defaultChecked: compHandle.allChecked('isDelete'),
                            label: '删除',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isDelete', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
        {
            title: "导入",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isImport && row.Permit.isImport,
                                disabled: !row.operation.isImport,
                                defaultChecked: row.operation.isImport && row.Permit.isImport,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isImport', checked),
                                style: {marginRight: "5px"}
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isImport'),
                            defaultChecked: compHandle.allChecked('isImport'),
                            label: '导入',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isImport', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
        {
            title: "导出",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isExport && row.Permit.isExport,
                                disabled: !row.operation.isExport,
                                defaultChecked: row.operation.isExport && row.Permit.isExport,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isExport', checked),
                                style: {marginRight: "5px"}
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isExport'),
                            defaultChecked: compHandle.allChecked('isExport'),
                            label: '导出',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isExport', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
        {
            title: "审核",
            key: "operation",
            align: "left",
            width: 90,
            render(row) {
                if (!row.children){
                    return h("div", [
                        h(NCheckbox,
                            {
                                key: row.operation.isCheck && row.Permit.isCheck,
                                disabled: !row.operation.isCheck,
                                defaultChecked: row.operation.isCheck && row.Permit.isCheck,
                                onUpdateChecked: (checked: boolean) => compHandle.powerItemChecked(row, 'isCheck', checked),
                                style: {marginRight: "5px"}
                            },
                        ),
                    ])
                }
            },
            title(){
                return h("div", [
                    h(NCheckbox,
                        {
                            key: compHandle.allChecked('isCheck'),
                            defaultChecked: compHandle.allChecked('isCheck'),
                            label: '审核',
                            onUpdateChecked: (checked: boolean) => compHandle.powerItemCheckedAll('isCheck', checked),
                            style: {marginRight: "5px"}
                        },
                    ),
                ])
            }
        },
    ]
}
//分配角色
const createRoleColumns = (): DataTableColumns => {
    return [
        {
            title: "角色名称",
            key: "RoleName",
            align: "center",
            sorter: 'default'
        },
        {
            type: "selection",
            key: "RoleName",
        },
    ]
}


export {
    createColumns,
    createPowerColumns,
    createRoleColumns,
}
