<template>
    <div>
        <el-card shadow="never" v-loading="loading">
            <div slot="header">
                <span>店铺设置</span>
            </div>
            <el-form ref="form" label-position="left" label-width="120px" size="normal">
                <el-form-item label="店铺名称">
                    <el-row :gutter="20" type="flex" justify="space-between" style="border-bottom:1px solid #dddddd;">
                        <el-col :span="6" :offset="0">
                            {{ school.name }}
                        </el-col>
                        <el-col :span="2" :offset="0">
                            <el-button type="text" @click="changeName">设置</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="店铺地址">
                    <el-row :gutter="20" type="flex" justify="space-between" style="border-bottom:1px solid #dddddd;">
                        <el-col :span="6" :offset="0">
                            {{ school.weburl }}
                        </el-col>
                        <el-col :span="2" :offset="0">
                            <el-button type="text" v-clipboard:copy="school.weburl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制地址</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="店铺管理员">
                    <el-row :gutter="20" type="flex" justify="space-between" style="border-bottom:1px solid #dddddd;">
                        <el-col :span="6" :offset="0">
                           {{ school.user.phone || school.user.email || school.user.username }}
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="店铺appid">
                    <el-row :gutter="20" type="flex" justify="space-between" style="border-bottom:1px solid #dddddd;">
                        <el-col :span="6" :offset="0">
                            {{ school.appid }}
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            
        </el-card>
        
    </div>
</template>
<script>
import { readSchool,updateSchool } from '@/api/school'
export default {
    data() {
        return {
            loading:true,
            school:{
                id:0,
                name:"",
                weburl:"",
                user:{
                    username:"",
                    phone:"",
                    email:""
                },
                appid:""
            }
        }
    },
    created(){
        readSchool().then(res=>{
            this.school = res.data
        }).finally(()=>{
            this.loading = false
        })
    },
    methods: {
        onCopy: function (e) {
            this.$message({
                type: 'success',
                message: '复制成功'
            });
        },
        onError: function (e) {
            this.$message({
                type: 'danger',
                message: '修改失败'
            });
        },
        changeName(){
            this.$prompt('请输入新的网校名称', '修改', {
                confirmButtonText: '提交',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                this.loading = true
                updateSchool({
                    id:this.school.id,
                    name:value
                }).then(res=>{
                    this.school.name = value
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                }).finally(()=>{
                    this.loading = false
                })
            })
        }
    },
}
</script>