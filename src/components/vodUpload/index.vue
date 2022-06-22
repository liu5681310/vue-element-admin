<template>
  <div>
      <el-upload
      :auto-upload="true"
      action=""
      ref="upload"
      :headers="headers"
      :http-request="fnUploadRequest"
      drag
      :limit="1"
      :disabled="disabled"
      :before-remove="beforeRemove"
      :file-list="fileList"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">上传文件大小不能超过 1G</div>
    </el-upload>

    <el-progress v-if="progress" :text-inside="true" :stroke-width="24" :percentage="progress" status="success"></el-progress>

  </div>
</template>
<script>
import { getSign } from '@/api/common'
import {
    uploadOptions
} from '@/utils'
export default {
    props:{
        value:{
            type:String,
            default:""
        }
    },
    data () {
    return {
        fileList: [],
        disabled: false,
        headers:uploadOptions.headers,
        progress:0
    }
  },
  watch:{
      value(newVal,oldVal){
          this.fileList = [{
              name:newVal,
              url:newVal
          }]
      }
  },
  methods: {
      beforeRemove(file, fileList){
          this.progress = 0
      },
    fnUploadRequest (option) {
        this.disabled = true
        let getSignature = (callback) => {
            return getSign().then(res=>{
                return res.data
            })
        };
        const tcVod = new TcVod.default({
            getSignature:getSignature,
        });
        const uploader = tcVod.upload({
            mediaFile: option.file,
        });
        uploader.on("media_progress", (info) => {
            this.progress = info.percent * 100
        });
        uploader.done().then((doneResult) => {
            // 上传后的视频链接
            this.disabled = false
            this.$emit('success',doneResult.video.url)
         }).catch((err) => {
            this.disabled = false
            console.log('上传失败',err)
        });
    },
  },
};
</script>