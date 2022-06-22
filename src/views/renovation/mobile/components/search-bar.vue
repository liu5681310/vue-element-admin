<template>
    <div class="search-bar-box">
        <div class="search-bar">
            <i class="el-icon-search"></i>
            <span>{{ placeholder }}</span>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        placeholder:{
            type:String,
            default:""
        }
    }
}
</script>
<style>
    .search-bar-box{
        padding: 10px;
    }
    .search-bar{
        background-color: rgb(248, 248, 248);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #808080;
        padding: 10px;
        border: 1px solid #eeeeee;
    }
    .search-bar i {
        margin-right: 5px;
        font-size: 20px;
    }
</style>