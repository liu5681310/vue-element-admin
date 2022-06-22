<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建拼团
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
<el-table-column label="拼团内容" min-width="180px">
    <template slot-scope="{row}">
        <div style="display:flex;">
            <el-image :src="row.value.cover" fit="fill" :lazy="true" style="width:100px;height:50px;"></el-image>
            <div style="margin-left:10px;">
                <div>{{row.value.title}}</div>
                <small style="display:block;">原始价格：<span style="color:red;">￥{{row.value.price}}</span></small>
                <small style="display:block;">拼团价格：<span style="color:red;">￥{{row.price}}</span></small>
            </div>
        </div>
    </template>
</el-table-column>
<el-table-column label="成团人数" width="100" align="center">
    <template slot-scope="{row}">
        <span>{{ row.p_num }}</span>
    </template>
</el-table-column>
<el-table-column label="拼团时限（小时）" width="120" align="center">
    <template slot-scope="{row}">
        <span>{{ row.expire }}</span>
    </template>
</el-table-column>
<el-table-column label="拼团状态" width="100" align="center">
    <template slot-scope="{row}">
        <span :style=" row.time_status == '拼团中' ? 'color:red;' : 'color:#bbbbbb;'">{{ row.time_status }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" :disabled="row.status == 0" @click="changeStatus(row)">下架</el-button>
    </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 700px; margin-left:50px;">
        <el-form-item label="类型" prop="type">
            <el-select v-model="temp.type" @change="temp.value = null">
                <el-option label="课程" value="course"></el-option>
                <el-option label="专栏" value="column"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="temp.type == 'course' ? '关联课程' : '关联专栏'" prop="value">
            <el-button type="primary" size="mini" @click="connectValue">关联</el-button>
            <div v-if="temp.value" style="display: flex;">
                <el-card shadow="always">
                    <div>
                        <img :src="temp.value.cover" style="max-width: 200px;">
                    </div>
                    <div>{{ temp.value.title }}</div>
                    <div style="color:red;">￥{{ temp.value.price }}</div>
                </el-card>
            </div>
        </el-form-item>
        <el-form-item label="拼团价" prop="price">
            <el-input-number v-model="temp.price" size="mini" :min="0" :precision="2" :step="0.1" :controls="true" controls-position="both">
            </el-input-number>
        </el-form-item>
        <el-form-item label="拼团人数" prop="p_num">
            <el-input-number v-model="temp.p_num" size="mini" :min="0" :step="1" :controls="true" controls-position="both">
            </el-input-number>
        </el-form-item>
        <el-form-item label="是否开启凑团" prop="auto">
            <el-radio-group v-model="temp.auto">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="拼团时限" prop="expire">
            <el-radio-group v-model="temp.expire">
                <el-radio :label="24">24小时</el-radio>
                <el-radio :label="48">48小时</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="拼团活动开始时间-结束时间">
            <el-date-picker v-model="timerange" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()"  :loading="dialogBtnLoading">
            {{ dialogBtnLoading ? '提交中...' : '提交' }}
        </el-button>
    </div>
</el-dialog>
<choose-course ref="chooseCourse" :menusType="temp.type"></choose-course>
</div>
</template>

<script>
    import {
        fetchGroup,
        createGroup,
        updateGroup,
        updateGroupStatus
    } from '@/api/marketing'
    import chooseCourse from '@/components/chooseCourse/index.vue'
    import waves from '@/directive/waves' // waves directive
    import {
        parseTime,
    } from '@/utils'

    import util from '@/utils/util.js'
    
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    let timeStatusOptions = {
        0: "未开始",
        1: "拼团中",
        2: "已结束",
        3: "已下架"
    }

    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            chooseCourse
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
                },
                temp: {
                    id: undefined,
                    type: 'course',
                    // 关联课程/专栏
                    value: null,
                    price: 0.00,
                    p_num: 2,
                    auto: 1,
                    expire: 24,
                    start_time: '',
                    end_time: '',
                    status:1,
                    goods_id:0
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    create: '新增'
                },
                rules: {
                    type: [{
                        required: true,
                        message: '类型不能为空',
                        trigger: 'change'
                    }],
                    // 关联课程/专栏
                    value: [{
                        required: true,
                        message: '关联课程/专栏不能为空',
                        trigger: 'blur'
                    }],
                    price: [{
                        required: true,
                        message: '拼团价不能为空',
                        trigger: 'blur'
                    }],
                    p_num: [{
                        required: true,
                        message: '拼团人数不能为空',
                        trigger: 'blur'
                    }],
                    expire: [{
                        required: true,
                        message: '拼团时限不能为空',
                        trigger: 'blur'
                    }],
                },
            }
        },
        created() {
            this.getList()
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
        methods: {
            // 关联课程/专栏
            connectValue() {
                this.$refs.chooseCourse.open((val) => {
                    let item = val[0]
                    this.temp.value = {
                        id: item.id,
                        title: item.title,
                        cover: item.cover,
                        price: item.price,
                    }
                    this.temp.goods_id = item.id
                    this.$refs.dataForm.clearValidate()
                }, 1)
            },
            getList() {
                this.listLoading = true
                fetchGroup(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.items.map(item => {
                        let k = util.formatGroupStatus(item)
                        item.time_status = timeStatusOptions[k]
                        return item
                    })
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
                    type: 'course',
                    // 关联课程/专栏
                    value: null,
                    price: 0.00,
                    p_num: 2,
                    auto: 1,
                    expire: 24,
                    start_time: '',
                    end_time: '',
                    status:1,
                    goods_id:0
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
                    if (this.temp.start_time == '' || this.temp.end_time == '') {
                        return this.$message({
                            message: '活动时间不能为空',
                            type: 'warning',
                        });
                    }
                    if (valid) {
                        this.dialogBtnLoading = true
                        createGroup(this.temp).then(() => {
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
                
                this.temp.start_time = parseTime(this.temp.start_time,'{y}-{m}-{d} {h}:{i}:{s}')
                this.temp.end_time = parseTime(this.temp.end_time,'{y}-{m}-{d} {h}:{i}:{s}')

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
                        updateGroup(tempData).then(() => {
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
            // 下架
            changeStatus(row) {
                this.$confirm('是否要下架该活动？', '提示', {
                    confirmButtonText: '下架',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {

                    updateGroupStatus({
                        id:row.id,
                        status:0
                    }).then(res=>{
                        row.status = 0
                        row.time_status = '已下架'
                        this.$message({
                            message: '下架成功',
                            type: 'success',
                        });
                    })
                });
            }
        }
    }
</script>