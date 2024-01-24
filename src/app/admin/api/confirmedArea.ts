import {post} from "@/packages/http/request.ts"

const FindAllWaterAssociationRight = () =>{
    return post('/api/WaterAssociationRight/FindAll')
}
const FindWaterAssociationRight = (params: string | null) =>{
    return post('/api/WaterAssociationRight/Find', params)
}
const AddWaterAssociationRight = (params: object) =>{
    return post('/api/WaterAssociationRight/Add', params)
}
const ModifyWaterAssociationRight = (params: object) =>{
    return post('/api/WaterAssociationRight/Modify', params)
}
const DeleteWaterAssociationRight = (id: string | number) =>{
    return post('/api/WaterAssociationRight/Delete', id)
}

export {
    FindAllWaterAssociationRight,
    FindWaterAssociationRight,
    AddWaterAssociationRight,
    ModifyWaterAssociationRight,
    DeleteWaterAssociationRight,
}

