import {post} from "@/packages/http/request.ts"

const getAllMenus = ()=>{
    return post('/api/Menu/FindAll')
}
const deleteMenus = (ids: (string | number))=>{
    return post('/api/Menu/Del', ids)
}
const addMenus = (data: object)=>{
    return post('/api/Menu/Add', data)
}
const editMenus = (data: object)=>{
    return post('/api/Menu/Modify', data)
}

export {
    getAllMenus,
    deleteMenus,
    addMenus,
    editMenus,
}

