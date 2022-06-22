<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
                <div class="icons">
                    <img :src="item.src">
                    <span>{{ item.name }}</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props:{
        list:Array
    }
}
</script>
<style>
    .icons{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
    }
    .icons img{
        width: 40px;
        height: 40px;
        margin-bottom: 5px;
    }
    .icons span{
        font-size: 14px;
    }
</style>