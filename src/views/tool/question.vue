<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <div>
           <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" @click="handleCreate">
        新增题目
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" size="mini" @click="handleDeleteAll">
        批量删除
      </el-button>


<el-upload
  class="upload-demo"
  :action="uploadOptions.importExcelAction"
  :headers="uploadOptions.headers"
  :limit="1"
  :on-success="handleUploadFileSuccess"
  :on-error="handleUploadFileError">
  <el-button size="small" type="primary">导入题目</el-button>
  <div slot="tip" class="el-upload__tip">
      <a href="/QuestionImportTemplate.xlsx" target="_blank">下载导入模板</a>
  </div>
</el-upload>

       </div>
      <div>
        <el-select size="small" v-model="listQuery.type" placeholder="题目类型" clearable style="width: 120px;margin-right:10px;" class="filter-item">
        <el-option v-for="(item,k) in typeOptions" :key="k" :label="item" :value="k" />
      </el-select>
      <el-input size="small" v-model="listQuery.title" placeholder="题目标题" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
    <el-table-column
type="selection"
width="55">
</el-table-column>
<el-table-column label="类型" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.type | typeFilter}}</span>
    </template>
</el-table-column>
<el-table-column label="题目" min-width="180px">
    <template slot-scope="{row}">
    <div v-html="row.title"></div>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference">删除</el-button>
           </el-popconfirm>
          
        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-form-item label="题目" prop="title">
            <tinymce-plus v-model="temp.title" :width="800" :height="200"/>
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
            <el-radio-group v-model="temp.type" size="small" @change="handleTypeChange">
                <el-radio-button :label="key" v-for="(val,key) in typeOptions" :key="key">{{ val }}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="题目答案">
             <el-table :data="temp.value.options" style="width: 100%" border>
                <el-table-column label="是否答案" width="80" align="center"
                v-if="temp.type != 'answer'">
                    <template slot-scope="{ row,$index }">
                        <el-radio v-if="temp.type == 'radio' || temp.type == 'trueOrfalse'" v-model="temp.value.value" :label="$index">
                            {{ $index | indexFilter }}
                        </el-radio>
                        <el-checkbox v-else-if="temp.type == 'checkbox'" v-model="temp.value.value" :label="$index">
                            {{ $index | indexFilter }}
                        </el-checkbox>
                        <span v-else>{{ $index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="答案">
                    <template slot-scope="{ row,$index }">
                        <tinymce-plus v-model="temp.value.options[$index]" :width="800" :height="200"/>
                    </template>
                </el-table-column>
                <el-table-column width="80" align="center"
                v-if="temp.type != 'answer' && temp.type != 'trueOrfalse'">
                    <template slot-scope="{ row,$index }">
                        <el-popconfirm title="是否要删除该记录？" @onConfirm="delQuestion($index)">
                            <span slot="reference" class="el-icon-delete-solid"></span>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="add-questionval" @click="addQuestionVal"
            v-if="temp.type != 'answer' && temp.type != 'trueOrfalse'">
                + 增加一个答案
            </div>
            
        </el-form-item>
        <el-form-item label="解析">
            <tinymce-plus v-model="temp.remark" :width="800" :height="200"/>
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
        fetchQuestion,
        createQuestion,
        updateQuestion,
        deleteQuestion,
    } from '@/api/question'

    import waves from '@/directive/waves' // waves directive
    import TinymcePlus from '@/components/TinymcePlus'
    import {
        parseTime,
        uploadOptions
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    const typeOptions = {
        radio:"单选题",
        checkbox:"多选题",
        trueOrfalse:"判断题",
        answer:"问答题",
        completion:"填空题",
    }

    const indexOptions = {
        0:"A",
        1:"B",
        2:"C",
        3:"D",
        4:"E",
        5:"F",
        6:"G",
        7:"H",
        8:"I",
        9:"J",
    }

    const valueOptions = {
        radio: {
            value: 0,
            options: ['选项1', '选项2']
        },
        checkbox: {
            value: [],
            options: ['选项1', '选项2', '选项3']
        },
        trueOrfalse: {
            value: 0,
            options: ['正确', '错误']
        },
        answer: {
            options: ['答案内容']
        },
        completion: {
            options: ['填空1', '填空2']
        }
    }

    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            TinymcePlus
        },
        directives: {
            waves
        },
        filters: {
            typeFilter(type) {
                return typeOptions[type]
            },
            indexFilter(index) {
                return indexOptions[index]
            },
        },
        data() {
            return {
                uploadOptions,
                dialogBtnLoading:false,
                typeOptions,
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    type: undefined,
                    title: undefined,
                },
                showReviewer: false,
                temp: {
                    id: undefined,
                    title: '',
                    type:"radio",
                    value:{
                        value: 0,
                        options: ['选项1', '选项2']
                    },
                    remark:""
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
                        message: '题目标题不能为空',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: '题目类型不能为空',
                        trigger: 'change'
                    }],
                },
                multipleSelection:[]
            }
        },
        created() {
            this.getList()
        },
        methods: {
            handleTypeChange(type){
                this.temp.value = JSON.parse(JSON.stringify(valueOptions[type]))
            },
            addQuestionVal(){
                this.temp.value.options.push('')
            },
            delQuestion(index){
                this.temp.value.options.splice(index,1)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getList() {
                this.listLoading = true
                fetchQuestion(this.listQuery).then(response => {
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
            resetTemp() {
                this.temp = {
                    id: undefined,
                    title: '',
                    type:"radio",
                    value:{
                        value: 0,
                        options: ['选项1', '选项2']
                    },
                    remark:""
                }
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
                        createQuestion(this.temp).then(() => {
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
                        updateQuestion(tempData).then(() => {
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
            handleDeleteAll(){
                this.$confirm('是否要删除选中内容？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {
                    let ids = this.multipleSelection.map(o=>o.id)
                    this.listLoading = true
                    deleteQuestion({
                        ids
                    }).then(response=>{
                        this.$notify({
                            title: '提示',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                        
                    }).finally(()=>{
                        this.$refs.multipleTable.clearSelection()
                        this.listLoading = false
                    })
                })
            },
            handleDelete(row, index) {
                this.listLoading = true
                deleteQuestion({
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
            handleUploadFileSuccess(response, file, fileList){
                this.$message({
                    message: '导入成功',
                    type: 'success',
                });
                this.getList()
            },
            handleUploadFileError(err, file, fileList){
                console.log(err)
                let d = JSON.parse(err.message)
                if(d.msg == 'fail'){
                    this.$message({
                        message: d.data,
                        type: 'error',
                    });
                }
            }
        }
    }
</script>
<style>
.add-questionval{
    text-align: center;
    padding: 10px;
    border: 1px dotted;
    cursor: pointer;
    color: #1890FF;
}
.add-questionval:hover{
    background-color: #fffde7;
}
</style>