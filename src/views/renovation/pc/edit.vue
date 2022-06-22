<template>
    <div style="background-color: #eeeeee;" v-loading="loading">
        <el-row :gutter="20">
            <el-col :span="4" :offset="0">
                <el-card style="height: 80vh;overflow-y:auto;" :body-style="{ padding:'10px 8px' }">
                    <el-row :gutter="20">
                        <el-col :span="24" :offset="0" v-for="(item,index) in components" :key="index"
                            style="margin-bottom: 10px;">
                            <el-card shadow="hover" :body-style="{ padding: '15px 8px','cursor':'pointer' }"
                                @click.native="handleComponent(item)">
                                <div style="display: flex;align-items: center;">
                                    <i :class="item.icon" style="font-size: 25px;color: #13ce66;margin-right: 8px;"></i>
                                    <span style="font-size: 13px;;">{{item.title}}</span>
                                </div>
                            </el-card>
                        </el-col>

                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="15" :offset="0" style="height:85vh;overflow-y:auto;">
                <el-row :gutter="20">
                    <el-col :span="23" :offset="0" style="padding-top:20px;">
                        <el-card style="min-height: 80vh;overflow: inherit;" :body-style="{padding:'0px 8px'}">

                    <div style="margin-left: -10px;margin-right: -10px;">
                        <div class="checked-box" v-for="(item,index) in templates" :key="index"
                            :class="item.checked ? 'checked-box-active':''" @click="handleCheckedComponent(item)">
                            <!-- 操作按钮 -->
                            <div v-if="item.checked" class="checked-box-btns">
                                <i class="el-icon-top" :class="index == 0 ? 'i-disabled':''"
                                    @click.stop="moveUp(index)"></i>
                                <i class="el-icon-bottom" :class="(index + 1) == templates.length ? 'i-disabled':''"
                                    @click.stop="moveDown(index)"></i>
                                <i class="el-icon-delete" @click.stop="deleteComponent(index)"></i>
                            </div>
                            <!-- 组件 -->
                            <template v-if="item.type == 'list'">
                                <list :title="item.title" :showMore="item.showMore" :list="item.data" :listType="item.listType"></list>
                            </template>
                            <template v-else-if="item.type == 'swiper'">
                                <swiper :list="item.data"></swiper>
                            </template>
                            <template v-else-if="item.type == 'icons'">
                                <icons :list="item.data"></icons>
                            </template>
                            <template v-else-if="item.type == 'promotion'">
                                <promotion :title="item.title" :list="item.data" :listType="item.listType"></promotion>
                            </template>
                            <template v-else-if="item.type == 'imageAd'">
                                <image-ad :list="item.data"></image-ad>
                            </template>    
                             <template v-else-if="item.type == 'header'">
                                <nav-bar :logo="item.logo" :data="item.data"></nav-bar>
                            </template>    
                            <template v-else-if="item.type == 'footer'">
                                <page-footer :data="item.data" :beian="item.beian"></page-footer>
                            </template>
                        </div>
                    </div>

                </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>


<div v-show="currentComponent.type && currentComponent.type != 'coupon'" style="position: fixed;right: 0px;top: 80px;">
    <el-card shadow="never" :body-style="{ padding: '20px' }" style="width: 250px;height: 85vh;position: relative;border:0;">
        <div slot="header">
            <span>组件编辑</span>
        </div>
        <div style="overflow-y: auto;position: absolute;left: 0;right: 0;bottom: 0;top: 60px;">
            <component-form ref="componentForm" :formType="currentComponent.type" @change="onCurrentComponentChange"></component-form>
        </div>
    </el-card>

</div>

<el-button style="position: fixed;right: 5px;top: 90px;z-index: 1000;" type="primary" size="default" @click="handleSave">保存</el-button>

