<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增直播间
      </el-button>
      <div>
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      </div>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
</el-table-column>
<el-table-column label="直播间内容" min-width="180px">
    <template slot-scope="{row}">
        <div style="display: flex;">
            <img :src="row.cover" style="width: 100px;height: 50px;margin-right: 10px;">
            <div style="display: flex;flex-direction: column;justify-content: space-between;">
                <span>{{ row.title }}</span>
                <span style="color: red;">￥{{ row.price }}</span>
            </div>
        </div>
        <div style="margin-top: 10px;">
          <el-button type="success" size="mini" :disabled="row.status != '直播中'" @click="getInfo(row.id)">获取拉流推流地址</el-button>
        </div>
        <div style="margin-top: 10px;">
          <el-tag size="small" type="info">
            直播时间段：
              {{ row.start_time }} <span style="margin: 0 10px;">~</span> {{ row.end_time }}
          </el-tag>
        </div>
    </template>
</el-table-column>
<el-table-column label="订阅量" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.sub_count }}</span>
    </template>
</el-table-column>
<el-table-column label="状态" class-name="status-col" width="100">
    <template slot-scope="{row}">
        <el-tag :type="row.status == '直播中' ? 'success' : 'danger'">
            {{ row.status }}
        </el-tag>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)" :disabled="row.status != '未开始'">
            编辑
          </el-button>
          <el-popconfirm v-if="row.status != '直播中'" title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference">删除</el-button>
           </el-popconfirm>

        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="直播标题" prop="title">
            <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="直播封面">
            <el-upload
            :action="uploadOptions.action"
            :headers="uploadOptions.headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleUploadRemove"
            :on-success="handleUploadSuccess"
            :fileList="fileList1">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
            </el-dialog>
        </el-form-item>
        <el-form-item label="直播介绍" prop="try">
            <tinymce v-if="dialogFormVisible" v-model="temp.try" :height="300" :width="600" />
        </el-form-item>
        <el-form-item label="直播价格">
            <el-input-number v-model="temp.price" :precision="2" :step="0.1" :min="0" label="价格"></el-input-number>
        </el-form-item>
        <el-form-item label="划线价格">
            <el-input-number v-model="temp.t_price" :precision="2" :step="0.1" :min="0" label="划线价格"></el-input-number>
        </el-form-item>
        <el-form-item label="直播时间">
            <el-date-picker v-model="timerange" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="dialogBtnLoading">
            提交
        </el-button>
    </div>
</el-dialog>

    <el-dialog title="推流拉流地址" :visible.sync="infoModel">
      <div>
        <el-input :value="infoModelData.pushUrl" readonly>
          <template slot="prepend">推流地址：</template>
          <el-button slot="append" type="primary" @click="handleCopy(infoModelData.pushUrl,$event)">复制</el-button>
        </el-input>
      </div>
      <div style="margin-top: 20px;">
        <el-input :value="infoModelData.playUrl" readonly>
          <template slot="prepend">拉流地址：</template>
          <el-button slot="append" type="primary" @click="handleCopy(infoModelData.playUrl,$event)">复制</el-button>
        </el-input>
      </div>
    </el-dialog>

</div>
</template>

