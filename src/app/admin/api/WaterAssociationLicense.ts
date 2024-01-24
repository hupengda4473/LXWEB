import {post} from "@/packages/http/request.ts"

type Song = {
    AssociationID: string | number,
    Licneses: string
}
const SaveLicense = (params: Song) =>{
    return post('/api/WaterAssociationLicense/SaveLicense', params)
}
const FindAllWaterAssociationLicense = () =>{
    return post('/api/WaterAssociationLicense/FindAll')
}
const FindWaterAssociationLicense = (params: string) =>{
    return post('/api/WaterAssociationLicense/Find', params)
}

export {
    SaveLicense,
    FindAllWaterAssociationLicense,
    FindWaterAssociationLicense,
}

