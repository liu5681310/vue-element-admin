<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '0' }">
      <div slot="header">
        <span>最新课程</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :border="false"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="内容" min-width="180px">
          <template slot-scope="{ row }">
            <div style="display: flex">
				<el-image :src="row.cover"  style="width: 100px; height: 50px; margin-right: 10px"></el-image>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <span>{{ row.title }}</span>
                <span style="color: red">￥{{ row.price }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.created_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {
  fetchList
} from '@/api/course'
import {
        parseTime
    } from '@/utils'
export default {
    data() {
        return {
            listLoading:false,
            list:[]
        }
    },
    created(){
      this.listLoading = true
      fetchList({
        page:1
      }).then(res=>{
        this.list = res.data.items
      }).finally(()=>{
        this.listLoading = false
      })
    }
};
</script>