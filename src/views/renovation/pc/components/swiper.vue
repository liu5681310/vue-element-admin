<template>
    <div style="padding:10px 20px;">
        <div v-if="!list.length" class="componnent-no-data">【轮播图模块】请点击关联数据</div>
        <el-carousel v-else height="260px">
            <el-carousel-item v-for="(item,index) in list" :key="index">
                <img :src="item.src" style="width: 100%;height: 260px;">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script>
    /**
     *    list:[{
     *         src:"",
     *    }]
     */
    export default {
        props: {
            list: Array
        }
    }
</script>