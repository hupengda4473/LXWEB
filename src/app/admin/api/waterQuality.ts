import {post} from "@/packages/http/request.ts"

type Params = {
    PageSize: number,
    PageIndex: number,
    LocationId: number | string,
    CollectionTime: string [],
}
type Song = {
    paramId: number | string | null,
    paramName: string,
    paramSymbol: string,
    paramUnit: string,
    description: string,
    lowerLimit: string | number,
    upperLimit: string | number,
}
const HistoryDataWaterQuality = (params: Params) =>{
    return post('/api/WaterQuality/HistoryData', params)
}
const LiveDataWaterQuality = () =>{
    return post('/api/WaterQuality/LiveData')
}
const DeleteWaterQuality = (ids: string | number) =>{
    return post('/api/WaterQuality/Delete', ids)
}
const AddWaterQuality = (params: object) =>{
    return post('/api/WaterQuality/Add', params)
}
const ModifyWaterQuality = (params: object) =>{
    return post('/api/WaterQuality/Modify', params)
}
const ListParams = () =>{
    return post('/api/WaterQuality/ListParams')
}
const AddParam = (params: Song) =>{
    return post('/api/WaterQuality/AddParam', params)
}
const ModifyParam = (params: Song) =>{
    return post('/api/WaterQuality/ModifyParam', params)
}
const DeleteParam = (ids: string | number) =>{
    return post('/api/WaterQuality/DeleteParam', ids)
}

export {
    HistoryDataWaterQuality,
    LiveDataWaterQuality,
    DeleteWaterQuality,
    AddWaterQuality,
    ModifyWaterQuality,
    ListParams,
    AddParam,
    ModifyParam,
    DeleteParam,
}