</div>
</template>
<script>
    import util from '@/utils/util.js'
    import componentForm from './components/component-form.vue'
    import list from './components/list.vue'
    import swiper from './components/swiper.vue'
    import imageAd from './components/imageAd.vue'
    import icons from './components/icons.vue'
    import promotion from './components/promotion.vue'
    import navBar from './components/nav-bar.vue'
    import pageFooter from './components/page-footer.vue'

    let id = 0
    import {
        readPage,
        updatePage
    } from '@/api/renovation'


    export default {
        components: {
            componentForm,
            list,
            swiper,
            icons,
            promotion,
            imageAd,
            navBar,
            pageFooter
        },
        beforeRouteEnter(to, from, next) {
            id = to.query.id
            next()
        },
        data() {
            return {
                id,
                
                components: [{
                    icon: "el-icon-s-order",
                    title: "课程列表",
                    type: "list",
                    default: {
                        listType: "one",
                        title: "最新列表",
                        showMore: true,
                        more: false,
                        data: []
                    }
                }, {
                    icon: "el-icon-s-help",
                    title: "轮播图",
                    type: "swiper",
                    default: {
                        data:[]
                    }
                },{
                    icon: "el-icon-menu",
                    title: "图标分类",
                    type: "icons",
                    default: {
                        data:[{
                            src:"https://dummyimage.com/155x60",
                            name:"分类",
                            type:"",
                            url:"",
                            page_id:0,
                            page_title:"",
                            course_title:"",
                            course_id:"",
                        },{
                            src:"https://dummyimage.com/155x60",
                            name:"分类",
                            type:"",
                            url:"",
                            page_id:0,
                            page_title:"",
                            course_title:"",
                            course_id:"",
                        },{
                            src:"https://dummyimage.com/155x60",
                            name:"分类",
                            type:"",
                            url:"",
                            page_id:0,
                            page_title:"",
                            course_title:"",
                            course_id:"",
                        },{
                            src:"https://dummyimage.com/155x60",
                            name:"分类",
                            type:"",
                            url:"",
                            page_id:0,
                            page_title:"",
                            course_title:"",
                            course_id:"",
                        }]
                    }
                },{
                    icon: "el-icon-s-order",
                    title: "限时拼团",
                    type: "promotion",
                    default: {
                        listType: "group",
                    }
                },{
                    icon: "el-icon-picture-outline",
                    title: "图片广告",
                    type: "imageAd",
                    default: {
                        data:[]
                    }
                },{
                    icon: "el-icon-s-grid",
                    title: "导航栏",
                    type: "header",
                    default: {
                        logo:"",
                        data:[]
                    }
                },{
                    icon: "el-icon-s-check",
                    title: "底部",
                    type: "footer",
                    default: {
                        data:[],
                        beian:""
                    }
                }],

                templates: [],

                title:"",

                loading:false
            }
        },
        computed: {
            // 当前选中的组件
            currentComponent() {
                let i = this.templates.findIndex(v => v.checked)
                return this.templates[i] || {}
            }
        },
        created() {
            this.getDetail()
        },
        methods: {
            handleSave() {
                this.loading = true
                updatePage({
                    id: this.id,
                    title: this.title,
                    ismobile: 0,
                    template: this.templates
                }).then(res => {
                    this.getDetail()
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                    });
                }).finally(() => {
                    this.loading = false
                })
            },
            getDetail(){
                this.loading = true
                readPage({
                    id
                }).then(res => {
                    this.title = res.data.title
                    this.templates = res.data.template
                }).finally(() => {
                    this.loading = false
                })
            },
            // 监听表单组件的表单变化
            onCurrentComponentChange(e) {
                let i = this.templates.findIndex(v => v.checked)
                if (i != -1) {
                    this.templates[i][e.key] = e.value
                }
            },
            // 点击组件
            handleComponent(row) {
                let data = JSON.parse(JSON.stringify(row.default))
                data.checked = false
                data.type = row.type
                this.templates.push(data)
            },
            // 选中组件
            handleCheckedComponent(row) {
                this.templates.map(v => {
                    v.checked = false
                    return v
                })

                row.checked = true

                this.$refs.componentForm.initVal(row)
            },
            deleteComponent(index) {
                this.$confirm('是否要删除该组件?', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.templates.splice(index, 1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            },
            moveUp(index) {
                if (index == 0) {
                    return
                }
                util.moveUp(this.templates, index)
            },
            moveDown(index) {
                if (index == (this.templates.length - 1)) {
                    return
                }
                util.moveDown(this.templates, index)
            }
        },
    }
</script>
<style>
    .checked-box {
        cursor: pointer;
        position: relative;
    }
    
    .checked-box-active {
        border: 2px dotted #2196f3;
        padding: 5px 0;
        margin-bottom: 10px;
    }
    
    .checked-box-btns {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        border: 2px dotted #2196f3;
        right: -29px;
        top: -2px;
        z-index: 999;
        border-left-width: 0;
    }
    
    .checked-box-btns i {
        padding: 4px 6px;
        color: #2196f3;
        font-weight: bold;
    }
    
    .checked-box-btns i:hover {
        background-color: #eeeeee;
    }
    
    .checked-box-btns .i-disabled {
        background-color: #ffffff;
        cursor: no-drop;
        color: #bbbbbb;
    }
</style>