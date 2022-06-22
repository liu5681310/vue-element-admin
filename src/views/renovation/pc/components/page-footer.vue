<template>
    <div class="page-footer">
        <div>
            <a v-for="(item,index) in data" :key="index">{{ item.title }}</a>
        </div>
        <div v-html="beian">
            
        </div>
    </div>
</template>
<script>
export default {
    props:{
        data:Array,
        beian:String
    }
}
</script>
<style>
    .page-footer{
        padding: 36px 0;
        background: #1C1F21;
    }
    .page-footer div{
        display: flex;
        align-items: center;
        justify-content: center;
        color: #cccccc;
        font-size: 13px;
    }
    .page-footer a{
        padding: 4px 5px;
    }
</style>