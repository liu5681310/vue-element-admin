<template>
    <div class="app-container">
        <el-card shadow="never" v-loading="detailLoading">
            <div style="display: flex;align-items: flex-start;">
                <img :src="detail.cover" style="width: 200px;height: 100px;margin-right: 20px;">
                <div style="flex: 1;">
                    <div style="display: flex;justify-content: space-between;">
                        <h4 style="margin-top: 5px;margin-bottom: 0;">{{detail.title}}</h4>
                        <small style="color: #bbbbbb;">{{ detail.isend ? '已完结' : '连载中' }}</small>
                    </div>
                    <p style="margin: 8px 0;">
                        <small style="color: #bbbbbb;">{{ detail.try }}</small>
                    </p>
                    <p>
                        <small style="color: red;">￥{{ detail.price }}</small>
                    </p>
                    <el-button-group >
                        <el-button size="small" type="warning" @click="changeDetailStatus">
                            {{ detail.status ? '下架' : '上架' }}
                        </el-button>
                        <el-button size="small" type="default" @click="changeDetailIsend">设为{{ detail.isend ? '连载中' : '已完结' }}</el-button>
                    </el-button-group>
                </div>
            </div>
        </el-card>
        
        <div class="filter-container" style="display:flex;justify-content: space-between;margin-top:20px;">
       <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addCourse">
        新增目录
      </el-button>
      
    </div>

    <el-table 
    ref="dragTable" 
    v-loading="listLoading" 
    :data="list" 
    row-key="id" 
    border 
    fit 
    highlight-current-row 
    style="width: 100%">
      <el-table-column
      type="index"
      width="50">
    </el-table-column>

      <el-table-column label="单品内容" min-width="180px">
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
<el-table-column label="订阅量" width="110px" align="center">
    <template slot-scope="{row}">
        <span>{{ row.sub_count }}</span>
    </template>
</el-table-column>
    
<el-table-column label="状态" class-name="status-col" width="100">
    <template slot-scope="{row}">
        <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status | statusFilter }}
        </el-tag>
    </template>
</el-table-column>

<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row,$index)" style="margin-left:10px;">
               <el-button v-if="row.status!='deleted'" size="mini" type="danger" slot="reference">删除</el-button>
           </el-popconfirm>
    </template>
</el-table-column>

      <el-table-column align="center" label="Drag" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
    </el-table>


<choose-course ref="chooseCourse"></choose-course>


    </div>
</template>
<script>
    let id = 0
    const statusOptions = {
        0:"已下架",
        1:"已上架"
    }
    import waves from '@/directive/waves' // waves directive
    import {
        fetchDetail,
        fetchDetailCourse,
        updateStatus,
        updateEnd,
        createColumnCourse,
        deleteColumnCourse,
        sortColumnCourse
    } from '@/api/column.js'

    import Sortable from 'sortablejs'
    import chooseCourse from '@/components/chooseCourse/index.vue'

    export default {
        components:{
            chooseCourse
        },
        directives: {
            waves
        },
        beforeRouteEnter(to, from, next) {
            id = to.query.id
            next()
        },
         filters: {
            statusFilter(status) {
                return statusOptions[status]
            },
        },
        data() {
            return {
                list: [],
                listLoading: true,
                detailLoading:false,
                detail: {
                    content: "",
                    cover: "",
                    created_time: "",
                    id: 0,
                    isend: 0,
                    price: 0,
                    status: 1,
                    sub_count: 0,
                    title: "",
                    try: "",
                    updated_time: ""
                },
                listQuery: {
                    column_id:id,
                    page:1
                },
                statusOptions,
            }
        },
        created() {
            this.getData()
            this.getList()
        },
        methods: {
            addCourse(){
                this.$refs.chooseCourse.open((val)=>{
                    let count = 0
                    this.listLoading = true
                    val.forEach(o=>{
                        createColumnCourse({
                            column_id:id,
                            course_id:o.id
                        }).then(res=>{
                            count = count + 1
                            if(count >= val.length){
                                this.getList()
                            }
                        }).finally(()=>{
                            if(count >= val.length){
                                this.listLoading = false
                            }
                        })
                    })
                },50)
            },
            handleDelete(row, index) {
                this.listLoading = true
                deleteColumnCourse({
                    ids: [row.id],
                    column_id: id
                }).then(res=>{
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
            handleFilter(){

            },
            getData() {
                this.detailLoading = true
                fetchDetail({
                    id
                }).then(res => {
                    this.detail = res.data
                }).finally(()=>{
                    this.detailLoading = false
                })
            },
            changeDetailStatus(){
                let status = this.detail.status ? 0 : 1
                this.detailLoading = true
                updateStatus({
                    id,
                    status
                }).then(res=>{
                    this.detail.status = status
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                    });
                }).finally(()=>{
                    this.detailLoading = false
                })
                
            },
            changeDetailIsend(){
                let isend = this.detail.isend ? 0 : 1
                this.detailLoading = true
                updateEnd({
                    id,
                    isend
                }).then(res=>{
                    this.detail.isend = isend
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                    });
                }).finally(()=>{
                    this.detailLoading = false
                })
            },
            async getList() {
                this.listLoading = true
                const { data } = await fetchDetailCourse(this.listQuery)
                this.list = data.items
                this.total = data.total
                this.listLoading = false
                this.oldList = this.list.map(v => v.id)
                this.newList = this.oldList.slice()
                this.$nextTick(() => {
                    this.setSort()
                })
            },

            setSort() {
                const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                    setData: function(dataTransfer) {
                    // to avoid Firefox bug
                    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                    dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                        this.list.splice(evt.newIndex, 0, targetRow)

                        // for show the changes, you can delete in you code
                        const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                        this.newList.splice(evt.newIndex, 0, tempIndex)
                        this.listLoading = true
                        sortColumnCourse({
                            ids:this.newList,
                            column_id:id
                        }).then(res=>{
                            this.$message({
                                message: '排序成功',
                                type: 'success',
                            });
                        }).finally(()=>{
                            this.listLoading = false
                            this.getList()
                        })
                    }
                })
            }

        },
    }
</script>
<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>
<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>