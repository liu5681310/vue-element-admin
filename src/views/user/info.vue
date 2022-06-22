<template>
    <div>
        <el-dialog
        title="用户详情"
        :visible.sync="dialogVisible"
        width="80%"
        top="5vh">
        
        <el-container>
            <el-header style="height:12vh;" v-loading="infoLoading">
                <el-row :gutter="20">
                    <el-col :span="6"><p>ID： {{ id }}</p></el-col>
                    <el-col :span="6"><p>用户名： {{ user.username }}</p></el-col>
                    <el-col :span="6"><p>昵称： {{ user.nickname || '未设置' }}</p></el-col>
                    <el-col :span="6"><p>手机号： {{ user.phone }}</p></el-col>
                    <el-col :span="6"><p>锁定： {{ user.status ? '否' : '是' }}</p></el-col>
                    <el-col :span="6"><p>会员：  {{ user.user_level }}</p></el-col>
                    <el-col :span="6"><p>会员到期时间：{{ user.user_level_expire }}</p></el-col>
                    <el-col :span="6"><p>注册时间：{{ user.created_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</p></el-col>
                </el-row>
            </el-header>
            <el-main style="height:55vh;padding-bottom:0;">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in tabs" :key="index">
                        <el-table
                        :data="list"
                        height="280"
                        border
                        style="width: 100%"
                        v-loading="listLoading">
                        <el-table-column
                        :prop="t.prop"
                        :label="t.label"
                        v-for="(t,tI) in item.ths"
                        :key="tI">
                        </el-table-column>
                    </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
            <el-footer>
                <pagination :total="form.total" :page.sync="form.page" :limit.sync="form.limit" @pagination="getData" style="padding: 0; padding-top: 10px;margin: 0;" layout="total,prev,pager,next" />
            </el-footer>
        </el-container>

        </el-dialog>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { fetchUserDetail,fetchUserCourse,fetchUserColumn,fetchUserOrder,fetchUserHistory,fetchUserComment } from '@/api/user'

import {
        parseTime
    } from '@/utils'

let statusOptions = {
    pendding:"待支付",
    success:"成功",
    fail:"失败"
}
let typeOptions = {
    media:"图文",
    audio:"音频",
    video:"视频",
    column:"专栏",
}
export default {
    components:{
        Pagination
    },
    data() {
        return {
            infoLoading:false,
            user:{
                avatar: "",
                created_time: "",
                id: 0,
                nickname: "",
                phone: "",
                status: 0,
                user_level: "",
                user_level_expire: "",
                username: ""
            },
            form:{
                page:1,
                limit:10,
                total:100,
                user_id:0
            },
            dialogVisible:false,
            id:0,
            activeName: 'course',

            tabs:[{
                label:"课程订阅",
                name:"course",
                ths:[{
                    prop:"title",
                    label:"课程标题"
                },{
                    prop:"price",
                    label:"购买价格"
                },{
                    prop:"created_time",
                    label:"购买时间"
                }],
                request:fetchUserCourse
            },{
                label:"专栏订阅",
                name:"column",
                ths:[{
                    prop:"title",
                    label:"专栏标题"
                },{
                    prop:"price",
                    label:"购买价格"
                },{
                    prop:"created_time",
                    label:"购买时间"
                }],
                request:fetchUserColumn
            },{
                label:"订单记录",
                name:"order",
                ths:[{
                    prop:"id",
                    label:"ID"
                },{
                    prop:"no",
                    label:"订单号"
                },{
                    prop:"price",
                    label:"购买价格"
                },{
                    prop:"status",
                    label:"状态"
                },{
                    prop:"title",
                    label:"商品"
                },{
                    prop:"created_time",
                    label:"购买时间"
                }],
                request:fetchUserOrder
            },{
                label:"观看历史",
                name:"history",
                ths:[{
                    prop:"title",
                    label:"课程标题"
                },{
                    prop:"type",
                    label:"课程类型"
                },{
                    prop:"total_time",
                    label:"学习时长"
                }],
                request:fetchUserHistory
            },{
                label:"用户评论",
                name:"comment",
                ths:[{
                    prop:"comment",
                    label:"评论内容"
                },{
                    prop:"created_time",
                    label:"评论时间"
                },{
                    prop:"title",
                    label:"课程标题"
                },{
                    prop:"type",
                    label:"类型"
                }],
                request:fetchUserComment
            }],

            list:[],
            listLoading:false

        }
    },
    computed:{
        currentTab(){
            return this.tabs.find(item=>item.name == this.activeName)
        }
    },
    methods:{
        getData(){
            this.listLoading = true
            this.list = []
            this.currentTab.request(this.form).then(res=>{
                this.list = res.data.items.map(item=>{
                    let name = this.currentTab.name
                    if(name == 'order'){
                        item.status = statusOptions[item.status]
                    } else if(name === 'history' || name === 'comment'){
                        item.type = item.type ? typeOptions[item.type] : null
                    }
                    return item
                })
                this.form.total = res.data.total
                setTimeout(()=>{
                    this.listLoading = false
                },200)
            })
        },
        open(id){
            this.id = id
            this.infoLoading = true
            fetchUserDetail({
                id:this.id
            }).then(res=>{
               this.user = res.data.user
               this.form.user_id = this.user.id
               this.getData()
               this.user.user_level = res.data.user_level
               this.user.user_level_expire = res.data.user_level_expire
            }).finally(()=>{
                this.infoLoading = false
            })
            
            this.dialogVisible = true
        },
        handleClick(tab, event) {
            this.form.page = 1
            this.getData()
        }
    }
}
</script>
<style scoped>

</style>