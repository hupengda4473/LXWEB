<template>
    <n-card :bordered="false" style="height: 100%" content-style="padding:0;height:100%">
        <div class="login" ref="loginRef">
            <div class="login-container">
                <div class="slide-right">
                    <n-h1>欢迎您登录</n-h1>
                    <n-form autocomplete="off" :rules="compData.rules" ref="formRef" class="login-form" layout="vertical" :model="compData.form">
                        <n-form-item label="你的账户" path="username" name="username">
                            <n-input size="large" :maxlength="12" autocomplete="off" v-model:value="compData.form.username" placeholder="输入你的账户"></n-input>
                        </n-form-item>
                        <n-form-item label="你的密码" path="password" name="password">
                            <n-input size="large" :show-password-on="'click'" type="password" autocomplete="off" v-model:value="compData.form.password" placeholder="输入你的密码"></n-input>
                        </n-form-item>
                    </n-form>
                    <n-space justify="space-between" :size="[10,15]" vertical>
                        <n-button size="large" style="width: 100%" @click="handleLogin">登录</n-button>
                    </n-space>
                </div>
            </div>
        </div>
    </n-card>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted, onUnmounted} from "vue"
import {useRouter} from "vue-router"
import locaStore from "@/packages/utils/locaStore.ts"
import {login} from "@/app/admin/api/login.ts"
import appPinia from "@/packages/pinia/app"
import {useMessage, FormInst} from "naive-ui"
import * as THREE from "three"
import WAVES from "vanta/dist/vanta.net.min"

let vantaEffect
const loginRef = ref(null)
const formRef = ref<FormInst | null>(null)
const router = useRouter()
const message = useMessage()
const compData = reactive({
    form: {
        username: "admin",
        password: "123"
    },
    rules: {
        username: [
            {required: true, message: "请输入你的用户名", trigger: "blur"},
            {message: "最小长度为2，最大长度12", trigger: "blur"},
        ],
        password: [{required: true, message: "输入用户名密码", trigger: "blur"}],
    },
})

const handleLogin = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            login({
                UserName: compData.form.username,
                PassWord: compData.form.password,
            }).then(res => {
                message.success("登录成功")
                const appStore = appPinia()
                let data = res.data
                let Message = JSON.parse(data.Message) || {}
                appStore.userInfo = Message
                locaStore.set("token_lx_web", data.token, 86400)
                locaStore.set("userId_lx_web", Message.UserID, 86400)
                router.push("/home")
            })
        }
    })
}

onMounted( () => {
    vantaEffect = WAVES({
        el: loginRef.value,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x3ff3ff,
        vertexColors: 0x417dc8,
        backgroundColor: 0x100a1b,
        points: 11.00
    })
})
onUnmounted(() => {
    if (vantaEffect) {
        vantaEffect.destroy()
    }
})
</script>
<style lang="less">
.login {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .login-container {
        background-color: #fff;
        padding: 24px;
        border-radius: 10px;
        width: 15%;
        height: auto;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        position: relative;
    }
}
</style>
