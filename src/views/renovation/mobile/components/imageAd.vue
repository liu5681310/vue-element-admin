<template>
    <div>
        <div v-if="list == '' || !list.length" class="componnent-no-data">【图片广告模块】请点击关联数据</div>
        <img v-if="typeof list == 'string'" :src="list" style="width: 100%;height: 150px;">
        <template v-else>
            <div v-for="(item,index) in list" :key="index">
                <img :src="item.src" style="width: 100%;height: 150px;">
            </div>
        </template>
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
            list: [Array,String]
        }
    }
</script>