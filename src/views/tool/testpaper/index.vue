<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content: space-between;">
        <div>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" @click="openForm()">手动组卷</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" size="small" @click="$router.push({ name:'TestpaperTest' })">考试管理</el-button>
        </div>
      <div>
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
    >
      <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
<el-table-column label="试卷标题" min-width="180px">
    <template slot-scope="{row}">
        <span>{{ row.title }}</span>
    </template>
</el-table-column>
<el-table-column label="是否公开" class-name="status-col" width="100">
    <template slot-scope="{row}">
        <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status | statusFilter }}
        </el-tag>
    </template>
</el-table-column>
<el-table-column label="总分" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.total_score }}</span>
    </template>
</el-table-column>
<el-table-column label="及格分" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.pass_score }}</span>
    </template>
</el-table-column>
<el-table-column label="时长（分钟）" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.expire }}</span>
    </template>
</el-table-column>
<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="openForm(row.id)">
            编辑
          </el-button>
          <el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference">删除</el-button>
           </el-popconfirm>
        </template>
</el-table-column>
</el-table>

<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

</div>
</template>

<script>
    import {
        fetchTestpaper,
        createTestpaper,
        updateTestpaper,
        deleteTestpaper,
    } from '@/api/testpaper'

    import waves from '@/directive/waves' // waves directive

    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    const statusOptions = {
        0:"否",
        1:"是"
    }


    export default {
        name: 'ComplexTable',
        components: {
            Pagination,
        },
        directives: {
            waves
        },
        filters: {
            statusFilter(status) {
                return statusOptions[status]
            },
        },
        data() {
            return {
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    title: undefined,
                    sort: '+id'
                },
                statusOptions,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            openForm(id){
                this.$router.push({
                    name:"TestpaperForm",
                    query:{
                        id
                    }
                })
            },
            getList() {
                this.listLoading = true
                fetchTestpaper(this.listQuery).then(response => {
                    console.log(response.data)
                    this.list = response.data.items
                    this.total = response.data.total

                   this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleDelete(row, index) {
                this.listLoading = true
                deleteTestpaper({
                    ids:[row.id]
                }).then(response=>{
                    this.$notify({
                        title: '提示',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.list.splice(index, 1)
                }).finally(()=>{
                    this.listLoading = false
                })
            },
        }
    }
</script>