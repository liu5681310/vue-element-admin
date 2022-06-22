<template>
    <div class="book" v-loading="listLoading">
        <div class="book-header">
            <span>电子书标题</span>
            <div style="display: flex;align-items: center;">
                <el-input v-model="temp.title" placeholder="章节名称" size="mini" style="margin-right: 10px;"></el-input>
                <el-checkbox v-model="temp.isfree" :true-label="1" :false-label="0" style="margin-right: 10px;">免费试看</el-checkbox>
                
                <el-button type="primary" size="mini" @click="handleUpdate">保存</el-button>
            </div>
        </div>
        <div class="book-body">
            <div style="height: 80vh;overflow-y: auto;">
                <drag-menu @click="handleClick" :list="list" @del="handleDelete"
                @sort="handleSort"></drag-menu>
                <div style="display: flex;align-items: center;justify-content: center;padding: 10px;">
                    <el-button type="primary" size="default" @click="handleCreate">添加章节</el-button>
                    
                </div>
            </div>
            <div>
                <tinymce ref="tinymce" :toolbar="editor.toolbar" v-model="content" :height="400" :width="500" />
            </div>
            <div class="book-content" v-html="content"></div>
        </div>
    </div>
</template>
<script>
    import {
        fetchBookDetail,
        createBookDetail,
        updateBookDetail,
        deleteBookDetail,
        sortBookDetial
    } from '@/api/book'
    import dragMenu from './components/drag-menu'
    import Tinymce from '@/components/Tinymce'

    let book_id = 0

    export default {
        components: {
            dragMenu,
            Tinymce
        },
        beforeRouteEnter(to,from,next){
            book_id = to.query.id
            next()
        },
        data() {
            return {
                listLoading: false,
                temp: {
                    id: 0,
                    title: "",
                    isfree: 0
                },
                list: [],
                content: '',
                editor: {
                    toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  ', 'blockquote undo removeformat code codesample forecolor backcolor fullscreen', 'hr bullist numlist link image table']
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
            handleSort(ids){
                this.listLoading = true
                sortBookDetial({
                    book_id,
                    ids
                }).then(res=>{
                    this.$message({
                        message: '排序成功',
                        type: 'success',
                    });
                }).finally(()=>{
                    this.listLoading = false
                })
            },
            handleUpdate() {
                this.listLoading = true
                updateBookDetail({
                    ...this.temp,
                    book_id,
                    content:this.content
                }).then(res => {
                    this.getList()
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                    });
                    this.listLoading = false
                })
            },
            getList() {
                this.listLoading = true
                fetchBookDetail({
                    book_id,
                    page: 1,
                    limit: 100
                }).then(res => {
                    this.list = res.data.items
                    this.listLoading = false
                })
            },
            handleClick(row) {
                this.content = row.content
                this.temp.title = row.title
                this.temp.isfree = row.isfree
                this.temp.id = row.id
                this.$refs.tinymce.setContent(this.content)
            },
            handleDelete(e) {
                let index = this.list.findIndex(item => item.id == e.id)
                if (index == -1) {
                    return
                }
                this.$confirm('是否要删除该章节？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {
                    this.listLoading = true
                    deleteBookDetail({
                        book_id,
                        ids:[this.list[index].id]
                    }).then(res=>{
                        this.list.splice(index, 1)
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                    }).finally(()=>{
                        this.listLoading = false
                    })
                })
            },
            handleCreate() {
                this.listLoading = true
                createBookDetail({
                    book_id,
                    title:"新章节",
                    isfree:0
                }).then(res => {
                    this.listLoading = false
                    this.list.push(res.data)
                })

            }
        },
    }
</script>
<style>
    .book {
        display: flex;
        flex-direction: column;
        height: 87vh;
    }
    
    .book-header {
        display: flex;
        justify-content: space-between;
        padding: 15px 20px;
        border-bottom: 1px solid #eeeeee;
        align-items: center;
    }
    
    .book-body {
        flex: 1;
        display: flex;
    }
    
    .book-body>div {
        flex: 1;
        border-right: 1px solid #eeeeee;
    }
    
    .mce-panel {
        border: 0!important;
    }
    
    .mce-tinymce {
        box-shadow: none!important;
    }
    
    .book-content {
        word-break: break-all;
        padding: 5px 15px 30px 15px;
        overflow-y: auto;
        height: 82vh;
        box-sizing: border-box;
    }
    
    .book-content img {
        max-width: 100%!important;
    }
</style>