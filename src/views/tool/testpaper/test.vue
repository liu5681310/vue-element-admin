<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.answer_status" placeholder="答题状态" clearable style="width: 120px;margin-right:10px;" class="filter-item">
        <el-option v-for="(item,k) in answerStatusOptions" :key="k" :label="item" :value="k" />
      </el-select>
       <el-select v-model="listQuery.read_status" placeholder="阅卷状态" clearable style="width: 120px;margin-right:10px;" class="filter-item">
        <el-option v-for="(item,k) in readStatusOptions" :key="k" :label="item" :value="k" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
<el-table-column label="试卷名称" min-width="180px">
    <template slot-scope="{row}">
        {{ row.testpaper.title }}
    </template>
</el-table-column>
<el-table-column label="用户名" min-width="60px">
    <template slot-scope="{row}">
        {{ row.user.nickname || row.user.username }}
    </template>
</el-table-column>
<el-table-column label="答题状态" min-width="80px" align="center">
    <template slot-scope="{row}">
        {{ row.answer_status | answerStatusFilter }}
    </template>
</el-table-column>
<el-table-column label="是否阅卷" min-width="50px" align="center">
    <template slot-scope="{row}">
        <span :style="row.read_status ? 'color:green;' : 'color:red;'">{{ row.read_status ? '是' : '否' }}</span>
    </template>
</el-table-column>
<el-table-column label="开始时间" width="180px">
    <template slot-scope="{row}">
        <span>{{ row.created_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
</el-table-column>
<el-table-column label="分数" width="110px" align="center">
    <template slot-scope="{row}">
        <span v-if="row.read_status && row.answer_status">{{ row.score }}</span>
    </template>
</el-table-column>

<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"
          v-if="!row.read_status">
            阅卷
          </el-button>
          <el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference">删除</el-button>
           </el-popconfirm>
          
        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<el-dialog fullscreen title="阅卷" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-form-item label="试卷标题" prop="title">
            <span v-html="temp.testpaper.title"></span>
        </el-form-item>
        <el-form-item label="题目" prop="title">
            <question-list v-for="(item,index) in temp.questions" :key="index" :item="item" :index="index">
                <div slot="right">本题分值：{{ item.score }}</div>
                <div style="min-width:400px;">
                    <el-row :gutter="20">
                        <el-col :span="14" :offset="0">
                            <div style="border: 1px solid #eeeeee;">
                                <div style="padding: 10px;border-bottom: 1px solid #eeeeee;">
                                    用户答案
                                </div>
                                <div v-if="temp.values.length" style="padding: 10px;">
                                    <div v-if="item.question.type == 'radio' || item.question.type == 'trueOrfalse'">
                                        {{ temp.values[index].answer | indexFilter }}
                                    </div>
                                    <div v-else-if="item.question.type == 'checkbox'">
                                        {{ temp.values[index].answer.map(o=>indexOptions[o]).join(',') }}
                                    </div>
                                    <div v-else v-for="(a,aI) in temp.values[index].answer" :key="aI" v-html="a"></div>
                                </div>
                            </div>
                        </el-col>
                        <el-col v-if="temp.values.length" :span="10" :offset="0">
                            得分
                            <el-input-number placeholder="得分" :min="0" style="width:100px;" size="mini" v-model="temp.values[index].score" :max="item.score"></el-input-number>
                        </el-col>
                    </el-row>
                </div>
                <!-- 分值  -->
            </question-list>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <div style="margin-bottom:10px;">
            用户最终得分：<span style="color:red;">{{ total_score }}</span> 分
        </div>

        <el-button @click="dialogFormVisible = false">
            取消
        </el-button>
        <el-button type="primary" @click="updateData()" :loading="dialogBtnLoading">
            {{ dialogBtnLoading ? '提交中...' : '提交' }}
        </el-button>
    </div>
</el-dialog>

</div>
</template>

<script>
    import {
        fetchUserTest,
        updateUserTest,
        deleteUserTest,
        readUserTest
    } from '@/api/testpaper'

    import waves from '@/directive/waves' // waves directive
    import questionList from './components/question-list.vue'
    import {
        parseTime,
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    const answerStatusOptions = {
        0: "答题中",
        1: "答题完成"
    }

    const readStatusOptions = {
        0: "否",
        1: "是"
    }


    const indexOptions = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
        6: "G",
        7: "H",
        8: "I",
        9: "J",
    }

    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            questionList
        },
        directives: {
            waves
        },
        filters: {
            answerStatusFilter(status) {
                return answerStatusOptions[status]
            },
            indexFilter(index) {
                return indexOptions[index]
            },
        },
        computed:{
            total_score(){
                let score = 0
                if(!this.temp.values){
                    return score
                }
                this.temp.values.forEach(o=>{
                    score += o.score
                })
                return score
            }
        },
        data() {
            return {
                dialogBtnLoading:false,
                indexOptions,
                answerStatusOptions,
                readStatusOptions,
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    answer_status: undefined,
                    read_status: undefined,
                },
                temp: {
                    id: undefined,
                    testpaper: {
                        title: '',
                    },
                    questions: [],
                    values: [],
                    score: 0
                },
                dialogFormVisible: false,
                rules: {
                    // title: [{
                    //     required: true,
                    //     message: '标题不能为空',
                    //     trigger: 'blur'
                    // }],
                },
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                fetchUserTest(this.listQuery).then(response => {
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
            handleUpdate(row) {
                this.temp = Object.assign({}, row)
                    // 查询当前答卷的详情
                readUserTest(row).then(res => {
                    this.temp = res.data
                    this.dialogFormVisible = true
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.dialogBtnLoading = true
                        updateUserTest({
                            id:this.temp.id,
                            scores:this.temp.values.map(q=>q.score)
                        }).then(() => {
                            this.getList()
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
                deleteUserTest({
                    ids:[row.id]
                }).then(response => {
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