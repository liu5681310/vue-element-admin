<template>
    <div>
        <el-dialog
        title="选择题目"
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
                        <el-table-column label="类型" width="100px">
                            <template slot-scope="{row}">
                                <span>{{ row.type | typeFilter }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="题目">
                        <template slot-scope="{row}">
                            <span v-html="row.title"></span>
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

    import {
        fetchQuestion,
    } from '@/api/question'

    import Pagination from '@/components/Pagination'
    const typeOptions = {
        radio:"单选题",
        checkbox:"多选题",
        trueOrfalse:"判断题",
        answer:"问答题",
        completion:"填空题",
    }
    export default {
        components: {
            Pagination
        },
        filters:{
            typeFilter(type){
                return typeOptions[type]
            }
        },
        data() {
            return {
                dialogVisible: false,
                form: {
                    title: "",
                    page: 1,
                    limit: 10
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
        methods: {
            getData() {
                this.listLoading = true
                fetchQuestion(this.form).then(response => {
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
<style>

</style>