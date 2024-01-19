import {post} from "@/packages/http/request.ts"

const findAllLog = ( ) =>{
    return post('/api/Log/FindAll')
}

export {
    findAllLog,
}
