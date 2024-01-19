import {post} from "@/packages/http/request.ts"

const findAllChannel = () =>{
    return post('/api/Channel/Find')
}
const deleteChannel = (ids: string | number) =>{
    return post('/api/Channel/Del', ids)
}

export {
    findAllChannel,
    deleteChannel,
}

