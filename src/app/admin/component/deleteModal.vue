<template>
    <n-modal
        v-model:show="modalData.showModalStatus"
        iconPlacement="left"
        :mask-closable="false"
        type="warning"
        preset="dialog"
        title="删除确认"
        :content="modalData.title"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="modalData.showModalStatus = false"
    />
</template>

<script setup>
import {defineExpose, reactive} from "vue"

const modalData = reactive({
    showModalStatus: false,
    title: '',
    fun: null,
})

const openDeleteModal = (title, deleteFun) => {
    modalData.showModalStatus = true
    modalData.title = title || '确定要删除所选数据吗？'
    modalData.fun = deleteFun
}

defineExpose({
    openDeleteModal,
})

//确认
const onPositiveClick = () => {
    modalData.fun()
}
</script>

<style scoped>

</style>
