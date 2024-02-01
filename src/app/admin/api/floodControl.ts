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
const FindFloodControlFeature = (params: Params) => {
    return post('/api/FloodControlFeature/Find', params)
}
const AddFloodControlFeature = (params: object) => {
    return post('/api/FloodControlFeature/Add', params)
}
const ModifyFloodControlFeature = (params: object) => {
    return post('/api/FloodControlFeature/Modify', params)
}
const DeleteFloodControlFeature = (ids: string | number) => {
    return post('/api/FloodControlFeature/Delete', ids)
}

export {
    FindFloodControlFeature,
    AddFloodControlFeature,
    ModifyFloodControlFeature,
    DeleteFloodControlFeature,
}
