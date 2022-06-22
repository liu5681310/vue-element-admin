<template>
    <div class="question-list">
        <div>
            第{{ index + 1 }}题
            <slot name="right">
                <span class="el-icon-delete-solid" @click="$emit('del',index)"></span>
            </slot>
        </div>
        <div style="display:flex;">
            <question-item :question="item.question"></question-item>
            <div style="margin:0 10px;">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
import questionItem from './question-item.vue'
export default {
    components:{
        questionItem
    },
    props:{
        item:Object,
        index:Number
    }
}
</script>
<style>
.question-list{
    border: 1px solid #eee;
    margin-bottom: 10px;
    margin-right: 20px;
}
.question-list>div:first-child{
    padding: 10px 25px;
    display: flex;
    justify-content: space-between;
    background-color: #e7faf0;
    color: #13ce66;
    margin-bottom: 10px;
    align-items: center;
}
.question-list .el-icon-delete-solid{
    font-size: 18px;
    cursor: pointer;
}
</style>