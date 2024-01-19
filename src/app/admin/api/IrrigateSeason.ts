import {post} from "@/packages/http/request.ts"

type params = {
    PageSize: number,
    PageIndex: number,
    OrderField: string,
    OrderType: string,
    BeginDT: string,
    EndDT: string,
    FuzzyName: string,
    UserID: string | number
}
const findAllIrrigateSeason = (params: params) =>{
    return post('/api/IrrigateSeason/Find', params)
}
const deleteIrrigateSeason = (ids: string | number) =>{
    return post('/api/IrrigateSeason/Delete', ids)
}
type Params = {
    SeasonID: string | number,
    SeasonName: string,
    Round: string | number,
    BeginDT: string,
    EndDT: string,
}
const addIrrigateSeason = (params: Params) =>{
    return post('/api/IrrigateSeason/Add', params)
}
const modifyIrrigateSeason = (params: Params) =>{
    return post('/api/IrrigateSeason/Modify', params)
}

export {
    findAllIrrigateSeason,
    deleteIrrigateSeason,
    addIrrigateSeason,
    modifyIrrigateSeason,
}

