<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加员工
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
<el-table-column label="用户" min-width="180px">
    <template slot-scope="{row}">
        {{row.user.nickname || row.user.username}}
    </template>
</el-table-column>
<el-table-column label="角色" class-name="status-col" width="100">
    <template slot-scope="{row}">
        {{  row.iscreator ? '创建人' : (row.roles.map(r=>r.name)).join(',') }}
    </template>
</el-table-column>
<el-table-column label="创建时间" width="150px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.created_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
        <div v-if="!row.iscreator">
            <el-button type="primary" size="mini" @click="openSetRoles(row)">
            配置权限
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </div>
        <div v-else>-</div>
    </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog title="添加员工" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style=" margin-left:50px;">
        <el-form-item label="关键词" prop="title">
            <el-input v-model="temp.keyword" placeholder="用户名/手机/邮箱"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="createData">
            提交
        </el-button>
    </div>
</el-dialog>


<el-dialog title="配置权限" :visible.sync="rolesVisible">
    <el-form ref="dataForm" label-position="left" label-width="70px" style=" margin-left:50px;">
        <el-form-item label="角色">
            <el-checkbox-group v-model="roleTemp.role_ids">
                <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
                    {{item.name}}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="handleSetRoles">
            提交
        </el-button>
    </div>
</el-dialog>

</div>
</template>

<script>
    import {
        fetchStaff,
        createStaff,
        setRoles,
        deleteStaff,
    } from '@/api/staff'

    import {
        fetchRole
    } from '@/api/user'

    import waves from '@/directive/waves' // waves directive
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    import {
        parseTime,
    } from '@/utils'

    const statusOptions = {
        0:"隐藏",
        1:"显示"
    }


    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
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
                roles:[],
                roleTemp:{
                    id:0,
                    role_ids:[]
                },
                rolesVisible:false,
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
                   keyword:""
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    create: '新增'
                },
                rules: {
                    keyword: [{
                        required: true,
                        message: '用户名/手机/邮箱 不能为空',
                        trigger: 'blur'
                    }],
                },
            }
        },
        created() {
            this.getList()
        },
        methods: {
            openSetRoles(row){
                this.roleTemp.id = row.id
                fetchRole({
                    page:1
                }).then(res=>{
                    this.roles = res.data.items
                    this.rolesVisible = true
                })
            },
            handleSetRoles(){
                setRoles(this.roleTemp).then(res=>{
                    this.getList()
                    this.$message({
                        message: '设置成功',
                        type: 'success',
                    });
                    this.rolesVisible = false
                })
            },
            getList() {
                this.listLoading = true
                fetchStaff(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.items
                    this.total = response.data.total

                    this.listLoading = false
                })
            },
            resetTemp() {
                this.temp = {
                    keyword:""
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
                        createStaff(this.temp).then(() => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: 'Created Successfully',
                                type: 'success',
                                duration: 2000
                            })
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
                    deleteStaff({
                        staff_id:row.id
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
        }
    }
</script>