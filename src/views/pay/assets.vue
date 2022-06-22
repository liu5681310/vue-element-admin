<template>
  <div class="app-container">
    
    <el-row :gutter="20" style="margin-bottom:20px;" v-loading="detailLoading">
        <el-col :span="8" :offset="0">
            <el-card shadow="never">
                <div slot="header">
                    <span>可用余额（元）</span>
                    <el-button style="float:right;" type="primary" size="small" @click="handleCreate">申请提现</el-button>
                </div>
                <div>
                    <span style="font-size:30px;font-weight:bold;">{{ detail.balance }}</span>
                </div>
            </el-card>
        </el-col>
        <el-col :span="8" :offset="0">
            <el-card shadow="never">
                <div slot="header">
                    <span>累计收入（元）</span>
                </div>
                <div>
                    <span style="font-size:30px;font-weight:bold;">{{ detail.t_balance }}</span>
                </div>
            </el-card>
        </el-col>
        <el-col :span="8" :offset="0">
            <el-card shadow="never">
                <div slot="header">
                    <span>待结算金额（元）</span>
                </div>
                <div>
                    <span style="font-size:30px;font-weight:bold;">{{ detail.w_balance }}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
    

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
<el-table-column label="交易时间" width="180px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.created_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
</el-table-column>
<el-table-column label="提款账号" min-width="180px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.account }}</span>
    </template>
</el-table-column>
<el-table-column label="开户人" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.name }}</span>
    </template>
</el-table-column>
<el-table-column label="提现金额" align="center">
    <template slot-scope="{row}">
        ￥{{ row.price }}
    </template>
</el-table-column>
<el-table-column label="状态" class-name="status-col" width="100">
    <template slot-scope="{row}">
        <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status | statusFilter }}
        </el-tag>
    </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog title="提现" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="提现金额" prop="price">
            <el-input-number v-model="temp.price" :min="0" label="提现金额" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="提现账户" prop="cash_id">
            <el-select v-model="temp.cash_id" placeholder="请选择"
            style="width:250px;">
                <el-option
                v-for="item in payments"
                :key="item.id"
                :label="item.bank"
                :value="item.id">
                <span style="float: left">{{ item.bank }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="createData()">
            提交
        </el-button>
    </div>
</el-dialog>

</div>
</template>

<script>
    import {
        readSchool,
    } from '@/api/school'

    import {
        fetchAssets,
        fetchPayments,
        Cashout
    } from '@/api/pay'


    import waves from '@/directive/waves' // waves directive
    import Tinymce from '@/components/Tinymce'
    import {
        parseTime
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    const statusOptions = {
        0:"审核中",
        1:"提现成功",
        2:"提现失败"
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
                detailLoading:false,
                detail:{
                    balance:0.00,
                    t_balance:0.00,
                    w_balance:0.00
                },
                payments:[],
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                },
                statusOptions,
                showReviewer: false,
                temp: {
                    price:0,
                    cash_id:null
                },
                dialogFormVisible: false,
                rules: {
                    price: [{
                        trigger: 'blur',
                        validator:(rule,value,callback)=>{
                            if(!value){
                                return callback(new Error('提现金额必填'))
                            }
                            if(value > this.detail.balance){
                                return callback(new Error('提现金额不能大于'+ this.detail.balance +'元'))
                            }
                            callback()
                        }
                    }],
                    cash_id: [{
                        required: true,
                        message: '提现账户不能为空',
                        trigger: 'change'
                    }],
                },
            }
        },
        created() {
            this.getSchool()
            this.getList()

            fetchPayments({
                page:1,
                status:1,
                limit:50
            }).then(res=>{
                this.payments = res.data.items
            })
        },
        methods: {
            getSchool(){
                this.detailLoading = true
                readSchool().then(res=>{
                    this.detail = {
                        balance:res.data.balance,
                        t_balance:res.data.t_balance,
                        w_balance:res.data.w_balance,
                    }
                }).finally(()=>{
                    this.detailLoading = false
                })
            },
            getList() {
                this.listLoading = true
                fetchAssets(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.items
                    this.total = response.data.total

                    this.listLoading = false
                })
            },
            resetTemp() {
                this.temp = {
                    price:0,
                    cash_id:null
                }
            },
            handleCreate() {
                this.resetTemp()
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        Cashout(this.temp).then((res) => {
                            this.getSchool()
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: '申请成功，等待审核',
                                type: 'success',
                                duration: 2000
                            })
                        })
                    }
                })
            },
        }
    }
</script>