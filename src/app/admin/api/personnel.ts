import {post} from "@/packages/http/request.ts"

const getAllPersonnel = () => {
    return post('/api/Person/FindAll')
}
const addPersonnel = (params: object) => {
    return post('/api/Person/Add', params)
}
const modifyPersonnel = (params: object) => {
    return post('/api/Person/Modify', params)
}
const deletePersonnel = (ids: string | number) => {
    return post('/api/Person/Del', ids)
}

export {
    getAllPersonnel,
    addPersonnel,
    modifyPersonnel,
    deletePersonnel,
}

