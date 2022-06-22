<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
      <div>
      <el-input v-model="listQuery.keyword" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      </div>
      
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      ref="multipleTable"
    >
<el-table-column label="用户" min-width="180px">
    <template slot-scope="{row}">
        <div style="display: flex;align-items: center;">
            <img :src="row.user.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'" style="width: 50px;height: 50px;margin-right: 10px;border-radius: 100%;">
            <span>{{ row.user.username }}</span>
        </div>
    </template>
</el-table-column>
<el-table-column label="消费总额" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.total_consume }}</span>
    </template>
</el-table-column>
<el-table-column label="创建时间" width="150px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.created_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="openInfo(row.id)">
            详情
          </el-button>
          <el-dropdown>
            <el-button type="danger" size="mini">
                黑名单设置<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changeCommentStatus(row.user.id)">禁止评论</el-dropdown-item>
                <el-dropdown-item @click.native="changeAccessStatus(row.user.id)">禁止访问</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
          
        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


<info ref="info"></info>

</div>
</template>

<script>
    import {
        fetchList,
        changeCommentStatus,
        changeAccessStatus
    } from '@/api/user'

    import waves from '@/directive/waves' // waves directive
    import Tinymce from '@/components/Tinymce'
    import {
        parseTime
    } from '@/utils'
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    import info from './info'
    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
            Tinymce,
            info
        },
        directives: {
            waves
        },
        data() {
            return {
                tableKey: 0,
                list: [],
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    keyword: undefined,
                },
                multipleSelection: []
            }
        },
        created() {
            this.getList()
        },
        methods: {
            openInfo(id) {
                this.$refs.info.open(id)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getList() {
                this.listLoading = true
                fetchList(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.items
                    this.total = response.data.total

                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            changeCommentStatus(ids){
                if(typeof ids == 'boolean' && !this.multipleSelection.length){
                    return this.$message({
                            message: '请先选中需要操作的用户',
                            type: 'error',
                        });
                }
                let id = typeof ids == 'boolean' ? this.multipleSelection.map(item=>item.id) : ids
                let allText = typeof ids == 'boolean' ? '选中' : '当前'
                this.$confirm('是否要禁止'+allText+'用户评论？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {
                    this.listLoading = true
                    changeCommentStatus({
                        id,
                        no_comment:0
                    }).then(res=>{
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                        });
                        this.$refs.multipleTable.clearSelection()
                        this.listLoading = false
                    })
                    
                })
            },
            changeAccessStatus(ids){
                if(typeof ids == 'boolean' && !this.multipleSelection.length){
                    return this.$message({
                            message: '请先选中需要操作的用户',
                            type: 'error',
                        });
                }
                let id = typeof ids == 'boolean' ? this.multipleSelection.map(item=>item.id) : ids
                let allText = typeof ids == 'boolean' ? '选中' : '当前'
                this.$confirm('是否要禁止'+allText+'用户访问？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {
                    this.listLoading = true
                    changeAccessStatus({
                        id,
                        no_access:0
                    }).then(res=>{
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                        });
                        this.$refs.multipleTable.clearSelection()
                        this.listLoading = false
                    })
                    
                })
            }
        }
    }
</script>