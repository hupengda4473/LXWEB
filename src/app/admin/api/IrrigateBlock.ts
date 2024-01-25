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
const FindIrrigateBlock = (params: Params) => {
    return post('/api/IrrigateBlock/Find', params)
}
const DeleteIrrigateBlock = (ids: string | number) => {
    return post('/api/IrrigateBlock/Delete', ids)
}
const ModifyIrrigateBlock = (params: object) => {
    return post('/api/IrrigateBlock/Modify', params)
}
const AddIrrigateBlock = (params: object) => {
    return post('/api/IrrigateBlock/Add', params)
}
const FindEntrance = () => {
    return post('/api/IrrigateBlock/FindEntrance')
}

export {
    FindIrrigateBlock,
    DeleteIrrigateBlock,
    ModifyIrrigateBlock,
    AddIrrigateBlock,
    FindEntrance,
}

