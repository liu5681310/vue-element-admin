<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '0' }">
      <div slot="header">
        <span>最新订单</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :border="false"
        fit
        highlight-current-row
        style="width: 100%"
      >
<el-table-column label="商品名称" min-width="150px">
    <template slot-scope="{row}">
       <p v-for="(item,index) in row.goods" :key="index">{{ item.title }}</p>
	   <p v-if="row.goods.length == 0">商品已被删除</p>
    </template>
</el-table-column>
<el-table-column label="订单类型" width="100" align="center">
    <template slot-scope="{row}">
       {{ row.type | typeFilter }}
    </template>
</el-table-column>
<el-table-column label="订单状态" width="100" align="center">
    <template slot-scope="{row}">
        <el-tag :type="row.status == 'success' ? 'success' : 'danger'" >
            {{ row.status | statusFilter }}
        </el-tag>
    </template>
</el-table-column>
<el-table-column label="创建时间" width="180" align="left">
    <template slot-scope="{row}">
        <p>创建时间：{{ row.created_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</p>
    </template>
</el-table-column>

      </el-table>
    </el-card>
  </div>
</template>
<script>
import {
        parseTime
    } from '@/utils'
    let statusOptions = {
        pendding:"待支付",
        success:"成功",
        fail:"失败",
		closed:"已关闭"
    }
    let typeOptions = {
        group:"拼团",
        default:"普通"
    }
    import {
        fetchOrder
    } from '@/api/pay'
export default {
    filters:{
        statusFilter(val){
			console.log(val)
            return statusOptions[val]
        },
        typeFilter(val){
            return typeOptions[val]
        },
    },
    data() {
        return {
            listLoading:false,
            list:[]
        }
    },
    created(){
      this.listLoading = true
      fetchOrder({
        page:1
      }).then(res=>{
        this.list = res.data.items
		console.log(this.list);
      }).finally(()=>{
        this.listLoading = false
      })
    }
};
</script>