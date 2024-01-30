import {post} from "@/packages/http/request.ts"

type Params = {
    PageSize: number,
    PageIndex: number,
    OrderField: string,
    OrderType: string,
    BeginDT: string,
    EndDT: string,
    FuzzyName: string,
    UserID: string | number
}
const FindFloodControlInfo = (params: Params) => {
    return post('/api/FloodControlInfo/Find', params)
}
const AddFloodControlInfo = (params: object) => {
    return post('/api/FloodControlInfo/Add', params)
}
const ModifyFloodControlInfo = (params: object) => {
    return post('/api/FloodControlInfo/Modify', params)
}
const DeleteFloodControlInfo = (ids: string | number) => {
    return post('/api/FloodControlInfo/Delete', ids)
}

export {
    FindFloodControlInfo,
    AddFloodControlInfo,
    ModifyFloodControlInfo,
    DeleteFloodControlInfo,
}
