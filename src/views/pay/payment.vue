<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增收款账号
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
<el-table-column label="账号" min-width="180px">
    <template slot-scope="{row}">
        {{ row.account }}
    </template>
</el-table-column>
<el-table-column label="开户人" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.name }}</span>
    </template>
</el-table-column>
<el-table-column label="开户行" class-name="status-col" width="300">
    <template slot-scope="{row}">
        {{ row.path }}
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

<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" prop="account">
            <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="省市区">
            <v-distpicker :province="temp.province" :city="temp.city" :area="temp.area" @province="handleDistPicker($event,'province')" @city="handleDistPicker($event,'city')" @area="handleDistPicker($event,'area')"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址" prop="path">
            <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="所属银行" prop="bank">
            <el-select v-model="temp.bank" placeholder="请选择">
                <el-option
                v-for="item in banks"
                :key="item.value"
                :label="item.text"
                :value="item.text">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="temp.name" />
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
        fetchPayments,
        createPayment,
        updatePayment,
        deletePayment
    } from '@/api/pay'
    import VDistpicker from 'v-distpicker'
    import waves from '@/directive/waves' // waves directive

    import {
        parseTime
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    import { getBank } from '@/utils/bank'
    const statusOptions = {
        0:"已下架",
        1:"已上架"
    }


    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            VDistpicker
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
                banks:[],
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    status: undefined,
                    title: undefined,
                    sort: '+id'
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
                    account: "",
                    area: "",
                    bank: "",
                    city: "",
                    name: "",
                    path: "",
                    province: "",
                    status:1
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    create: '新增'
                },
                rules: {
                    account: [{
                        required: true,
                        message: '账户不能为空',
                        trigger: 'blur'
                    }],
                    bank: [{
                        required: true,
                        message: '所属银行不能为空',
                        trigger: 'change'
                    }],
                    name: [{
                        required: true,
                        message: '开户人不能为空',
                        trigger: 'blur'
                    }],
                    path: [{
                        required: true,
                        message: '详细地址不能为空',
                        trigger: 'blur'
                    }],
                },
            }
        },
        created() {
            this.getList()

            this.banks = getBank()
        },
        methods: {
            handleDistPicker(e,k){
                this.temp[k] = e.value
            },
            getList() {
                this.listLoading = true
                fetchPayments(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.items
                    this.total = response.data.total

                    this.listLoading = false
                })
            },
            resetTemp() {
                this.temp = {
                    account: "",
                    area: "",
                    bank: "",
                    city: "",
                    name: "",
                    path: "",
                    province: "",
                    status:1
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
                        if(this.temp.province == '' || this.temp.city == '' || this.temp.area == ''){
                            return this.$message({
                                message: '省市区不能为空',
                                type: 'error',
                            });
                        }
                        this.dialogBtnLoading = true
                        createPayment(this.temp).then(() => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: '新增收款账号成功',
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
                        if(this.temp.province == '' || this.temp.city == '' || this.temp.area == ''){
                            return this.$message({
                                message: '省市区不能为空',
                                type: 'error',
                            });
                        }
                        const tempData = Object.assign({}, this.temp)
                        this.dialogBtnLoading = true
                        updatePayment(tempData).then(() => {
                            const index = this.list.findIndex(v => v.id === this.temp.id)
                            this.list.splice(index, 1, this.temp)
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
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
                this.listLoading = true
                deletePayment({
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
        }
    }
</script>