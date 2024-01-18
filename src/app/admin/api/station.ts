import {post} from "@/packages/http/request.ts"

const findAllLocation = (params: object) =>{
    return post('/api/Location/Find', params)
}
const AddLocation = (params: object) =>{
    return post('/api/Location/Add', params)
}
const modifyLocation = (params: object) =>{
    return post('/api/Location/Modify', params)
}
const delLocation = (params: object) =>{
    return post('/api/Location/Del', params)
}

export {
    findAllLocation,
    AddLocation,
    modifyLocation,
    delLocation,
}

