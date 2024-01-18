import {RouteRecordRaw} from "vue-router"
import error from "@/packages/view/error/404.vue"
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
        path: "/:pathMatch(.*)*", meta: {title: "出错了"},
        component: error,
    },
]

export default routerMap
