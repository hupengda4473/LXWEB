import {post} from "@/packages/http/request.ts"

const findAllInstitution = () =>{
    return post('/api/Group/FindAll')
}
const getTree = (params: string | number) =>{
    return post('/api/Group/Tree', params)
}
interface AddParams{
    GroupID: string | number,
    GroupName: string,
    GroupCode: string,
    PID: string | number,
}
const addInstitution = (params: AddParams) =>{
    return post('/api/Group/Add', params)
}
const modifyInstitution = (params: AddParams) =>{
    return post('/api/Group/Modify', params)
}

const deleteInstitution = (params: string | number) =>{
    return post('/api/Group/Del', params)
}

export {
    findAllInstitution,
    getTree,
    addInstitution,
    modifyInstitution,
    deleteInstitution,
}

