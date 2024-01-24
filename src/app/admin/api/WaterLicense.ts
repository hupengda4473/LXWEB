import {post} from "@/packages/http/request.ts"

const FindAllWaterLicense = () =>{
    return post('/api/WaterLicense/FindAll')
}
const DeleteWaterLicense = (ids: string | number) =>{
    return post('/api/WaterLicense/Delete', ids)
}
const AddWaterLicense = (params: object) =>{
    return post('/api/WaterLicense/Add', params)
}
const ModifyWaterLicense = (params: object) =>{
    return post('/api/WaterLicense/Modify', params)
}

export {
    FindAllWaterLicense,
    DeleteWaterLicense,
    AddWaterLicense,
    ModifyWaterLicense,
}

