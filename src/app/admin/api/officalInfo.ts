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
type Pbulish = {
    Id: string | number,
    Handle: string | number
}
const PublishOfficalInfo = (params: Pbulish) => {
    return post('/api/OfficalInfo/Publish', params)
}

export {
    FindOfficalInfo,
    AddOfficalInfo,
    ModifyOfficalInfo,
    DeleteOfficalInfo,
    PublishOfficalInfo,
}
