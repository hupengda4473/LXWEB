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
const FindOfficalInfo = (params: Params) => {
    return post('/api/OfficalInfo/Find', params)
}
const AddOfficalInfo = (params: object) => {
    return post('/api/OfficalInfo/Add', params)
}
const ModifyOfficalInfo = (params: object) => {
    return post('/api/OfficalInfo/Modify', params)
}
const DeleteOfficalInfo = (ids: string | number) => {
    return post('/api/OfficalInfo/Delete', ids)
}
const PublishOfficalInfo = (ids: string | number) => {
    return post('/api/OfficalInfo/Publish', ids)
}

export {
    FindOfficalInfo,
    AddOfficalInfo,
    ModifyOfficalInfo,
    DeleteOfficalInfo,
    PublishOfficalInfo,
}
