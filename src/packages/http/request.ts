import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios"
import axiosRetry from "axios-retry"
import { Session } from '@/packages/utils/storage'
import {requestUrl, SPECIAL_URL} from '@/app/admin/config/config'
import locaStore from "@/packages/utils/locaStore.ts"

const http: AxiosInstance = axios.create({
    baseURL: requestUrl,
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
        config.headers["Authorization"] = `token= ${token}`
    }
    return config
}, (error: AxiosError) => {
    return Promise.reject(error)
})

http.interceptors.response.use((response: AxiosResponse) => {
    const {code} = response.data
    if (code === 1) {
        return response.data
    }
    return response
}, (error: AxiosError) => {
    return Promise.reject(error)
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
