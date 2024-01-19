import {post} from "@/packages/http/request.ts"

type FindAll = {
    PageSize: number,
    PageIndex: number,
    OrderField: string,
    OrderType: string,
    BeginDT: string,
    EndDT: string,
    FuzzyName: string,
    UserID: string | number
}
const findAllIrrigateDistrict = (params: FindAll) =>{
    return post('/api/IrrigateDistrict/Find', params)
}
const addIrrigateDistrict = (params: object) =>{
    return post('/api/IrrigateDistrict/Add', params)
}
const modifyIrrigateDistrict = (params: object) =>{
    return post('/api/IrrigateDistrict/Modify', params)
}
const deleteIrrigateDistrict = (ids: string | number) =>{
    return post('/api/IrrigateDistrict/Delete', ids)
}

export {
    findAllIrrigateDistrict,
    addIrrigateDistrict,
    modifyIrrigateDistrict,
    deleteIrrigateDistrict,
}

