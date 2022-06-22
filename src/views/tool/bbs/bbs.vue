<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button v-permission="'/admin/s/bbs/save,POST'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增社区
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
    <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
    </el-table-column>
<el-table-column label="社区" min-width="180px">
    <template slot-scope="{row}">
        {{row.title}}
    </template>
</el-table-column>
<el-table-column label="状态" class-name="status-col" width="100">
    <template slot-scope="{row}">
        <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status | statusFilter }}
        </el-tag>
    </template>
</el-table-column>
<el-table-column label="管理员" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.managers | formatManagers }}</span>
    </template>
</el-table-column>

<el-table-column label="创建时间" width="150px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.created_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="goToPost(row)">
            管理
          </el-button>
          <el-button v-if="row.status == 0" size="mini" type="success" @click="handleModifyStatus(row,1)">
            显示
          </el-button>
          <el-button v-if="row.status == 1" size="mini" type="danger" @click="handleModifyStatus(row,0)">
            隐藏
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button type="default" size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleUpdate(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="changeManagers(row)">修改管理员</el-dropdown-item>
                <el-dropdown-item @click.native="handleDelete(row,$index)">删除</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
          
        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style=" margin-left:50px;">
        <el-form-item label="社区标题" prop="title">
            <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="状态">
             <el-radio-group v-model="temp.status">
                <el-radio :label="0">隐藏</el-radio>
                <el-radio :label="1">显示</el-radio>
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


    <choose-user ref="chooseUser"></choose-user>

</div>
</template>

<script>
    import {
        fetchList,
        createBbs,
        updateBbs,
        deleteBbs,
        updateBbsStatus,
        setManagers
    } from '@/api/bbs'

    import waves from '@/directive/waves' // waves directive
    import Tinymce from '@/components/Tinymce'
    import chooseUser from '@/components/chooseUser'
    import {
        parseTime,
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    const statusOptions = {
        0:"隐藏",
        1:"显示"
    }


    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            Tinymce,
            chooseUser
        },
        directives: {
            waves
        },
        filters: {
            statusFilter(status) {
                return statusOptions[status]
            },
            formatManagers(arr){
                return arr.map(o=>{
                    return o.nickname || o.username
                }).join(',')
            }
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
                },
                statusOptions,
                temp: {
                    id: undefined,
                    title: '',
                    status: 1,
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
            handleModifyStatus(row, status) {
                this.listLoading = true
                updateBbsStatus({
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
            resetTemp() {
                this.temp = {
                    id: undefined,
                    title: '',
                    status: 1,
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
                        createBbs(this.temp).then(() => {
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
                        updateBbs(tempData).then(() => {
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
                this.$confirm('是否要删除该社区', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {
                    this.listLoading = true
                    deleteBbs({
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
                })
            },
            goToPost(row){
                this.$router.push({
                    name:"BbsPost",
                    query:{
                        id:row.id
                    }
                })
            },
            changeManagers(row){
                this.$refs.chooseUser.open((e)=>{
                    this.listLoading = true
                    setManagers({
                        id:row.id,
                        user_ids:e.map(user=>user.user_id)
                    }).then(res=>{
                        this.$message({
                            message: '设置成功',
                            type: 'success',
                        });
                        this.getList()
                    }).finally(()=>{
                        this.listLoading = false
                    })
                },3)
            }
        }
    }
</script>