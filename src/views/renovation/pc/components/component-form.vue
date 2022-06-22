<template>
    <div>
        <el-form ref="form" label-width="80px" size="normal">
        <el-form-item v-if="formType == 'search'" label="占位提示">
            <el-input v-model="search.placeholder" size="mini" style="width:200px;" @input="handleChange('placeholder')"></el-input>
        </el-form-item>

        <template v-else-if="formType == 'promotion'">
            <el-form-item label="类型">
                <el-radio-group v-model="promotion.listType" @change="handleChange('listType')">
                    <el-radio label="group">拼团</el-radio>
                    <el-radio label="flash">限时活动</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="标题">
                <el-input v-model="promotion.title" size="mini" style="width:200px;" @input="handleChange('title')"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="handleChooseCourse">关联课程</el-button>
                    <span>最多关联10门</span>
                </div>
            </el-form-item> -->
            <!-- <drag-course :list="promotion.data" @del="deleteCourse"></drag-course> -->
        </template>

        <template v-else-if="formType == 'list'">
            <el-form-item label="标题">
                <el-input v-model="list.title" size="mini" style="width:150px;" @input="handleChange('title')"></el-input>
            </el-form-item>
            <el-form-item label="更多">
                <el-radio-group v-model="list.showMore" @change="handleChange('showMore')">
                    <el-radio :label="true">显示</el-radio>
                    <el-radio :label="false">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="更多链接">
                <el-button type="default" size="mini" @click="handleChoosePage">{{ list.more ? list.more.title : '选择页面' }}</el-button>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="handleChooseCourse">关联课程</el-button>
                    <span>最多关联10门</span>
                </div>
            </el-form-item>
            <drag-course :list="list.data" @del="deleteCourse"></drag-course>
        </template>
        <template v-else-if="formType == 'swiper'">
            <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="createSwiper">新增轮播图</el-button>
                    <span>最多5张</span>
                </div>
            </el-form-item>
            <drag-swiper :list="swiper.data" @del="deleteSwiper"></drag-swiper>
        </template>
        <template v-else-if="formType == 'imageAd'">
            <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="createImageAd">新增图片</el-button>
                </div>
            </el-form-item>
            <drag-swiper :list="imageAd.data" @del="deleteSwiper"></drag-swiper>
        </template>
        <template v-else-if="formType == 'icons'">
            <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="createIcon">新增分类</el-button>
                    <span>最多8张</span>
                </div>
            </el-form-item>
            <drag-icons :list="icons.data" @del="deleteIcons"></drag-icons>
        </template>
        <template v-else-if="formType == 'header'">
            <el-form-item label="logo">
                <el-input v-model="header.logo" size="mini" style="width:150px;" @input="handleChange('logo')"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="createNav('header')">新增导航</el-button>
                    <span>最多6个</span>
                </div>
            </el-form-item>
            <drag-nav :list="header.data" @del="deleteNav($event,'header')"></drag-nav>
        </template>
        <template v-else-if="formType == 'footer'">
            <el-form-item label="beian">
                <el-input v-model="footer.beian" size="mini" style="width:150px;" @input="handleChange('beian')"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
                <div class="choose-course-btn">
                    <el-button icon="el-icon-circle-plus-outline" type="text" @click="createNav('footer')">新增导航</el-button>
                    <span>最多6个</span>
                </div>
            </el-form-item>
            <drag-nav :list="footer.data" @del="deleteNav($event,'footer')"></drag-nav>
        </template>

    </el-form>

    <choose-course ref="chooseCourse"></choose-course>
    <choose-page ref="choosePage"></choose-page>
    <upload-image ref="uploadImage"></upload-image>
    </div>
