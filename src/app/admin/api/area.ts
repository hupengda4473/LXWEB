import {post} from "@/packages/http/request.ts"

const findAllArea = () =>{
    return post('/api/AdministrativeArea/FindAll')
}
const getTree = (params: string | number) =>{
    return post('/api/AdministrativeArea/Tree', params)
}
interface AddParams{
    AreaID: string | number,
    AreaCode: string | number,
    AreaName: string,
    Pid: string | number | null,
}
const addArea = (params: AddParams) =>{
    return post('/api/AdministrativeArea/Add', params)
}
const modifyArea = (params: AddParams) =>{
    return post('/api/AdministrativeArea/Modify', params)
}
const deleteArea = (params: string | number) =>{
    return post('/api/AdministrativeArea/Del', params)
}

export {
    findAllArea,
    getTree,
    addArea,
    modifyArea,
    deleteArea,
}

