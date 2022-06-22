<template>
    <div v-loading="loading">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="margin-left:50px;margin-top:20px;">
        <el-form-item label="试卷名称" prop="title">
            <el-input v-model="temp.title" style="width:200px;"/>
        </el-form-item>
         <el-form-item label="是否公开" prop="status">
             <el-radio-group v-model="temp.status">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="总分" prop="total_score">
            <el-input-number v-model="temp.total_score" :min="0"></el-input-number>分
        </el-form-item>
       <el-form-item label="及格分" prop="pass_score">
            <el-input-number v-model="temp.pass_score" :min="0"></el-input-number>分
        </el-form-item>
        <el-form-item label="时间限制" prop="expire">
            <el-input-number v-model="temp.expire" :min="0"></el-input-number>分钟
        </el-form-item>
        <el-form-item label="题目列表">
            <div>当前已有题目分数：{{ used_score }}</div>
            <question-list v-for="(item,index) in temp.questions" :key="index" :item="item" :index="index" @del="handleDeleteQuestion">
                分值 <el-input-number placeholder="分数" :min="0" style="width:100px;" size="mini" v-model="item.score"></el-input-number>
            </question-list>

            <el-button type="primary" size="default" @click="addQuestion">添加题目</el-button>
            
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit" :loading="dialogBtnLoading">{{ dialogBtnLoading ? '提交中...' : '提交' }}</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
    </el-form>

    <choose-question ref="chooseQuestion"></choose-question>
    </div>
</template>
<script>
import {
    readTestpaper,
    createTestpaper,
    updateTestpaper
} from '@/api/testpaper'
import questionList from './components/question-list.vue'
import chooseQuestion from './components/choose-question.vue'

let temp = {
    id: undefined,
    title: '',
    status: 1,
    total_score: 100,
    pass_score: 60,
    expire: 60,
    questions:[]
}
let id = 0
export default {
    components:{
        questionList,
        chooseQuestion
    },
    beforeRouteEnter(to,from,next){
        // 新增
        if(!to.query.id){
            return next()
        }
        id = to.query.id
        next()
    },
    data() {
        return {
            loading:false,
            dialogBtnLoading:false,
            temp,
            rules: {
                title: [{
                    required: true,
                    message: '试卷名称不能为空',
                    trigger: 'blur'
                }],
                total_score: [{
                    required: true,
                    message: '总分不能为空',
                    trigger: 'blur'
                }],
                pass_score: [{
                    required: true,
                    message: '及格分不能为空',
                    trigger: 'blur'
                }],
                expire: [{
                    required: true,
                    message: '时间限制不能为空',
                    trigger: 'blur'
                }],
            },
        }
    },
    created(){
        if(id){
            this.loading = true
            readTestpaper({
                id
            }).then(res=>{
                this.temp = res.data
            }).finally(()=>{
                this.loading = false
            })
        }
    },
    destroyed(){
        id = 0
    },
    computed:{
        used_score(){
            let score = 0
            this.temp.questions.forEach(item=>{
                score += item.score
            }) 
            return score
        }
    },
    methods:{
        submit(){
            this.dialogBtnLoading = true
            let fun = this.temp.id ? updateTestpaper(this.temp) : createTestpaper(this.temp)
            fun.then(res=>{
                this.$router.push({
                    name:"Testpaper"
                })
                this.$notify({
                    title: '提示',
                    message: this.temp.id ? '更新成功':'新增成功',
                    type: 'success',
                }); 
            }).finally(()=>{
                this.dialogBtnLoading = false
            })
        },
        reset(){
            this.temp = {
                id: undefined,
                title: '',
                status: 1,
                total_score: 100,
                pass_score: 60,
                expire: 60,
                questions:[]
            }
        },
        addQuestion(){
            this.$refs.chooseQuestion.open((e)=>{
                e.forEach(item=>{
                    let obj = {
                        question_id:item.id,
                        question:item,
                        score:0
                    }
                    this.temp.questions.push(obj)
                })
            })
        },
        handleDeleteQuestion(index){
            this.temp.questions.splice(index,1)
        }
    }
}
</script>