</template>
<script>
import DragCourse from './drag-course.vue'
import DragSwiper from './drag-swiper.vue'
import chooseCourse from '@/components/chooseCourse/index.vue'
import choosePage from './choose-page.vue'
import uploadImage from './upload-image.vue'
import dragIcons from './drag-icons.vue'
import dragNav from './drag-nav.vue'
export default {
    components:{
        DragCourse,
        chooseCourse,
        choosePage,
        DragSwiper,
        uploadImage,
        dragIcons,
        dragNav
    },
    props:{
        formType:{
            type:String,
            default:""
        }
    },
    provide(){
        return {
            componentForm:this
        }
    },
    data() {
        return {
            search:{
                placeholder:""
            },
            promotion:{
                listType: "group",
            },
            list:{
                listType: "one",
                title: "",
                showMore: true,
                more: false,
                data: []
            },
            swiper:{
                data:[]
            },
            imageAd:{
                data:[]
            },
            icons:{
                data:[]
            },
            header:{
                logo:"",
                data:[]
            },
            footer:{
                beian:"",
                data:[]
            }
        }
    },
    methods:{
        // 打开选择课程框
        openChooseCourse(callback,limit){
            this.$refs.chooseCourse.open(callback,limit)
        },
        createImageAd(){
            if(this.imageAd.data.length === 1){
                return this.$message({
                    type:"error",
                    message:"最多只能创建1个"
                })
            }
            this.imageAd.data.push({
                src:"https://dummyimage.com/800x80",
                type:"", // 课程course,网页地址webview
                course_title:"",
                course_id:"",
                url:""
            })
        },
        // 新增轮播图
        createSwiper(){
            if(this.swiper.data.length === 5){
                return this.$message({
                    type:"error",
                    message:"最多只能创建5个"
                })
            }
            this.swiper.data.push({
                src:"https://dummyimage.com/365x150",
                type:"", // 课程course,网页地址webview
                course_title:"",
                course_id:"",
                url:""
            })
        },
         createNav(k){
            if(this[k].data.length === 6){
                return this.$message({
                    type:"error",
                    message:"最多只能创建6个"
                })
            }
            this[k].data.push({
                title:"分类",
                type:"",
                url:"",
                page_id:0,
                page_title:"",
                course_title:"",
                course_id:"",
            })
        },
        deleteNav(index,k){
            this.$confirm('是否要删除该导航？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(action => {
                this[k].data.splice(index,1)
            })
        },

        createIcon(){
            if(this.icons.data.length === 8){
                return this.$message({
                    type:"error",
                    message:"最多只能创建8个"
                })
            }
            this.icons.data.push({
                src:"https://dummyimage.com/155x60",
                name:"分类",
                type:"",
                url:"",
                page_id:0,
                page_title:"",
                course_title:"",
                course_id:"",
            })
        },
        deleteIcons(index){
            this.$confirm('是否要删除该分类？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(action => {
                this.icons.data.splice(index,1)
            })
        },
        // 删除轮播图
        deleteSwiper(index){
            this.$confirm('是否要删除该轮播图？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(action => {
                this[this.formType].data.splice(index,1)
            })
        },
        // 选择页面
        handleChoosePage(){
            this.$refs.choosePage.open((val)=>{
                this.list.more = val[0]
            },1)
        },
        // 删除关联
        deleteCourse(row){
            this.$confirm('是否要取消关联该课程？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(action => {
                let i = this[this.formType].data.findIndex(v=> v.id == row.id )
                if(i !== -1){
                    this[this.formType].data.splice(i,1)
                    this.$message({
                        message: '取消关联成功',
                        type: 'success',
                    });
                }
            })
        },
        // 关联课程
        handleChooseCourse(){
            this.$refs.chooseCourse.open((val)=>{
                this[this.formType].data = [
                    ...this[this.formType].data,
                    ...val
                ]
                this.handleChange('data')
            },10)
        },
        // 监听实时变化
        handleChange(key){
            this.$emit('change',{
                key,
                value:this[this.formType][key]
            })
        },
        // 初始化数据
        initVal(val){
            for(let k in val){
                this[val.type][k] = val[k]
            }
        }
    }
}
</script>
<style>
    .choose-course-btn{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px dotted #13CE66;
    }
    .choose-course-btn span{
        color: #888888;
        font-size: 12px;
    }
</style>
