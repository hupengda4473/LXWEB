import {post} from "@/packages/http/request.ts"

type Params = {
    PageSize: number,
    PageIndex: number,
    UserId: any,
}
const FindByUserId = (params: Params) => {
    return post('/api/DispatchInstruction/FindByUserId', params)
}
const AddDispatchInstruction = (params: object) => {
    return post('/api/DispatchInstruction/Add', params)
}
const ModifyDispatchInstruction = (params: object) => {
    return post('/api/DispatchInstruction/Modify', params)
}
const DeleteDispatchInstruction = (ids: string | number) => {
    return post('/api/DispatchInstruction/Delete', ids)
}
const Feedback = (params: object) => {
    return post('/api/DispatchInstruction/Feedback', params)
}
const SignDispatchInstruction = (id: string | number) => {
    return post('/api/DispatchInstruction/Sign', id)
}

export {
    FindByUserId,
    AddDispatchInstruction,
    ModifyDispatchInstruction,
    DeleteDispatchInstruction,
    Feedback,
    SignDispatchInstruction,
}
