<template>
  <div>
    <el-dialog
      title="帖子回复"
      :visible.sync="dialogVisible"
      width="70%"
      top="5vh"
      :modal-append-to-body="false"
      append-to-body
    >
      <el-container
        style="height: 71vh; margin-top: -30px; margin-bottom: -30px"
      >
        <el-main style="height: 45vh; padding: 0; overflow-y: auto">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
            ref="multipleTable"
          >
            <el-table-column label="回复内容" min-width="180px">
              <template slot-scope="{ row }">
                <div>
                  <span style="color:blue;" v-if="row.reply_user"
                    >@{{
                      row.reply_user.nickname || row.reply_user.username
                    }}</span
                  >
                  {{ row.content }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="用户" min-width="100px">
              <template slot-scope="{ row }">
                <div>
                  {{ row.user.nickname || row.user.username }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="回复时间" min-width="180px">
              <template slot-scope="{ row }">
                {{ row.created_time }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
    <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
</el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <pagination
            :total="total"
            :page.sync="form.page"
            :limit.sync="form.limit"
            @pagination="getData"
            style="padding: 0; padding-top: 10px; margin: 0"
            layout="total,prev,pager,next"
          />
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
import { fetchPostComment, deletePostComment } from "@/api/bbs";

import Pagination from "@/components/Pagination";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        page: 1,
        limit: 10,
        post_id:0
      },
      tableKey: 0,
      listLoading: true,
      list: [],
      total: 0,
      multipleSelection: [],
    };
  },
  methods: {
    getData() {
      this.listLoading = true;
      fetchPostComment(this.form).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        this.listLoading = false;
      });
    },
    open(id) {
      this.form.post_id = id
      this.dialogVisible = true;
      this.getData();
    },
    close() {
      this.dialogVisible = false;
      this.form.post_id = 0
    },
    handleFilter() {
      this.form.page = 1;
      this.getData();
    },
    handleDelete(row, index) {
                this.$confirm('是否要删除该帖子', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(action => {
                  this.listLoading = true
                    deletePostComment({
                      post_id:this.form.post_id,
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
                })
            },
  },
};
</script>
<style>
</style>