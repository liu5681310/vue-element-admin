<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <div slot="header">
                <span>{{ title }}</span>
            </div>
            
            <el-row :gutter="20">
                <el-col :span="12" :offset="0" v-for="(item,index) in list" :key="index">
                    <div class="card-box-item" @click="goTo(item.path)">
                        <i :class="item.icon"></i>
                        <div>
                            <div>{{ item.name }}</div>
                            <small>{{item.remark}}</small>
                        </div>
                    </div>
                </el-col>
            </el-row>
            
        </el-card>
        
    </div>
</template>
<script>
    export default {
        props: {
            list: Array,
            title: String
        },
        data() {
            return {

            }
        },
        methods: {
            goTo(name){
                if(!name){
                    return
                }
                this.$router.push({
                    name
                })
            }
        },
    }
</script>
<style>
    .card-box-item {
        display: flex;
        align-items: center;
        border: 1px solid #cccccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    
    .card-box-item i {
        font-size: 30px;
        padding: 10px;
        margin-right: 10px;
        border-radius: 5px;
        background-color: pink;
        color: red;
    }
    
    .card-box-item small {
        color: #aaaaaa;
        font-size: 12px;
    }
</style>