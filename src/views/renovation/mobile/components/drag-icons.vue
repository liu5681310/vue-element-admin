<template>
  <div class="dndList">
    <draggable :set-data="setData" :list="list" group="course" class="dragArea">
        <div v-for="(element,index) in list" :key="element.id" class="list-complete-item" style="background-color: #f4f4f4;border: 0;">
          <div style="position:absolute;right:0px;padding:5px;">
            <span style="float: right ;margin-top: -5px;margin-right:10px;" @click="$emit('del',index)">
              <i style="color:#ff4949;font-size:20px;" class="el-icon-delete" />
            </span>
          </div>
          
          <div style="display: flex;align-items: center;">
              <img :src="element.src" style="width:40px;height:40px;" @click="handleUploadImage(element)">
              <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 10px;">
                <el-input v-model="element.name" placeholder="分类名称" size="mini" style="margin-bottom: 10px;"></el-input>
                
                <el-select size="mini" v-model="element.type" placeholder="请选择跳转类型">
                    <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div v-if="element.type" style="margin-top: 10px;">
                    <el-button type="primary" size="mini" v-if="element.type == 'page'" @click="handleChoosePage(element)">{{ element.page_title || '关联页面' }}</el-button>
                    <el-button type="primary" size="mini" v-else-if="element.type == 'course'" @click="handleChooseCourse(element)">{{ element.course_title || '关联课程' }}</el-button>
                    <el-input size="mini" v-else-if="element.type == 'webview'" v-model="element.url" placeholder="请输入要跳转的链接" clearable></el-input>
                    <el-select size="mini" v-else v-model="element.module" placeholder="请选择关联模块">
                        <el-option v-for="item in mOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    
                </div>
             </div>
          </div>

         

        </div>
    </draggable>
  </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: 'DndList',
        components: {
            draggable
        },
        inject: ['componentForm'],
        props: {
            list: {
                type: Array,
                default () {
                    return []
                }
            },
        },
        data() {
            return {
                mOpt:[{
                    label: "考试模块",
                    value: "test"
                },{
                    label: "秒杀模块",
                    value: "flashsale"
                },{
                    label: "拼团模块",
                    value: "group"
                },{
                    label: "直播模块",
                    value: "live"
                },{
                    label: "专栏模块",
                    value: "column"
                },{
                    label: "电子书模块",
                    value: "book"
                },{
                    label: "社区模块",
                    value: "bbs"
                }],
                options: [{
                    label: "页面",
                    value: "page"
                }, {
                    label: "课程",
                    value: "course"
                }, {
                    label: "网页地址",
                    value: "webview"
                },{
                    label: "模块",
                    value: "module"
                }]
            }
        },
        methods: {
            // 上传图片
            handleUploadImage(element) {
                this.componentForm.$refs.uploadImage.open((val) => {
                    element.src = val
                }, element.src)
            },
            handleChoosePage(element) {
                this.componentForm.$refs.choosePage.open((val) => {
                    element.page_id = val[0].id
                    element.page_title = val[0].title
                }, 1)
            },
            handleChooseCourse(element) {
                this.componentForm.openChooseCourse((val) => {
                    element.course_title = val[0].title
                    element.course_id = val[0].id
                }, 1)
            },
            setData(dataTransfer) {
                // to avoid Firefox bug
                // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                dataTransfer.setData('Text', '')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dndList {
        background: #fff;
        padding-bottom: 40px;
        &:after {
            content: "";
            display: table;
            clear: both;
        }
        .dndList-list {
            float: left;
            padding-bottom: 30px;
            &:first-of-type {
                margin-right: 2%;
            }
            .dragArea {
                margin-top: 15px;
                min-height: 50px;
                padding-bottom: 30px;
            }
        }
    }
    
    .list-complete-item {
        cursor: pointer;
        position: relative;
        font-size: 14px;
        padding: 5px 12px;
        margin-top: 4px;
        border: 1px solid #bfcbd9;
        transition: all 1s;
    }
    
    .list-complete-item-handle {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 50px;
    }
    
    .list-complete-item-handle2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
    }
    
    .list-complete-item.sortable-chosen {
        background: #4AB7BD;
    }
    
    .list-complete-item.sortable-ghost {
        background: #30B08F;
    }
    
    .list-complete-enter,
    .list-complete-leave-active {
        opacity: 0;
    }
</style>
<style>
    .sortable-ghost {
        background-color: #30B08F!important;
    }
</style>