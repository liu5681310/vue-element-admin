<template>
    <div>
        <div style="height:5px;background-color: #eeeeee;"></div>
        <el-card shadow="never">
            <div slot="header" class="list-card-header">
                <span>{{ title }}</span>
                <el-button v-if="showMore" class="list-card-more" type="text">查看全部</el-button>
            </div>
            <!-- card body -->
            <div v-if="!list.length" class="componnent-no-data">【列表模块】请点击关联数据</div>
            <el-row v-else :gutter="20">
                <el-col v-for="(item,index) in list" :key="index" :span="6" :offset="0" style="margin-bottom: 20px;">
                    <div style="box-shadow: 0 6px 10px 0 #dddddd;">
                        <img :src="item.cover" style="width: 100%;margin-right: 10px;">
                        <div style="padding:0 8px 10px 8px;">
                            <div class="list-title">{{ item.title }}</div>
                           <!-- <div class="list-desc"  v-html="item.try"></div> -->
                            <div class="list-price">
                                <span>￥{{item.price}}</span>
                                <span>￥{{item.t_price}}</span>
                            </div>
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
            title: {
                type: String,
                default: ""
            },
            showMore: {
                type: Boolean,
                default: true
            },
            list: Array,
            listType: {
                type: String,
                default: "one"
            },
        }
    }
</script>
<style>
    .componnent-no-data {
        border: 1px solid #cccccc;
        background-color: #eeeeee;
        color: #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px 0;
    }
    
    .list-card-header {
        border-bottom: 0;
    }
    
    .list-card-more {
        float: right;
        padding: 0;
        color: #999999;
    }
    
    .list-title {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 5px 0;
    }
    
    .list-desc {
        font-size: 12px;
        color: #999999;
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .list-price {
        display: flex;
        align-items: flex-end;
    }
    
    .list-price span:first-child {
        color: red;
    }
    
    .list-price span:last-child {
        color: #888888;
        margin-left: 5px;
        font-size: 10px;
    }
</style>