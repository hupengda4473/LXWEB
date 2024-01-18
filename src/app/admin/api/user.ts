import {post} from "@/packages/http/request.ts"

type Save = {
    Permit: {
        isSelect: boolean,
        isAdd: boolean,
        isUpdate: boolean,
        isDelete: boolean,
        isImport: boolean,
        isExport: boolean,
        isCheck: boolean
    },
    UserID: string | number,
    MenuID: string | number,
    Complete: number,
    Operation: number
}
type SaveRoles = {
    UserId: number | string,
    RoleIds: (string | number)[]
}
const getAllUsers = () => {
    return post('/api/User/FindAll')
}
const deleteUsers = (id: string | number) => {
    return post('/api/User/Del', id)
}
const editUsers = (params) => {
    return post('/api/User/Modify', params)
}
const addUsers = (params) => {
    return post('/api/User/Add', params)
}
const findMenuByUserID = (id: string | number) => {
    return post('/api/User/FindMenuByUserID', id)
}
const savePower = (params: Save[]) => {
    return post('/api/User/SavePower', params)
}
const findRoleByUserID = (id: string | number) => {
    return post('/api/User/FindRoleByUserID', id)
}
const saveRoles = (params: SaveRoles) => {
    return post('/api/User/SaveRoles', params)
}

export {
    getAllUsers,
    deleteUsers,
    editUsers,
    addUsers,
    findMenuByUserID,
    savePower,
    findRoleByUserID,
    saveRoles,
}

