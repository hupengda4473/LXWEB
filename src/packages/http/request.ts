import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios"
import axiosRetry from "axios-retry"
import router from "@/app/admin/router"
import locaStore from "@/packages/utils/locaStore.ts"

const http: AxiosInstance = axios.create({
    baseURL: '',
    timeout: 50000,
    headers: { 'Content-Type': 'application/json' },
})

axiosRetry(http, {
    retries: 3,
    shouldResetTimeout: true,
    retryDelay: (retryCount) => retryCount * 1500 // 间隔时间
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = locaStore.get('token_lx_web')
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}, (error: AxiosError) => {
    return Promise.reject(error)
})


const codeErrorHandle = (resData) => {
    switch (resData) {
    case 404:
        router.push({
            name: 'error404'
        })
        break
    case 403:
        router.push({
            name: 'error403'
        })
        break
    case 500:
        router.push({
            name: 'error500'
        })
        break
    default:
    }
}

http.interceptors.response.use((response: AxiosResponse) => {
    const {code} = response.data
    if (code === 1) {
        return response.data
    }
    return response
}, (error: AxiosError) => {
    console.log(error)
    if (error.response.status === 500){
        codeErrorHandle(error.response.status)
    }else {
        return Promise.reject(error)
    }
})

const post = (url: string, params?: any, config?: AxiosRequestConfig) => {
    return http.post(url, params, config)
}

const get = (url: string, params?: any, config?: AxiosRequestConfig) => {
    return http.get(url, {params, ...config})
}

export {
    post,
    get,
    http as axios,
}
