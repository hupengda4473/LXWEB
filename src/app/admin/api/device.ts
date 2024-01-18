import {post} from "@/packages/http/request.ts"

const findAllDevice = () =>{
    return post('/api/DeviceInfo/FindAll')
}
interface Find{
    GroupID: string | number,
    Type: string,
    DeviceName: string,
}
const findDevice = (params: Find) =>{
    return post('/api/DeviceInfo/FindDevice', params)
}
const findNotRelationDevice = (params) =>{
    return post('/api/DeviceInfo/FindNotRelationDevice', params)
}
const deleteDevice = (ids: string | number) =>{
    return post('/api/DeviceInfo/Del', ids)
}
interface AddParams{
    DeviceName: string,
    DeviceCode: string,
    StationID: string | number,
    Type: string | number,
    DeviceGisNo: string | number,
    GroupID: string | number,
    LocationID: string | number,
    DeviceID: string | number,
    Img: string,
}
const addDevice = (params: AddParams) =>{
    return post('/api/DeviceInfo/Add', params)
}
const modifyDevice = (params: AddParams) =>{
    return post('/api/DeviceInfo/Modify', params)
}

export {
    findAllDevice,
    findDevice,
    findNotRelationDevice,
    deleteDevice,
    addDevice,
    modifyDevice,
}

