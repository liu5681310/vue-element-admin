<template>
    <div>
        <el-dialog
        title="选择课程"
        :visible.sync="dialogVisible"
        width="70%"
        top="5vh"
        :modal-append-to-body="false"
        append-to-body>
        
        <el-container style="height:71vh;margin-top: -30px;margin-bottom: -30px;">
            <el-header>
                <div style="display: flex;justify-content: flex-end;">
                    <el-input v-model="form.title" placeholder="标题" size="small" clearable style="width: 200px;margin-right: 10px;"></el-input>
                    <el-button type="primary" size="small" @click="handleFilter">搜索</el-button>
                    
                </div>
            </el-header>
            <el-container>
                <el-aside width="160px" style="height:60vh;background-color:#fbfbfb;border: 1px solid #eeeeee;height: 45vh;padding: 0;overflow-y: auto;">
                    <el-menu :default-active="key" @select="onAsideSelect"
                    style="background-color:#fbfbfb;border:0;">
                        <el-menu-item :index="item.index" v-for="(item,index) in menus" :key="index">{{ item.name }}</el-menu-item>
                    </el-menu>
                    
                </el-aside>
                <el-container>
                    <el-main style="height: 45vh;padding: 0;overflow-y: auto;">
                        <el-table
                            :key="tableKey"
                            v-loading="listLoading"
                            :data="list"
                            border
                            fit
                            highlight-current-row
                            style="width: 100%;"
                            ref="multipleTable"
                            @selection-change="handleSelectionChange"
                        >
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column label="内容" min-width="180px">
                        <template slot-scope="{row}">
                            <div style="display: flex;">
                                <img :src="row.cover" style="width: 100px;height: 50px;margin-right: 10px;">
                                <div style="display: flex;flex-direction: column;justify-content: space-between;">
                                    <span>{{ row.title }}</span>
                                    <span style="color: red;">￥{{ row.price }}</span>
                                </div>
                            </div>
                        </template>
</el-table-column>
</el-table>
</el-main>
<el-footer>
    <pagination :total="total" :page.sync="form.page" :limit.sync="form.limit" @pagination="getData" style="padding: 0; padding-top: 10px;margin: 0;" layout="total,prev,pager,next" />
</el-footer>
</el-container>
</el-container>
</el-container>

<span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
</el-dialog>

</div>
</template>
<script>
    // let M = {}

    // function importAll(r) {
    //     r.keys().forEach(key => M[key] = r(key))
    // }

    // importAll(require.context('@/api/', true, /\.js$/))

    // console.log(M)

    import {
        fetchList
    } from '@/api/course'

    import {
        fetchList as fetchColumn
    } from '@/api/column'

    import Pagination from '@/components/Pagination'
    export default {
        components: {
            Pagination
        },
        props:{
            menusType:{
                type:String,
                default:"course"
            }
        },
        data() {
            return {
                key: "media",
                dialogVisible: false,
                form: {
                    title: "",
                    page: 1,
                    limit: 10,
                    type:"media"
                },
                tableKey: 0,
                listLoading: true,
                list: [],
                total: 0,
                multipleSelection: [],
                callback: null,
                limit: -1
            };
        },
        computed:{
            menus(){
                if(this.menusType == 'course'){
                    return  [{
                        name: "图文",
                        index: "media"
                    }, {
                        name: "音频",
                        index: "audio"
                    }, {
                        name: "视频",
                        index: "video"
                    }]
                }
                else if(this.menusType == 'column'){
                    return [{
                        name:"专栏",
                        index:"column"
                    }]
                } else {
                    return [{
                        name: "图文",
                        index: "media"
                    }, {
                        name: "音频",
                        index: "audio"
                    }, {
                        name: "视频",
                        index: "video"
                    },{
                        name:"专栏",
                        index:"column"
                    }]
                }

            }
        },
        methods: {
            getData() {
                this.listLoading = true
                if(this.key == 'column' || this.menusType == 'column'){
                    fetchColumn(this.form).then(response => {
                        this.list = response.data.items
                        this.total = response.data.total

                        this.listLoading = false
                    })
                    return
                }
                fetchList(this.form).then(response => {
                    this.list = response.data.items
                    this.total = response.data.total

                    this.listLoading = false
                })
            },
            open(callback, limit = -1) {
                this.dialogVisible = true
                this.getData()
                this.limit = limit
                this.callback = callback
            },
            close() {
                this.dialogVisible = false
            },
            confirm() {
                if (this.multipleSelection.length === 0) {
                    return this.$message.error('至少选中一个')
                }
                if (this.limit != -1 && this.multipleSelection.length > this.limit) {
                    return this.$message.error('最多可以选中' + this.limit + '个')
                }
                this.callback(this.multipleSelection)
                this.close()
                    // 清空选中
                this.$refs.multipleTable.clearSelection()
            },
            handleFilter() {
                this.form.page = 1
                this.getData()
            },
            onAsideSelect(e) {
                this.key = e
                this.form.page = 1
                this.form.type = this.key
                this.getData()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
<style>

</style>