<script>
    import {
        fetchList,
        createLive,
        updateLive,
        deleteLive,
        readLive,
    } from '@/api/live'

    import waves from '@/directive/waves' // waves directive
    import Tinymce from '@/components/Tinymce'
    import {
        parseTime,
        uploadOptions
    } from '@/utils'
    import Pagination from '@/components/Pagination'

    import vodUpload from '@/components/vodUpload'
    import clip from '@/utils/clipboard'
    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            Tinymce,
            vodUpload
        },
        directives: {
            waves
        },
        data() {
            return {
                uploadOptions,
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    title: undefined,
                    sort: '-id'
                },
                sortOptions: [{
                    label: 'ID Ascending',
                    key: '+id'
                }, {
                    label: 'ID Descending',
                    key: '-id'
                }],
                showReviewer: false,
                temp: {
                    id: undefined,
                    title: '',
                    price:0.00,
                    t_price:0.00,
                    try:"",
                    cover:"",
                    start_time: '',
                    end_time: '',
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    create: '新增'
                },
                rules: {
                    title: [{
                        required: true,
                        message: '直播标题不能为空',
                        trigger: 'blur'
                    }],
                    try: [{
                        required: true,
                        message: '直播介绍不能为空',
                        trigger: 'blur'
                    }],
                },
                dialogImageUrl: '',
                dialogVisible: false,
                fileList1: [],
                fileList2: [],
                dialogBtnLoading:false,

                infoModel:false,
                infoModelData:{
                  playUrl:"",
                  pushUrl:""
                }
            }
        },
        computed: {
            timerange: {
                get() {
                    return [this.temp.start_time, this.temp.end_time]
                },
                set(val) {
                    this.temp.start_time = val[0]
                    this.temp.end_time = val[1]
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
          handleCopy(text, event) {
            clip(text, event)
          },
          getInfo(id) {
              this.listLoading = true
              readLive({ id }).then(response => {
                  let { playUrl,pushUrl } = response.data
                  this.infoModel = true
                  this.infoModelData = {
                    playUrl,
                    pushUrl
                  }
                  this.listLoading = false
              })
          },
            getList() {
                this.listLoading = true
                fetchList(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.items
                    this.total = response.data.total

                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            sortChange(data) {
                const {
                    prop,
                    order
                } = data
                if (prop === 'id') {
                    this.sortByID(order)
                }
            },
            sortByID(order) {
                if (order === 'ascending') {
                    this.listQuery.sort = '+id'
                } else {
                    this.listQuery.sort = '-id'
                }
                this.handleFilter()
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    title: '',
                    price:0.00,
                    t_price:0.00,
                    try:"",
                    cover:"",
                    start_time: '',
                    end_time: '',
                }
                this.fileList1 = []
            },
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.dialogBtnLoading = true
                        createLive(this.temp).then(() => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: 'Created Successfully',
                                type: 'success',
                                duration: 2000
                            })
                        }).finally(()=>{
                            this.dialogBtnLoading = false
                        })
                    }
                })
            },
            handleUpdate(row) {
                this.temp = Object.assign({}, row) // copy obj
                if(this.temp.cover){
                    this.fileList1 = [{
                        name:this.temp.cover,
                        url:this.temp.cover,
                    }]
                }
                if(this.temp.content){
                    this.fileList2 = [{
                        name:this.temp.content,
                        url:this.temp.content,
                    }]
                }
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        this.dialogBtnLoading = true
                        updateLive(tempData).then(() => {
                            const index = this.list.findIndex(v => v.id === this.temp.id)
                            this.list.splice(index, 1, this.temp)
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: 'Update Successfully',
                                type: 'success',
                                duration: 2000
                            })
                        }).finally(()=>{
                            this.dialogBtnLoading = false
                        })
                    }
                })
            },
            handleDelete(row, index) {
                deleteLive({
                    ids:[row.id]
                }).then(response=>{
                    this.$notify({
                        title: '提示',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.list.splice(index, 1)
                })
            },
            getSortClass: function(key) {
                const sort = this.listQuery.sort
                return sort === `+${key}` ? 'ascending' : 'descending'
            },
            handleUploadRemove(file, fileList) {
                this.fileList1 = []
                this.temp.cover = ''
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleUploadSuccess(response, file, fileList){
                if(response.msg == 'fail'){
                    this.fileList1 = []
                    this.temp.cover = ''
                    return this.$message.error('上传失败');
                }
                this.temp.cover = response.data
                this.fileList1 = [{
                    name:response.data,
                    url:response.data
                }]
            },
            handleRemove(file, fileList) {
                this.fileList2 = []
                this.temp.content = ''
            },
            handleUploadChange(file, fileList) {
                this.fileList = fileList.slice(-3);
            },
            handleVideoUploadSuccess(response, file, fileList){
                if(response.msg == 'fail'){
                    this.fileList2 = []
                    this.temp.content = ''
                    return this.$message.error('上传失败');
                }
                this.temp.content = response.data
                this.fileList2 = [{
                    name:response.data,
                    url:response.data
                }]
            }
        }
    }
</script>
