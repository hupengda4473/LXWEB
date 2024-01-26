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
const FindWaterSource = (params: Params) =>{
    return post('/api/WaterSource/Find', params)
}
const DeleteWaterSource = (ids: string | number) =>{
    return post('/api/WaterSource/Delete', ids)
}
const AddWaterSource = (params: object) =>{
    return post('/api/WaterSource/Add', params)
}
const ModifyWaterSource = (params: object) =>{
    return post('/api/WaterSource/Modify', params)
}

export {
    FindWaterSource,
    DeleteWaterSource,
    AddWaterSource,
    ModifyWaterSource,
}

