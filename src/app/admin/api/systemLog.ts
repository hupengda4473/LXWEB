import {post} from "@/packages/http/request.ts"

const findAllSystemLog = ( ) =>{
    return post('/api/SystemLog/FindAll')
}

export {
    findAllSystemLog,
}
