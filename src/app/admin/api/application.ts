import {post} from "@/packages/http/request.ts"

const findAllApplicationLog = ( ) =>{
    return post('/api/ApplicationLog/FindAll')
}

export {
    findAllApplicationLog,
}

