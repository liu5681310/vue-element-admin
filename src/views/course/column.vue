<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增专栏
      </el-button>
      <div>
        <el-select v-model="listQuery.status" placeholder="商品状态" clearable style="width: 90px;margin-right:10px;" class="filter-item">
        <el-option v-for="(item,k) in statusOptions" :key="k" :label="item" :value="k" />
      </el-select>
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
<el-table-column label="专栏内容" min-width="180px">
    <template slot-scope="{row}">
        <div style="display: flex;">
            <el-image :src="row.cover" style="width: 100px;height: 50px;margin-right: 10px;"></el-image>
            <div style="display: flex;flex-direction: column;justify-content: space-between;">
                <span>{{ row.title }}</span>
                <span style="color: red;">￥{{ row.price }}</span>
            </div>
        </div>
    </template>
</el-table-column>
<el-table-column label="更新状态" width="110px" align="center">
    <template slot-scope="{row}">
        <span :style="row.isend ? 'color:#333;' : 'color:red;'">{{ row.isend ? '已完结' : '连载中' }}</span>
    </template>
</el-table-column>
<el-table-column label="订阅量" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.sub_count }}</span>
    </template>
</el-table-column>
<el-table-column label="状态" class-name="status-col" width="100">
    <template slot-scope="{row}">
        <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status | statusFilter }}
        </el-tag>
    </template>
</el-table-column>
<el-table-column label="创建时间" width="150px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.created_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
           <el-button type="warning" size="mini" @click="openDetail(row)">
            目录
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status == 0" size="mini" type="success" @click="handleModifyStatus(row,1)">
            上架
          </el-button>
          <el-button v-if="row.status == 1" size="mini" @click="handleModifyStatus(row,0)">
            下架
          </el-button>
          <el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference">删除</el-button>
           </el-popconfirm>

        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="专栏标题" prop="title">
            <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="封面">
            <el-upload
            :action="uploadOptions.action"
            :headers="uploadOptions.headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleUploadRemove"
            :on-success="handleUploadSuccess"
            :fileList="fileList">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item label="专栏介绍" prop="try">
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入专栏介绍"
                v-model="temp.try">
            /</el-input>
        </el-form-item>
        <el-form-item label="专栏内容" prop="content">
            <tinymce v-if="dialogFormVisible" v-model="temp.content" :height="300" :width="600" />
        </el-form-item>
        <el-form-item label="专栏价格">
            <el-input-number v-model="temp.price" :precision="2" :step="0.1" :min="0" label="价格"></el-input-number>
        </el-form-item>
        <el-form-item label="划线价格">
            <el-input-number v-model="temp.t_price" :precision="2" :step="0.1" :min="0" label="划线价格"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
             <el-radio-group v-model="temp.status">
                <el-radio :label="0">下架</el-radio>
                <el-radio :label="1">上架</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="更新状态">
             <el-radio-group v-model="temp.isend">
                <el-radio :label="0">连载中</el-radio>
                <el-radio :label="1">已完结</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="dialogBtnLoading">
            {{ dialogBtnLoading ? '提交中...' : '提交' }}
        </el-button>
    </div>
</el-dialog>

</div>
</template>

<script>
    import {
        fetchList,
        createColumn,
        updateColumn,
        deleteColumn,
        updateStatus
    } from '@/api/column'

    import waves from '@/directive/waves' // waves directive
    import Tinymce from '@/components/Tinymce'
    import {
        parseTime,
        uploadOptions
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    const statusOptions = {
        0:"已下架",
        1:"已上架"
    }


    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            Tinymce
        },
        directives: {
            waves
        },
        filters: {
            statusFilter(status) {
                return statusOptions[status]
            },
        },
        data() {
            return {
                dialogBtnLoading:false,
                uploadOptions,
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    status: undefined,
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
                statusOptions,
                showReviewer: false,
                temp: {
                    id: undefined,
                    title: '',
                    status: 1,
                    price:0.00,
                    t_price:0.00,
                    try:"",
                    content:"",
                    cover:"",
                    isend:0
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
                        message: '标题不能为空',
                        trigger: 'blur'
                    }],
                    try: [{
                        required: true,
                        message: '试看内容不能为空',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '课程内容不能为空',
                        trigger: 'blur'
                    }],
                },
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: []
            }
        },
        created() {
            this.getList()
        },
        methods: {
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
            handleModifyStatus(row, status) {
                this.listLoading = true
                updateStatus({
                    id:row.id,
                    status
                }).then(res=>{
                    this.$message({
                        message: '操作Success',
                        type: 'success'
                    })
                    row.status = status
                }).finally(()=>{
                    this.listLoading = false
                })
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
                    status: 1,
                    price:0.00,
                    t_price:0.00,
                    try:"",
                    content:"",
                    cover:"",
                    isend:0
                }
                this.fileList = []
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
                        createColumn(this.temp).then(() => {
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
                    this.fileList = [{
                        name:this.temp.cover,
                        url:this.temp.cover
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
                        updateColumn(tempData).then(() => {
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
                this.listLoading = true
                deleteColumn({
                    ids:[row.id]
                }).then(response=>{
                    this.$notify({
                        title: '提示',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.list.splice(index, 1)
                }).finally(()=>{
                    this.listLoading = false
                })
            },
            getSortClass: function(key) {
                const sort = this.listQuery.sort
                return sort === `+${key}` ? 'ascending' : 'descending'
            },
            handleUploadRemove(file, fileList) {
                this.fileList = []
                this.temp.cover = ''
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleUploadSuccess(response, file, fileList){
                if(response.msg == 'fail'){
                    this.fileList = []
                    return this.$message.error('上传失败');
                }
                this.temp.cover = response.data
                this.fileList = [{
                    name:response.data,
                    url:response.data
                }]
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handleUploadChange(file, fileList) {
                this.fileList = fileList.slice(-3);
            },
            openDetail(row){
                this.$router.push({
                    name:"ColumnDetail",
                    query:{
                        id:row.id
                    }
                })
            }
        }
    }
</script>
