<template>
    <div>
        <el-dialog
        title="上传图片"
        :visible.sync="uploadDialogVisible"
        width="60%"
        :modal-append-to-body="false"
        append-to-body
        @close="onClose">
            <el-upload
            :action="uploadOptions.action"
            :headers="uploadOptions.headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleOnSuccess"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
            </el-upload>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false"
        append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import {
    uploadOptions
} from '@/utils'
export default {
    data() {
        return {
            uploadOptions,
            uploadDialogVisible:false,
            dialogImageUrl: '',
            dialogVisible: false,
            callback:null,
            fileList:[]
        }
    },
    methods:{
        onClose(){
            this.fileList = []
        },
        open(callback,url = false){
            this.callback = callback
            if(url){
                this.fileList.push({
                    name:url,
                    url
                })
            }
            this.uploadDialogVisible = true
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleOnSuccess(response, file, fileList){
            this.callback(response.data)
            this.uploadDialogVisible = false
        }
    }
}
</script>