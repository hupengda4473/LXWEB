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

export {
    findAllIrrigateDistrict,
}

