import {post} from "@/packages/http/request.ts"

type Add = {
    MenuID: string | number,
    UserID: string | number,
}
const addLog = (params: Add) =>{
    return post('/api/ApplicationLog/Add', params)
}
const findAllLog = () =>{
    return post('/api/ApplicationLog/FindAll')
}

export {
    addLog,
    findAllLog,
}

