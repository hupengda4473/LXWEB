import {RouteRecordRaw} from "vue-router"
import error404 from "@/app/admin/view/error/404"
import error403 from "@/app/admin/view/error/403"
import error500 from "@/app/admin/view/error/500"
import login from "@/packages/view/login/index.vue"
import demo from "@/packages/view/demo/index.vue"
import sku from "@/app/admin/view/sku/index.vue"
const routerMap: Array<RouteRecordRaw> = [
    {
        path: "/login", name: "login", meta: {title: "登录"},
        component: login,
    },
    {
        path: "/",
        name: "main",
        component: () => import("@/packages/layout/index.vue"),
        redirect: "home",
        children: [

        ],
    },
    {
        path: "/demo", name: "demo", meta: {title: "demo"},
        component: demo,
    },
    {
        path: "/sku", name: "sku", meta: {title: "登录"},
        component: sku,
    },
    {
        path: "/403",
        name: 'error403',
        meta: {title: "拒绝访问"},
        component: error403,
    },
    {
        path: "/500",
        name: 'error500',
        meta: {title: "网络错误"},
        component: error500,
    },
    {
        path: "/:pathMatch(.*)*",
        name: 'error404',
        meta: {title: "出错了"},
        component: error404,
    },
]

export default routerMap
