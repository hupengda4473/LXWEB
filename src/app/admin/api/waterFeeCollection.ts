import {post} from "@/packages/http/request.ts"

const FindAllWaterPrice = () =>{
    return post('/api/WaterPrice/FindAll')
}
const AddWaterPrice = (params: object) =>{
    return post('/api/WaterPrice/Add', params)
}
const ModifyWaterPrice = (params: object) =>{
    return post('/api/WaterPrice/Modify', params)
}
const DeleteWaterPrice = (id: string | number) =>{
    return post('/api/WaterPrice/Delete', id)
}
const PayForWater = (year: string | number) =>{
    return post('/api/PaymentRecord/PayForWater', year)
}
type WaterBalance = {
    LocationID: any,
    BeginDT: string,
    EndDT: string,
}
const GetWaterBalance = (params: WaterBalance) =>{
    return post('/api/WaterAnalysis/GetWaterBalance', params)
}
const FindMonthRoundReport = (params: string) =>{
    return post('/api/WaterStatistics/FindMonthRoundReport', params)
}

export {
    FindAllWaterPrice,
    AddWaterPrice,
    ModifyWaterPrice,
    DeleteWaterPrice,
    PayForWater,
    GetWaterBalance,
    FindMonthRoundReport,
}

