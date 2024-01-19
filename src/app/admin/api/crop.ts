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
const findAllCrop = (params: params) =>{
    return post('/api/Crop/Find', params)
}
const deleteCrop = (ids: string | number) =>{
    return post('/api/Crop/Delete', ids)
}
type Add = {
    CropID: string | number,
    CropName: string,
    BeginDT: string,
    EndDT: string,
    CropType: string | number,
    WaterQuota: string | number,
}
const addCrop = (params: Add) =>{
    return post('/api/Crop/Add', params)
}
const modifyCrop = (params: Add) =>{
    return post('/api/Crop/Modify', params)
}

export {
    findAllCrop,
    deleteCrop,
    addCrop,
    modifyCrop,
}

