import {post} from "@/packages/http/request.ts"

const FindChannelRatio = (year: string | number) => {
    return post('/api/ChannelRatio/Find', 'and Year=' + year)
}
const FindAllChannelRatio = () => {
    return post('/api/ChannelRatio/FindAll')
}
const AddChannelRatio = (params: object) => {
    return post('/api/ChannelRatio/Add', params)
}
const ModifyChannelRatio = (params: object) => {
    return post('/api/ChannelRatio/Modify', params)
}
const DeletesChannelRatio = (params: object) => {
    return post('/api/ChannelRatio/Deletes', params)
}

export {
    FindChannelRatio,
    FindAllChannelRatio,
    AddChannelRatio,
    ModifyChannelRatio,
    DeletesChannelRatio,
}

