<template>
    <div class="filePageContent" ref="pageContentRef">
        <n-modal v-model:show="compData.showAddModal" ref="modalRef">
            <n-card
                style="width: 60%;"
                header-style="text-align: center;"
                footer-style="text-align: center;"
                :title="compData.fileData.name"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
            >
                <!-- word查看详情 -->
                <div
                    class="scrollbar"
                    id="wordView"
                    :style="{height: pageContentHeight + 'px'}"
                    v-html="compData.vHtml"
                    v-if="compData.fileType === 1"
                />
                <!-- excel查看详情 -->
                <div id="excelTable" v-if="compData.fileType === 2">
                    <n-data-table :columns="columns" :data="compData.excelData" :max-height="pageContentHeight"></n-data-table>
                </div>
                <!-- txt查看详情 -->
                <div
                    class="scrollbar"
                    :style="{height: pageContentHeight + 'px'}"
                    v-if="compData.fileType === 3">

                    <pre>{{compData.txtContent}}</pre>
                </div>
                <!-- pdf查看详情 -->
                <div
                    class="scrollbar hidden"
                    :style="{height: pageContentHeight + 'px'}"
                    v-if="compData.fileType === 4">
                    <iframe :src="compData.fileData.url" frameborder="0" height="100%" width="100%"></iframe>
                </div>
                <template #footer>
                    <n-flex justify="end">
                        <n-space>
                            <n-button type="success" @click="downloadFun">下载</n-button>
                            <n-button @click="compData.showAddModal = false">关闭</n-button>
                        </n-space>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import {defineExpose, nextTick, reactive, ref} from "vue"
import axios from 'axios'
import * as XLSX from 'xlsx'
import mammoth from "mammoth"

const pageContentRef = ref(null)
const pageContentHeight = ref(0)

type CompData = {
    showAddModal: boolean,
    fileData: object,
    vHtml: any,
    excelData: any,
    workbook: any,
    fileType: string | number,
    timeFormat: string,
    txtContent: any
}
const compData = reactive<CompData>({
    showAddModal: false,
    fileData: {},
    vHtml: '',
    fileType: 0,
    excelData: [],
    workbook: {},
    timeFormat: '',
    txtContent: ''
})

const columns = ref([])

/*
* 初始化弹窗
* data 后台返回文件数据
* format excel表格中时间的格式
* */
const viewFile = (data: object, modalHeight,format?: string) => {
    compData.showAddModal = true
    compData.fileData = data
    compData.timeFormat = format || 'yyyy-MM-dd'
    pageContentHeight.value = modalHeight - 240
    if (data.type === ".docx" || data.type === ".doc") {
        compData.fileType = 1
        readWorkbookFromRemoteFile(data.url)
    }
    if (data.type === ".xlsx" || data.type === ".xls") {
        compData.fileType = 2
        readExcelFromRemoteFile(data.url)
    }
    if (data.type === ".txt" || data.type === ".text") {
        compData.fileType = 3
        readTxtFile(data.url)
    }
    if (data.type === ".pdf") {
        compData.fileType = 4
        // readTxtFile(data.url)
    }
}

const readWorkbookFromRemoteFile = (url: string) => {
    let xhr = new XMLHttpRequest()
    xhr.open("get", url, true)
    xhr.responseType = "arraybuffer"
    xhr.onload = function () {
        if (xhr.status == 200) {
            mammoth
                .convertToHtml({arrayBuffer: new Uint8Array(xhr.response)})
                .then(function (resultObject) {
                    nextTick(() => {
                        compData.vHtml = resultObject.value
                    })
                })
        }
    }
    xhr.send()
}

const readExcelFromRemoteFile = (url: string) => {
    let xhr = new XMLHttpRequest()
    xhr.open("get", url, true)
    xhr.responseType = "arraybuffer"
    xhr.onload = function () {
        if (xhr.status === 200) {
            let data = new Uint8Array(xhr.response)
            let workbook = XLSX.read(data, {type: "array", cellDates: true,})
            let sheetNames = workbook.SheetNames
            compData.workbook = workbook
            getTable(sheetNames[0])
        }
    }
    xhr.send()
}

const getTable = (sheetName: any) => {
    let worksheet = compData.workbook.Sheets[sheetName]
    let allData = XLSX.utils.sheet_to_json(worksheet)
    let tableData = allData.slice(1)
    columns.value = []
    let arr = []
    let str = []
    for (let index in allData[0]) {
        let item = allData[0][index]
        if (item.includes('时间')){
            str.push(index)
        }
        arr.push({
            title: item,
            key: index,
        })
    }
    columns.value = arr

    for (let index in tableData) {
        let item = tableData[index]
        for (let index2 in item) {
            let item2 = item[index2]
            if (str.find( item3 => item3 == index2)){
                item[index2] = new Date(item2).format(compData.timeFormat)
            }
        }
    }
    compData.excelData = tableData
}

const readTxtFile = (url: string) => {
    axios.get(url,{
        responseType:"text",
        transformResponse: [
            async function (data) {
                compData.txtContent = data
            },
        ],
    })
}

const downloadFun = () => {

    if (compData.fileData.type === ".txt" || compData.fileData.type === ".text"){
        let xmlHttp = null
        xmlHttp = new XMLHttpRequest()
        if (xmlHttp != null) {
            xmlHttp.open('get', compData.fileData.url, true)
            xmlHttp.send()
            xmlHttp.onreadystatechange = doResult //设置回调函数
        }
        function doResult() {
            if (xmlHttp.readyState == 4) { //4表示执行完成
                if (xmlHttp.status == 200) { //200表示执行成功
                    let aLink = document.createElement('a')
                    aLink.download = compData.fileData.name //设置a标签的下载名字
                    aLink.style.display = 'none'
                    let blob = new Blob([xmlHttp.responseText])
                    aLink.href = URL.createObjectURL(blob)
                    document.body.appendChild(aLink)
                    aLink.click()
                    document.body.removeChild(aLink)
                }
            }
        }
    }else {
        window.open(encodeURI(compData.fileData.url))
    }
}

defineExpose({
    viewFile,
})
</script>

<style scoped lang="less">
.filePageContent{
    .scrollbar{
        overflow-y: auto;
        &.hidden{
            overflow: hidden;
        }
    }
    .scrollbar::-webkit-scrollbar {
        width: 5px;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background: #999999;
        border-radius: 5px;
    }
}
</style>
