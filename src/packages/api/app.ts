import {post} from "@/packages/http/request.ts"

const menus = (userId: number) => {
    return post("/api/Menu/FindByUserID", userId)
}

const userInfo = (userId: number) =>{
    return post('/api/User/FindByID', userId)
}

export {
    login,
    menus,
    userInfo
}
