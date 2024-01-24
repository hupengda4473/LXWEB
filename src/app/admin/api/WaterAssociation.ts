import {post} from "@/packages/http/request.ts"

const FindAllWaterAssociation = () =>{
    return post('/api/WaterAssociation/FindAll')
}
const DeleteWaterAssociation = (ids: string | number) =>{
    return post('/api/WaterAssociation/Delete', ids)
}
const AddWaterAssociation = (params: object) =>{
    return post('/api/WaterAssociation/Add', params)
}
const ModifyWaterAssociation = (params: object) =>{
    return post('/api/WaterAssociation/Modify', params)
}

export {
    FindAllWaterAssociation,
    DeleteWaterAssociation,
    AddWaterAssociation,
    ModifyWaterAssociation,
}

