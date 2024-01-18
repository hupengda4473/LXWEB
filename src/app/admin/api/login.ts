import {post} from "@/packages/http/request.ts"

const login = (params: object) => {
    return post('/api/User/ValidUser', params)
}

export {
    login,
}
