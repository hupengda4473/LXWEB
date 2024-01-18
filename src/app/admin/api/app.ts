import {post} from "@/packages/http/request.ts"
import apiMap from "@/app/admin/api/apiMap.ts"

const member = () => {
    return post(apiMap.member)
}
const role = ()=>{
    return post(apiMap.role)
}

const branch = ()=>{
    return post(apiMap.branch)
}

const menus = ()=>{
    return post('/api/Menu/FindAll')
}

const dictionary = ()=>{
    return post(apiMap.dictionary)
}




export {
    member,
    role,
    branch,
    menus,
    dictionary
}
