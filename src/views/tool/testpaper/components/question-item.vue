<template>
    <div class="question-item">
        <el-alert :title="question.type | typeFilter" type="info" :closable="false"></el-alert>
        <div class="question-item-body">
            <div v-html="question.title"></div>
            <template v-if="question.type != 'answer' && question.type != 'completion'">
               <div class="question" v-for="(q,qI) in question.value.options"
            :key="qI" :style="question.value.value == qI || (question.type == 'checkbox' && question.value.value.includes(qI) ) ? 'color:red;' : ''">
                    <span>{{ qI | indexFilter }}.</span>
                    <div v-html="q"></div>
                </div>
            </template>
        </div>
        <div class="question-item-bottom">
            <span>答案：</span>
            <div v-if="question.type == 'radio' || question.type == 'trueOrfalse'">{{ question.value.value | indexFilter }}</div>
            <div v-else-if="question.type == 'answer' || question.type == 'completion'">
                <div v-for="(a,aI) in question.value.options" :key="aI" v-html="a"></div>
            </div>
            <div v-else>
                {{ question.value.value | checkboxIndexFilter }}
            </div>
        </div>
    </div>
</template>
<script>
const typeOptions = {
    radio:"单选题",
    checkbox:"多选题",
    trueOrfalse:"判断题",
    answer:"问答题",
    completion:"填空题",
}
const indexOptions = {
    0:"A",
    1:"B",
    2:"C",
    3:"D",
    4:"E",
    5:"F",
    6:"G",
    7:"H",
    8:"I",
    9:"J",
}
export default {
    props:{
        question:Object
    },
    filters:{
        typeFilter(type){
            return typeOptions[type]
        },
        indexFilter(index){
            return indexOptions[index]
        },
        // [0,1]  ['A','B']  A,B
        checkboxIndexFilter(val){
            return val.map(o=>indexOptions[o]).join(',')
        }
    }
}
</script>
<style>
.question-item{
    flex:1;
}
.question-item-body{
    padding: 10px;
}
.question-item-body .question,.question-item-bottom{
    display: flex;
}
.question-item-bottom{
    background-color: #eeeeee;
    padding: 10px;
}
.question-item-bottom>div{
    flex:1;
}
</style>