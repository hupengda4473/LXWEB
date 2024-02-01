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
const FindSoilMoisture = (params: Params) =>{
    return post('/api/SoilMoisture/Find', params)
}
const DeleteSoilMoisture = (ids: string | number) =>{
    return post('/api/SoilMoisture/Delete', ids)
}
const AddSoilMoisture = (params: object) =>{
    return post('/api/SoilMoisture/Add', params)
}
const ModifySoilMoisture = (params: object) =>{
    return post('/api/SoilMoisture/Modify', params)
}

export {
    FindSoilMoisture,
    DeleteSoilMoisture,
    AddSoilMoisture,
    ModifySoilMoisture,
}

