<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增子页面
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
<el-table-column label="页面内容" min-width="180px">
    <template slot-scope="{row}">
        <span>{{ row.title }}</span>
        <span v-if="row.type == 'index'" class="el-icon-s-home" style="color:blue;"></span>
    </template>
</el-table-column>
<el-table-column label="创建时间" width="180px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.created_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
</el-table-column>
<el-table-column label="更新时间" width="180px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.updated_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
        <el-button type="warning" size="mini" @click="openDetail(row)">
            装修
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference" :disabled="!!row.isdefault">删除</el-button>
           </el-popconfirm>
    </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="页面标题" prop="title">
            <el-input v-model="temp.title" />
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
        createPage,
        updatePage,
        deletePage,
    } from '@/api/renovation'

    import waves from '@/directive/waves' // waves directive
    import {
        parseTime
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination


    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
        },
        directives: {
            waves
        },
        data() {
            return {
                dialogBtnLoading:false,
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    ismobile:1
                },
                temp: {
                    title: '',
                    ismobile:1
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
                        message: '页面标题不能为空',
                        trigger: 'blur'
                    }],
                },
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
            resetTemp() {
                this.temp = {
                    title: '',
                    ismobile:1
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
                        createPage(this.temp).then(() => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
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
                        updatePage(tempData).then(() => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
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
                deletePage({
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
            openDetail(row){
                this.$router.push({
                    name:"MobileEdit",
                    query:{
                        id:row.id
                    }
                })
            }
        }
    }
</script>