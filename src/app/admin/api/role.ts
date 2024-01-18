import {post} from "@/packages/http/request.ts"

type AddParams = {
    RoleID: number,
    RoleName: string,
    State: number
}
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
    RoleID: string | number,
    MenuID: string | number,
    Complete: number,
    Operation: number
}

const getAllRoles = () => {
    return post<AddParams>('/api/Role/FindAll')
}
const addRoles = (params: AddParams) => {
    return post('/api/Role/Add', params)
}
const editRoles = (params: AddParams) => {
    return post('/api/Role/Modify', params)
}
const deleteRoles = (params: (string | number)) => {
    return post('/api/Role/Del', params)
}
const findMenuByRoleID = (params: (string | number)) => {
    return post('/api/Role/FindMenuByRoleID', params)
}
const savePower = (params: Save[]) => {
    return post('/api/Role/SavePower', params)
}

export {
    getAllRoles,
    addRoles,
    editRoles,
    deleteRoles,
    findMenuByRoleID,
    savePower,
}

