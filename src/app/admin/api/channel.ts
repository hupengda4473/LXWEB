import {post} from "@/packages/http/request.ts"

type AddParams = {
    PageSize: number,
    PageIndex: number,
    OrderField: string,
    OrderType: string | number,
    BeginDT: string,
    EndDT: string,
    FuzzyName: string,
    UserID: string | number
}
const findAllChannel = (params: AddParams) =>{
    return post('/api/Channel/Find', params)
}
const deleteChannel = (ids: string | number) =>{
    return post('/api/Channel/Delete', ids)
}
const addChannel = (ids: string | number) =>{
    return post('/api/Channel/Add', ids)
}
const modifyChannel = (ids: string | number) =>{
    return post('/api/Channel/Modify', ids)
}

export {
    findAllChannel,
    deleteChannel,
    addChannel,
    modifyChannel,
}

