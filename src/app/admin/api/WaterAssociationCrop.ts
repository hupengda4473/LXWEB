import {post} from "@/packages/http/request.ts"

const FindAllChannelRatio = (year: string | number) => {
    return post('/api/WaterAssociationCrop/FindAll', year)
}
const AddWaterAssociationCrop = (params: object) => {
    return post('/api/WaterAssociationCrop/Add', params)
}
const ModifyWaterAssociationCrop = (params: object) => {
    return post('/api/WaterAssociationCrop/Modify', params)
}
const DeleteWaterAssociationCrop = (params: object) => {
    return post('/api/WaterAssociationCrop/Delete', params)
}

export {
    FindAllChannelRatio,
    AddWaterAssociationCrop,
    ModifyWaterAssociationCrop,
    DeleteWaterAssociationCrop,
}

